// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";
import {Vault} from "../Vault.sol";

error VaultNotSet();
error CallerHaveNoReward();
error CallerHaveZeroReward();
error OwnerCountExceeded();

contract RewardHolder is Initializable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {
    using FixedPointMathLib for uint256;

    /// @notice Emitted reward is claimed by a token owner
    event RewardClaimed(uint256 reward, address receiver, bool success);
    /// @notice Emitted when new rewards are deposited
    event RewardDeposited(address sender, uint256 value);
    /// @notice Emitted when a new owner is added
    event OwnerAdded(address owner, uint256 index);

    /// @notice Accumulator of the total earned interest rate since the opening of the token
    uint256 public rewardIndex;

    /// @notice The owners' reward indexes for eachas of the last time they accrued
    mapping(address => uint256) public rewardOwnerIndex;

    /// @notice
    uint16 public ownersCount;
    uint16 public constant MAX_OWNERS_COUNT = 100;

    Vault public vault;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

    // 0xbb788f92e65e1a823e2c502bc4e7f9c3e55531bd56bfc7c0a895fb3ac9eb7716
    bytes32 public constant BALANCE_UPDATER_ROLE = keccak256("BALANCE_UPDATE_ROLE");

    /* ///////////////////////////// CONSTRUCTORS ///////////////////////////// */

    function __RewardHolder_init() internal onlyInitializing {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __RewardHolder_init_unchained();
    }

    function __RewardHolder_init_unchained() internal onlyInitializing {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        rewardIndex = 1;
    }

    /// @dev set vault
    /// @notice that is mandatory to be set before reward can be claimed
    function _setVault(Vault vault_) internal virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        if(address(vault) != address(0)) {
            revokeRole(BALANCE_UPDATER_ROLE, address(vault));
        }
        vault = vault_;
        grantRole(BALANCE_UPDATER_ROLE, address(vault));
    }

    /// @dev deposit reward to the contract to be claimed by token owners
    /// @notice only role with BALANCE_UPDATER_ROLE can call this function
    /// @param plusReward amount of reward to be deposited
    function depositReward(uint256 plusReward) external onlyRole(BALANCE_UPDATER_ROLE) nonReentrant {
        // update reward index for claim reward logic
        rewardIndex += plusReward;
        emit RewardDeposited(_msgSender(), plusReward);
    }

    /// @dev claim reward for token owner
    function claimReward() external nonReentrant {
        if(vault == Vault(address(0))) {
            revert VaultNotSet();
        }
        if(rewardOwnerIndex[msg.sender] == 0) {
            revert CallerHaveNoReward();
        }

        // calculate reward for token owner
        (uint256 tokenOwnerReward, uint256 claimableIndex) = previewReward(msg.sender);
        if(tokenOwnerReward == 0) {
            revert CallerHaveZeroReward();
        }
        rewardOwnerIndex[msg.sender] = claimableIndex;

        // transfer reward to token owner
        bool success = vault.transfer(msg.sender, tokenOwnerReward);
        emit RewardClaimed(tokenOwnerReward, address(msg.sender), success);
    }

    /// @dev calculate reward for token owner and last claimable index
    function previewReward(address owner) public view returns (uint256, uint256) {
        if(ownersCount == 0 || rewardOwnerIndex[owner] == 0) {
            return (0, rewardIndex);
        }
        
        uint256 deltaIndex = rewardIndex - rewardOwnerIndex[owner];
        // Division rounds down to the nearest integer
        // As a result we exclude the remainder from the owner index
        // So he will be able to claim left over reward in the future
        return (deltaIndex / ownersCount, rewardIndex - deltaIndex % ownersCount);
    }

    /// @dev setup new owner for reward usually called when minting new token
    function addOwner(address owner) internal virtual onlyRole(BALANCE_UPDATER_ROLE) {
        if(ownersCount >= MAX_OWNERS_COUNT) {
            revert OwnerCountExceeded();
        }

        rewardOwnerIndex[owner] = rewardIndex;
        ownersCount++;

        emit OwnerAdded(owner, rewardIndex);
    }
}