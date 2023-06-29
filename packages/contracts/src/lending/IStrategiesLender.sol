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

    /// @notice Returns average interst rate of lender per block. 
    ///         Based on last report utilization rate and possibly cached interest rate of each strategy.
    ///         Can be outadated, but close enough to real state for on chain calculations.
    ///         Calculate average by combining utilisation rate of each strategy with its interest rate.
    ///         Returns additional total utilisation rate of lender, as additional product of calculation, usefull to safe gas.
    /// @return interstRate - The interest rate per block, scaled by 1e18
    /// @return utilisationRate - The utilisation rate of the lender, in BPS (scaled by 1e4)
    function interestRatePerBlock() external view returns (uint256 interstRate, uint256 utilisationRate);
}
