// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "./IStrategy.sol";
import "../IVault.sol";
import "../automation/GelatoJobAdapter.sol";

error CallerIsNotAVault();

abstract contract BaseStrategy is
    IStrategy,
    GelatoJobAdapter,
    OwnableUpgradeable,
    PausableUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    address public vault;
    address public asset;

    /// @notice Use this to adjust the threshold at which running a debt causes a work trigger.
    uint256 public debtThreshold;

    event Harvested(
        uint256 profit,
        uint256 loss,
        uint256 debtPayment,
        uint256 outstandingDebt
    );

    event DebtThresholdUpdated(uint256 debtThreshold);

    function __BaseStrategy_init(
        address _vault,
        address _ops,
        uint256 _minReportInterval,
        bool _isPrepaid
    ) internal onlyInitializing {
        __Ownable_init();
        __Pausable_init();
        __GelatoJobAdapter_init(_ops, _minReportInterval, _isPrepaid);

        __BaseStrategy_init_unchained(_vault);
    }

    function __BaseStrategy_init_unchained(address _vault)
        internal
        onlyInitializing
    {
        vault = _vault;
        asset = IVault(vault).underlyingAsset();

        debtThreshold = 0;

        IERC20Upgradeable(asset).safeApprove(_vault, type(uint256).max);
    }

    /// @inheritdoc Job
    function _work() internal override {
        uint256 profit = 0;
        uint256 loss = 0;
        uint256 debtPayment = 0;

        uint256 outstandingDebt = IVault(vault).outstandingDebt();
        bool shuttedDown = paused();
        if (shuttedDown) {
            (profit, loss, debtPayment) = _harvestAfterShutdown(
                outstandingDebt
            );
        } else {
            (profit, loss, debtPayment) = _harvest(outstandingDebt);
        }

        if (profit > 0) {
            IVault(vault).reportPositiveDebtManagement(profit, debtPayment);
        } else {
            IVault(vault).reportNegativeDebtManagement(loss, debtPayment);
        }

        outstandingDebt = IVault(vault).outstandingDebt();
        outstandingDebt = outstandingDebt == IVault(vault).currentDebt()
            ? estimatedTotalAssets()
            : outstandingDebt;

        _adjustPosition(outstandingDebt);

        // TODO: Perform the health check (?)

        emit Harvested(profit, loss, debtPayment, outstandingDebt);
    }

    /// @inheritdoc Job
    function _canWork() internal view override returns (bool) {
        IVault _vault = IVault(vault);
        if (_vault.isActivated()) {
            return false;
        }

        // Trigger this job if the strategy has the outstanding debt to repay
        uint256 outstanding = _vault.outstandingDebt();
        if (outstanding > debtThreshold) {
            return true;
        }

        // Trigger this job if the strategy has some loss to report
        uint256 total = estimatedTotalAssets();
        if (total + debtThreshold < _vault.currentDebt()) {
            return true;
        }

        // TODO: Check the gas cost against the profit (?)
        // TODO: Check the maximum delay between job executions (?)

        return true;
    }

    /// @inheritdoc IStrategy
    function withdraw(uint256 assets) external override returns (uint256 loss) {
        if (msg.sender != address(vault)) {
            revert CallerIsNotAVault();
        }
        // Liquidate the requested amount of tokens
        uint256 amountFreed;
        (amountFreed, loss) = _liquidatePosition(assets);

        // Send it directly back to the vault
        IERC20Upgradeable(asset).safeTransfer(msg.sender, amountFreed);
    }

    /// @notice Shutdown the strategy and revoke it form the vault.
    function shutdown() external onlyOwner {
        _pause();
        IVault(vault).revokeStrategy(address(this));
    }

    function setDebtThreshold(uint256 _debtThreshold) external onlyOwner {
        debtThreshold = _debtThreshold;
        emit DebtThresholdUpdated(_debtThreshold);
    }

    function _harvestAfterShutdown(uint256 outstandingDebt)
        private
        returns (
            uint256 profit,
            uint256 loss,
            uint256 debtPayment
        )
    {
        uint256 amountFreed = _liquidateAllPositions();
        if (amountFreed < outstandingDebt) {
            loss = outstandingDebt - amountFreed;
        } else if (amountFreed > outstandingDebt) {
            profit = amountFreed - outstandingDebt;
        }
        debtPayment = outstandingDebt - loss;
    }

    function estimatedTotalAssets() public view virtual returns (uint256);

    function _harvest(uint256 outstandingDebt)
        internal
        virtual
        returns (
            uint256 profit,
            uint256 loss,
            uint256 debtPayment
        );

    function _adjustPosition(uint256 outstandingDebt) internal virtual;

    function _liquidatePosition(uint256 assets)
        internal
        virtual
        returns (uint256 liquidatedAmount, uint256 loss);

    function _liquidateAllPositions()
        internal
        virtual
        returns (uint256 amountFreed);
}
