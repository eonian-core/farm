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

    /// @notice Accumulator of the total earned interest rate since the opening of the token
    uint public rewardIndex = 1e8;

    /// @notice The owners' reward indexes for eachas of the last time they accrued
    mapping(address => uint) public rewardOwnerIndex;

    /// @notice
    uint public numberCoins;

    Vault public vault;

    bytes32 public constant BALANCE_UPDATER_ROLE = keccak256("BALANCE_UPDATE_ROLE");
    bytes32 public constant REWARD_CLAIMER_ROLE = keccak256("BALANCE_UPDATE_ROLE");

//    /// @custom:oz-upgrades-unsafe-allow constructor
//    constructor()
//    {
//        _disableInitializers(); //todo discuss what proper way to initialize in scope uip proxy migation
//    }

    function __RewardHolder_init(
        address admin_
    ) internal onlyInitializing {
        __AccessControl_init();
        _setupRole(BALANCE_UPDATER_ROLE, admin_);
        _setupRole(DEFAULT_ADMIN_ROLE, admin_);
        __ReentrancyGuard_init();
    }

    /// @dev set vault
    /// @notice that is mandatory to be set before reward can be claimed
    function setVault(Vault vault_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        vault = vault_;
    }

    /// @dev deposit reward to the contract to be claimed by token owners
    /// @notice only role with BALANCE_UPDATER_ROLE can call this function
    /// @param plusReward amount of reward to be deposited
    function depositReward(uint256 plusReward) public onlyRole(BALANCE_UPDATER_ROLE) nonReentrant {
        // update reward index for claim reward logic
        rewardIndex += plusReward;
        emit RewardDeposited(_msgSender(), plusReward);
    }

    /// @dev claim reward for token owner
    /// @notice only role with REWARD_CLAIMER_ROLE can call this function
    function claimReward() external onlyRole(REWARD_CLAIMER_ROLE) nonReentrant {
        require(vault != Vault(address(0)), "Vault not set.");

        require(rewardOwnerIndex[msg.sender] != 0, "Caller doesn't have reward.");

        uint deltaIndex = rewardIndex - rewardOwnerIndex[msg.sender];

        // calculate reward for token owner
        //todo discuss the proper calculation mechanism
        uint256 tokenOwnerReward = deltaIndex.mulDivDown(1, numberCoins);
        rewardOwnerIndex[msg.sender] = rewardIndex;

        // transfer reward to token owner
        vault.transfer(msg.sender, tokenOwnerReward);
        emit RewardClaimed(tokenOwnerReward, address(msg.sender));
    }

    /// @dev setup new owner for reward usually called when minting new token
    function setupNewOwner(address rewardOwner) external onlyRole(BALANCE_UPDATER_ROLE) {
        rewardOwnerIndex[rewardOwner] = rewardIndex;
        _setupRole(REWARD_CLAIMER_ROLE, rewardOwner);
        numberCoins++;
    }
}