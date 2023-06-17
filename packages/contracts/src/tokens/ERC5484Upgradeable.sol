// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC721EnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {CountersUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import {IERC5484} from "./IERC5484.sol";

contract ERC5484Upgradeable is
    IERC5484,
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @dev burn mode with different behavior
    BurnAuth private _burnAuth;

    /// @dev Token can me minted only once per user
    bool private _mintOnce;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /// @dev Modifier to protect a burn a token without permission
    modifier allowedTransfer(address to, address from, uint256 tokenId) {
        bool isMint = from == address(0);
        bool isBurner = hasRole(BURNER_ROLE, msg.sender);
        bool isBurn = !isMint && to == address(0);
        if(_burnAuth == BurnAuth.Neither) {
            // nobody can burn token
            require(isMint, "ERC5484: can't be transferred");
        } else if(_burnAuth == BurnAuth.IssuerOnly) {
            // only issuer can burn token
            // so we are checking if token is generation with condition from == address(0)
            // or we are checking that token belongs to other user and message sender is owner and it is burn operation
            bool isBurnOperation = isBurner && isBurn;
            require(isMint || isBurnOperation, "ERC5484: can't be transferred");
        } else if (_burnAuth == BurnAuth.OwnerOnly){
            // only owner can burn token
            // so we are checking if token is generation with condition from == ownerOf(tokenId) and it is burn operation
            bool isOwner = _ownerOf(tokenId) == msg.sender && hasRole(BURNER_ROLE, msg.sender);
            require(isMint || (isOwner && isBurn), "ERC5484: can't be transferred");
        } else if (_burnAuth == BurnAuth.Both) {
            // both owner and issuer can burn token
            // so we are checking if token is minting with condition from == address(0)
            // or we are checking that token belongs to other user and message sender is owner and it is burn operation
            require(isMint || (isBurn && isBurner), "ERC5484: can't be transferred");
        }
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
//    constructor()
//    {
//        _disableInitializers(); //todo discuss what proper way to initialize in scope uip proxy migation
//    }

    function __ERC5484Upgradeable_init(
        string memory name_,
        string memory symbol_,
        BurnAuth burnAuth_,
        bool mintOnce_,
        address admin_
    ) internal onlyInitializing {
        __ERC721_init(name_, symbol_);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        _burnAuth = burnAuth_;
        _mintOnce = mintOnce_;

        // setup roles depend on mode for SoulBound token
        _setupRole(DEFAULT_ADMIN_ROLE, admin_);
        _setupRole(MINTER_ROLE, admin_);
        if(burnAuth_ == BurnAuth.IssuerOnly || burnAuth_ == BurnAuth.Both) {
            _setupRole(BURNER_ROLE, admin_);
        }
    }

    /// @dev function for mint new SBT token
    function safeMint(address to, string memory uri) public onlyRole(MINTER_ROLE) {
        // allow to mint only once per user if _mintOnce is true
        require(!_mintOnce || balanceOf(to) == 0,"ERC5484: User already has token");

        // mint token
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // set permission to burn token
        if(_burnAuth == BurnAuth.OwnerOnly || _burnAuth == BurnAuth.Both) {
            _setupRole(BURNER_ROLE, to);
        }

        // emit event
        emit Issued(address(0), to, tokenId, _burnAuth);
    }

    /// @dev Token is SOUL BOUND and it is not allowed to move token between users
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        allowedTransfer(to, from, tokenId)
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /// @dev Burns `tokenId`. See {ERC721-_burn}.
    function burn(uint256 tokenId) external
        onlyRole(BURNER_ROLE)
        virtual
    {
        _burn(tokenId);
    }

    /// @dev See {ERC721-_burn}
    function _burn(uint256 tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable){
        super._burn(tokenId);
    }

    /// @dev See {IERC721Metadata-tokenURI}.
    function tokenURI(uint256 tokenId) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable)
        virtual
        returns (bool)
    {
        return interfaceId == type(IERC5484).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @notice provides burn authorization of the token id.
    /// @dev unassigned tokenIds are invalid, and queries do throw
    /// @param tokenId The identifier for a token.
    function burnAuth(uint256 tokenId) external view returns (BurnAuth){
        require(_exists(tokenId), "ERC5484: token doesn't exists");
        return _burnAuth;
    }

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[48] private __gap;
}