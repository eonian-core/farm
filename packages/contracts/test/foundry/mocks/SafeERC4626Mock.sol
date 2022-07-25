/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/tokens/SafeERC4626Upgradeable.sol";

/// Testing implementation of SafeERC4626
contract SafeERC4626Mock is SafeERC4626Upgradeable {

    uint256 public beforeWithdrawHookCalledCounter;
    uint256 public afterDepositHookCalledCounter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(
        IERC20Upgradeable _asset,
        string memory name_,
        string memory symbol_,
        address[] memory defaultOperators_
    ) initializer {
        __SafeERC4626_init(_asset, name_, symbol_, defaultOperators_);

        beforeWithdrawHookCalledCounter = 0;
        afterDepositHookCalledCounter = 0;
    }

    function totalAssets() public view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function beforeWithdraw(uint256, uint256) internal override {
        beforeWithdrawHookCalledCounter++;
    }

    function afterDeposit(uint256, uint256) internal override {
        afterDepositHookCalledCounter++;
    }

}