/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "contracts/Vault.sol";
import "contracts/strategies/IStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract StrategyMock is IStrategy {
    using SafeERC20 for IERC20;

    address public asset;
    address public vault;

    constructor(address _asset, address _vault) {
        asset = _asset;
        vault = _vault;
    }

    function withdraw(uint256 assets) external override returns (uint256 loss) {
        uint256 assetBalance = IERC20(asset).balanceOf(address(this));
        if (assets <= assetBalance) {
            IERC20(asset).safeTransfer(msg.sender, assets);
        } else {
            loss = assets - assetBalance;
            IERC20(asset).safeTransfer(msg.sender, assetBalance);
        }
    }
}
