// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import {FixedPointMathLib} from "solmate/utils/FixedPointMathLib.sol";

contract RewardHolder is Initializable, AccessControlUpgradeable {
    using FixedPointMathLib for uint256;

    /// @notice Emitted reward is claimed by a token owner
    event RewardClaimed(uint256 reward, address receiver);
    /// @notice Emitted when new rewards are deposited
    event RewardDeposited(address sender, uint value);

    /// @notice Accumulator of the total earned interest rate since the opening of the token
    uint private rewardIndex;

    /// @notice The owners' reward indexes for eachas of the last time they accrued
    mapping(address => uint) private rewardOwnerIndex;

    /// @notice
    uint private numberCoins;

    /// @notice The initial reward index for this token
    uint224 public constant initialRewardIndex = 1e36;

    bytes32 public constant BALANCE_UPDATER_ROLE = keccak256("BALANCE_UPDATE_ROLE");
    bytes32 public constant REWARD_CLAIMER_ROLE = keccak256("BALANCE_UPDATE_ROLE");

//    /// @custom:oz-upgrades-unsafe-allow constructor
//    constructor()
//    {
//        _disableInitializers(); //todo discuss what proper way to initialize in scope uip proxy migation
//    }

    function __RewardHolder_init(address admin_) internal onlyInitializing {
        __AccessControl_init();
        _setupRole(BALANCE_UPDATER_ROLE, admin_);
    }

    /// @dev have to be called
    function depositReward() public payable onlyRole(BALANCE_UPDATER_ROLE) {
        // update reward index for claim reward logic
        rewardIndex += msg.value;
        emit RewardDeposited(msg.sender, msg.value);
    }

    function claimReward() external onlyRole(REWARD_CLAIMER_ROLE) {
        require(rewardOwnerIndex[msg.sender] != 0, "Caller doesn't have reward.");

        uint deltaIndex = rewardIndex - rewardOwnerIndex[msg.sender];
//        uint256 tokenOwnerReward = deltaIndex.mulDivDown(numberCoins, 10);
        uint tokenOwnerReward = 0;

        rewardOwnerIndex[msg.sender] = rewardIndex;

        emit RewardClaimed(tokenOwnerReward, address(msg.sender));
    }

    function setupNewOwner(address rewardOwner) internal {
        rewardOwnerIndex[rewardOwner] = rewardIndex;
        numberCoins++;
    }
}