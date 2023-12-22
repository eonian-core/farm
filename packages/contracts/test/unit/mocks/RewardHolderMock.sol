// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {RewardHolder} from "contracts/tokens/RewardHolder.sol";
import {Vault} from "contracts/Vault.sol";

contract RewardHolderMock is RewardHolder {
    constructor() initializer {
        __RewardHolder_init();
    }

    function emitRewardDeposited(uint256 plusReward) external {
        emit RewardDeposited(msg.sender, plusReward);
    }

    function emitRewardClaimed(uint256 reward, address receiver, bool success) external {
        emit RewardClaimed(reward, receiver, success);
    }

    function setupOwner(address rewardOwner) external {
        setupNewOwner(rewardOwner);
    }

    function checkRole(bytes32 role, address account) onlyRole(BALANCE_UPDATER_ROLE) external view returns (bool) {
        return hasRole(role, account);
    }

    function setVault(Vault vault_) external {
        _setVault(vault_);
    }
}