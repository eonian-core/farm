// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {ILender} from "./ILender.sol";

/// Lender contract which targeted to lend specifically for investments strategies.
/// Basically represent specific case of implementation of whitelist not colletaraized lending contract.
interface IStrategiesLender is ILender {

    /// @notice Arranged list of addresses of strategies, which defines the order for withdrawal.
    function withdrawalQueue(uint256 index) external view returns (address);

    /// @notice Revokes a strategy from the vault.
    ///         Sets strategy's dept ratio to zero, so that the strategy cannot take funds from the vault.
    /// @param strategy a strategy to revoke.
    function revokeStrategy(address strategy) external;
}
