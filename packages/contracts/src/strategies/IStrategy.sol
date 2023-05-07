// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IVault} from "../IVault.sol";

interface IStrategy {
    /// @notice Returns the name of this strategy.
    function name() external view returns (string memory);

    /// @notice Returns the contract address of the underlying asset of this strategy.
    function asset() external view returns (IERC20Upgradeable);

    /// @notice Returns the contract address of the Vault to which this strategy is connected.
    function vault() external view returns (IVault);

    /// @notice Transfers a specified amount of tokens to the vault.
    /// @param assets A amount of tokens to withdraw.
    /// @return loss A number of tokens that the strategy could not return.
    function withdraw(uint256 assets) external returns (uint256 loss);
}
