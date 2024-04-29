// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";
import {Vault} from "../Vault.sol";

error VaultNotSet();
error CallerHaveNoReward();

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
    uint16 public numberCoins;

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
        uint256 tokenOwnerReward = calcReward();
        rewardOwnerIndex[msg.sender] = rewardIndex;

        // transfer reward to token owner
        bool success = vault.transfer(msg.sender, tokenOwnerReward);
        emit RewardClaimed(tokenOwnerReward, address(msg.sender), success);
    }

    function calcReward() public view returns (uint256) {
        if(numberCoins == 0 || rewardOwnerIndex[msg.sender] == 0) {
            return 0;
        }
        uint256 deltaIndex = rewardIndex - rewardOwnerIndex[msg.sender];
        return deltaIndex / numberCoins;
    }

    /// @dev setup new owner for reward usually called when minting new token
    function setupNewOwner(address rewardOwner) internal virtual onlyRole(BALANCE_UPDATER_ROLE) {
        rewardOwnerIndex[rewardOwner] = rewardIndex;
        numberCoins++;
        emit OwnerAdded(rewardOwner, rewardIndex);
    }
}