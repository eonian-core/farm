// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";
import {Vault} from "../Vault.sol";

contract RewardHolder is Initializable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {
    using FixedPointMathLib for uint256;

    /// @notice Emitted reward is claimed by a token owner
    event RewardClaimed(uint256 reward, address receiver);
    /// @notice Emitted when new rewards are deposited
    event RewardDeposited(address sender, uint value);
    /// @notice Emitted when a new owner is added
    event OwnerAdded(address owner, uint index);

    /// @notice Accumulator of the total earned interest rate since the opening of the token
    uint public rewardIndex = 1;

    /// @notice The owners' reward indexes for eachas of the last time they accrued
    mapping(address => uint) public rewardOwnerIndex;

    /// @notice
    uint16 public numberCoins;

    Vault public vault;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    /// variables without shifting down storage in the inheritance chain.
    /// See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

    // 0xbb788f92e65e1a823e2c502bc4e7f9c3e55531bd56bfc7c0a895fb3ac9eb7716
    bytes32 public constant BALANCE_UPDATER_ROLE = keccak256("BALANCE_UPDATE_ROLE");
    // 0x350f4eb58665205037e4a10647f66a623dc93281f72575646a8f0c90d88b72ae
    bytes32 public constant REWARD_CLAIMER_ROLE = keccak256("REWARD_CLAIMER_ROLE");

    /* ///////////////////////////// CONSTRUCTORS ///////////////////////////// */

    function __RewardHolder_init() internal onlyInitializing {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        __ReentrancyGuard_init();
    }

    function __RewardHolder_init_unchained() internal onlyInitializing {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        __ReentrancyGuard_init();
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
        require(vault != Vault(address(0)), "Vault not set.");
        require(rewardOwnerIndex[msg.sender] != 0, "Caller doesn't have reward.");

        // calculate reward for token owner
        uint256 tokenOwnerReward = _calcReward();
        rewardOwnerIndex[msg.sender] = rewardIndex;

        // transfer reward to token owner
        vault.transfer(msg.sender, tokenOwnerReward);
        emit RewardClaimed(tokenOwnerReward, address(msg.sender));
    }

    function _calcReward() internal view returns (uint256) {
        //todo discuss the proper calculation mechanism
        uint deltaIndex = rewardIndex - rewardOwnerIndex[msg.sender];
        return deltaIndex.mulDivDown(1, numberCoins);
    }

    /// @dev setup new owner for reward usually called when minting new token
    function setupNewOwner(address rewardOwner) internal virtual onlyRole(BALANCE_UPDATER_ROLE) {
        rewardOwnerIndex[rewardOwner] = rewardIndex;
        numberCoins++;
        emit OwnerAdded(rewardOwner, rewardIndex);
    }
}