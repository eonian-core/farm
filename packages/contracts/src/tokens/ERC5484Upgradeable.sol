// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC721EnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {IAccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/IAccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {CountersUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import {IERC5484} from "./IERC5484.sol";

error ERC5484CanNotBeTransferred();
error ERC5484TokenDoNotExists();

// https://eips.ethereum.org/EIPS/eip-5484
contract ERC5484Upgradeable is
    IERC5484,
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // @dev utility object for counting tokens
    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @dev burn mode with different behavior
    BurnAuth private _burnAuth;

    /// @dev Token can me minted only once per user
    bool private _mintOnce;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

    /// @dev Role for minting tokens
    /// value is 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    /// @dev Role for burning tokens which can be used only if _burnAuth isn't BurnAuth.None
    /// value is 0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /// @dev Modifier to protect a burn a token without permission
    modifier allowedTransfer(address to, address from, uint256 tokenId) {
        bool isMint = from == address(0);
        bool isBurner = hasRole(BURNER_ROLE, msg.sender);
        bool isBurn = !isMint && to == address(0);
        if(_burnAuth == BurnAuth.Neither) {
            // nobody can burn token
            if(!isMint) {
                revert ERC5484CanNotBeTransferred();
            }
        } else if(_burnAuth == BurnAuth.IssuerOnly) {
            // only issuer can burn token
            // so we are checking if token is generation with condition from == address(0)
            // or we are checking that token belongs to other user and message sender is owner and it is burn operation
            bool isBurnOperation = isBurner && isBurn;
            if(!isMint && !isBurnOperation) {
                revert ERC5484CanNotBeTransferred();
            }
        } else if (_burnAuth == BurnAuth.OwnerOnly){
            // only owner can burn token
            // so we are checking if token is generation with condition from == ownerOf(tokenId) and it is burn operation
            bool isOwner = _ownerOf(tokenId) == msg.sender && hasRole(BURNER_ROLE, msg.sender);
            if(!isMint && (!isOwner || !isBurn)) {
                revert ERC5484CanNotBeTransferred();
            }
        } else if (_burnAuth == BurnAuth.Both) {
            // both owner and issuer can burn token
            // so we are checking if token is minting with condition from == address(0)
            // or we are checking that token belongs to other user and message sender is owner and it is burn operation
            if(!isMint && (!isBurn || !isBurner)) {
                revert ERC5484CanNotBeTransferred();
            }
        }
        _;
    }

    /* ///////////////////////////// CONSTRUCTORS ///////////////////////////// */

    function __ERC5484Upgradeable_init(
        string memory name_,
        string memory symbol_,
        BurnAuth burnAuth_,
        bool mintOnce_
    ) internal onlyInitializing {
        __ERC721_init(name_, symbol_);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        
        __ERC5484Upgradeable_init_unchained(burnAuth_, mintOnce_);
    }

    function __ERC5484Upgradeable_init_unchained(
        BurnAuth burnAuth_,
        bool mintOnce_
    ) internal onlyInitializing {
        _burnAuth = burnAuth_;
        _mintOnce = mintOnce_;

        // setup roles depend on mode for SoulBound token
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @dev function for mint new SBT token
    /// @param to address of user who will receive token
    /// @param uri token metadata uri
    /// @return true if token was minted
    function _safeMint(address to, string memory uri)
        internal
        virtual
        onlyRole(MINTER_ROLE)
        returns(bool)
    {
        // allow to mint only once per user if _mintOnce is true
        if(_mintOnce && balanceOf(to) != 0) {
            return false;
        }

        // mint token
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        super._safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // set permission to burn token
        if(_burnAuth == BurnAuth.OwnerOnly || _burnAuth == BurnAuth.Both) {
            _setupRole(BURNER_ROLE, to);
        }

        // emit event
        emit Issued(address(0), to, tokenId, _burnAuth);
        return true;
    }

    /// @dev Token is SOUL BOUND and it is not allowed to move token between users
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        virtual
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
    function _burn(uint256 tokenId) internal virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable){
        super._burn(tokenId);
    }

    /// @dev See {IERC721Metadata-tokenURI}.
    function tokenURI(uint256 tokenId) public view virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        virtual
        returns (bool)
    {
        return interfaceId == type(IERC5484).interfaceId
            || interfaceId == type(IAccessControlUpgradeable).interfaceId
            || super.supportsInterface(interfaceId);
    }

    /// @notice provides burn authorization of the token id.
    /// @dev unassigned tokenIds are invalid, and queries do throw
    /// @param tokenId The identifier for a token.
    function burnAuth(uint256 tokenId) external view virtual returns (BurnAuth){
        if(!_exists(tokenId)) {
            revert ERC5484TokenDoNotExists();
        }
        return _burnAuth;
    }
}