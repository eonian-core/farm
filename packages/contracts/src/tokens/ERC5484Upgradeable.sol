// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./IERC5484.sol";

contract ERC5484Upgradeable is
    IERC5484,
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    // Token is burnable
    BurnAuth private _burnAuth;

    // Token can me minted only once per user
    bool private _mintOnce;

    /// @dev Modifier to protect a creation a new token for a user
    /// in case if this user has already have the token.
    modifier newUser(address to) {
        bool hasNoToken = balanceOf(to) == 0;
        require(hasNoToken, "ERC5484Upgradeable: User already has a token");
        _;
    }

    /// @dev Modifier to protect a burn a token without permission
    //todo check how to simplify this modifier
    modifier allowedBurn(address to, address from, uint256 tokenId) {
        if(_burnAuth == BurnAuth.Neither) {
            // nobody can burn token
            require(from == address(0), "ERC5484Upgradeable: token is SOUL BOUND and can't be transferred");
        } else if(_burnAuth == BurnAuth.IssuerOnly) {
            // only issuer can burn token
            // so we are checking if token is generation with condition from == address(0)
            // or we are checking that token belongs to other user and message sender is owner and it is burn operation
            require(from == address(0) || (from != address(0) && msg.sender == address(0) && to == address(0)),
                "ERC5484Upgradeable: token is SOUL BOUND and can be transferred by token issuer only");
        } else if (_burnAuth == BurnAuth.OwnerOnly){
            // only owner can burn token
            // so we are checking if token is generation with condition from == ownerOf(tokenId) and it is burn operation
            address owner = _ownerOf(tokenId);
            require((from == owner && to == address(0)) || owner == address(0),
                "ERC5484Upgradeable: token is SOUL BOUND and can be transferred by token owner only");
        } else if (_burnAuth == BurnAuth.Both) {
            // both owner and issuer can burn token
            // so we are checking if token is minting with condition from == address(0)
            // or we are checking that token belongs to other user and message sender is owner and it is burn operation
            address owner = _ownerOf(tokenId);
            require(from == address(0)
                || (from != address(0) && (msg.sender == address(0) || msg.sender == owner) && to == address(0)),
                "ERC5484Upgradeable: token is SOUL BOUND and can be transferred by token issuer or token owner only");
        }
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
//    constructor()
//    {
//        _disableInitializers();
//    }

    function __SBTERC721Upgradeable_init(
        string memory name_,
        string memory symbol_,
        BurnAuth burnAuth_,
        bool mintOnce_
    ) internal onlyInitializing {
        __ERC721_init(name_, symbol_);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Ownable_init();
        _burnAuth = burnAuth_;
        _mintOnce = mintOnce_;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        // allow to mint only once per user if _mintOnce is true
        bool hasNoToken = balanceOf(to) == 0;
        require(!_mintOnce || hasNoToken,"ERC5484Upgradeable: User already has a token");

        // mint token
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /// Token is SOUL BOUND and it is not allowed to move token between users
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        allowedBurn(to, from, tokenId)
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /// @dev Burns `tokenId`. See {ERC721-_burn}.
    function burn(uint256 tokenId) external
        allowedBurn(address(0), msg.sender, tokenId)
        virtual
    {
        _burn(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable){
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @notice provides burn authorization of the token id.
    /// @dev unassigned tokenIds are invalid, and queries do throw
    /// @param tokenId The identifier for a token.
    function burnAuth(uint256 tokenId) external view returns (BurnAuth){
        require(_exists(tokenId), "ERC5484Upgradeable: burnAuth query for nonexistent token");
        return _burnAuth;
    }
}