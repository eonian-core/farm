// SPDX-License-Identifier: GNU AGPLv3
pragma solidity ^0.8.26;

import {IERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import {IERC721MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";
import {IERC721EnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";
import {IERC5484} from "./IERC5484.sol";

/// @title ERC721 complient Token interface
interface IVaultFounderToken is
    IERC5484,
    IERC721Upgradeable,
    IERC721MetadataUpgradeable,
    IERC721EnumerableUpgradeable
{
    /// @dev set token metadata uri
    /// can be used as utility method and custom logic on front-end
    function setTokenURI(string memory _tokenURI) external;
    /// @dev set token metadata uri
    /// can be used as utility method and custom logic on front-end by owner of the contract
    /// in case of end user has a wrong uri or somebody corrupted it
    function setTokenURI(string memory _tokenURI, uint256 tokenId) external;
}