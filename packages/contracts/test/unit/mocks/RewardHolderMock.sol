// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {RewardHolder} from "contracts/tokens/RewardHolder.sol";
import {Vault} from "contracts/Vault.sol";

contract RewardHolderMock is RewardHolder {
    constructor(
        address admin_
    ) initializer {
        __RewardHolder_init(admin_);
    }

    function emitRewardDeposited(uint256 plusReward) external {
        emit RewardDeposited(msg.sender, plusReward);
    }

    function emitRewardClaimed(uint256 reward, address receiver) external {
        emit RewardClaimed(reward, receiver);
    }
}