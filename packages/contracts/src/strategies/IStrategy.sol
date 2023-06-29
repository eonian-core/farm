// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IStrategiesLender} from "../lending/IStrategiesLender.sol";

interface IStrategy {
    /// @notice Returns the name of this strategy.
    function name() external view returns (string memory);

    /// @notice Returns the contract address of the underlying asset of this strategy.
    function asset() external view returns (IERC20Upgradeable);

    /// @notice Returns the contract address of the Lender to which this strategy is connected.
    function lender() external view returns (IStrategiesLender);

    /// @notice Transfers a specified amount of tokens to the vault.
    /// @param assets A amount of tokens to withdraw.
    /// @return loss A number of tokens that the strategy could not return.
    function withdraw(uint256 assets) external returns (uint256 loss);

    /// @notice Returns interst rate of strategy per block, for current block or block prior to this one.
    /// @dev Can be calculated not for all strategies and usally not such accurate as sliding window averages,
    ///  but still can be usafull for on chain calculations and as fallback method.
    /// @return The interest rate per block, scaled by 1e18
    function interestRatePerBlock() external view returns (uint256);
}
