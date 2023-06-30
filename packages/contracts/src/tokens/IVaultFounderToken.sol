// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

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
    /// @dev implementation for calculate price for the next token based on
    /// the current sequential token id
    function priceOf(uint256 tokenId) external view returns (uint256);
    /// @dev calculate price for the next token
    function nextTokenPrice() external view returns (uint256);
    /// @dev set token metadata uri
    /// can be used as utility method and custom logic on front-end
    function setTokenURI(string memory _tokenURI) external;
}