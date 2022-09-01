/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/Vault.sol";
import "contracts/strategies/IStrategy.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract StrategyMock is IStrategy {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IERC20Upgradeable public asset;
    IVault public vault;

    constructor(address _asset, address _vault) {
        asset = IERC20Upgradeable(_asset);
        vault = IVault(_vault);
    }

    function withdraw(uint256 assets) external override returns (uint256 loss) {
        uint256 assetBalance = IERC20Upgradeable(asset).balanceOf(
            address(this)
        );
        if (assets <= assetBalance) {
            IERC20Upgradeable(asset).safeTransfer(msg.sender, assets);
        } else {
            loss = assets - assetBalance;
            IERC20Upgradeable(asset).safeTransfer(msg.sender, assetBalance);
        }
    }

    function name() external pure override returns (string memory) {
        return "StrategyMock";
    }
}
