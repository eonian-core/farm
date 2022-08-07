// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

import "./IVault.sol";
import "./lending/Lender.sol";
import "./tokens/SafeERC4626Upgradeable.sol";
import "./strategies/IStrategy.sol";
import "./structures/AddressList.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

error ExceededMaximumFeeValue();
error UnexpectedZeroAddress();
error InappropriateStrategy();
error StrategyNotFound();
error StrategyAlreadyExists();
error InsufficientVaultBalance(uint256 assets, uint256 shares);
error WrongQueueSize(uint256 size);

contract Vault is IVault, OwnableUpgradeable, SafeERC4626Upgradeable, Lender {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using AddressList for address[];

    /// @notice Rewards contract where management fees are sent to.
    address public rewards;

    /// @notice Vault management fee (in BPS).
    uint256 public managementFee;

    /// @notice Arranged list of addresses of strategies, which defines the order for withdrawal.
    address[] public withdrawalQueue;

    /// @notice Event that should happen when the strategy connects to the vault.
    /// @param strategy Address of the strategy contract.
    /// @param debtRatio Maximum portion of the loan that the strategy can take (in BPS).
    event StrategyAdded(address indexed strategy, uint256 debtRatio);

    /// @notice Event that should happen when the strategy has been revoked from the vault.
    /// @param strategy Address of the strategy contract.
    event StrategyRevoked(address indexed strategy);

    /// @notice Event that should happen when the strategy has been removed from the vault.
    /// @param strategy Address of the strategy contract.
    /// @param fromQueueOnly If "true", then the strategy has only been removed from the withdrawal queue.
    event StrategyRemoved(address indexed strategy, bool fromQueueOnly);

    /// @notice Event that should happen when the strategy has been returned to the withdrawal queue.
    /// @param strategy Address of the strategy contract.
    event StrategyReturnedToQueue(address indexed strategy);

    /// @dev This empty reserved space is put in place to allow future versions to add new
    ///      variables without shifting down storage in the inheritance chain.
    ///      See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

    function initialize(
        address _asset,
        address _rewards,
        uint256 _managementFee,
        string memory _name,
        string memory _symbol,
        address[] memory _defaultOperators
    ) public initializer {
        __Ownable_init();
        __Lender_init();
        __SafeERC4626_init(
            IERC20Upgradeable(_asset),
            bytes(_name).length == 0
                ? string.concat(
                    IERC20Metadata(_asset).symbol(),
                    " Eonian Vault Shares"
                )
                : _name,
            bytes(_symbol).length == 0
                ? string.concat("eon", IERC20Metadata(_asset).symbol())
                : _symbol,
            _defaultOperators
        );

        setRewards(_rewards);
        setManagementFee(_managementFee);
    }

    /// @inheritdoc IVault
    function version() external pure override returns (string memory) {
        return "1.0.0";
    }

    /// @dev Override to add the "whenNotPaused" modifier
    /// @inheritdoc SafeERC4626Upgradeable
    function deposit(uint256 assets)
        public
        override
        whenNotPaused
        returns (uint256 shares)
    {
        return super.deposit(assets);
    }

    /// @notice Hook that is used before withdrawals to release assets from strategies if necessary.
    /// @inheritdoc ERC4626Upgradeable
    function beforeWithdraw(uint256 assets, uint256 shares) internal override {
        // There is no need to withdraw assets from strategies, the vault has sufficient funds
        if (_freeAssets() >= assets) {
            return;
        }

        for (uint256 i = 0; i < withdrawalQueue.length; i++) {
            // If the vault already has the required amount of funds, we need to finish the withdrawal
            uint256 vaultBalance = _freeAssets();
            if (assets <= vaultBalance) {
                break;
            }

            address strategy = withdrawalQueue[i];

            // We can only withdraw the amount that the strategy has as debt,
            // so that the strategy can work on the unreported (yet) funds it has earned
            uint256 requiredAmount = Math.min(
                assets - vaultBalance,
                borrowersData[strategy].debt
            );

            // Skip this strategy is there is nothing to withdraw
            if (requiredAmount == 0) {
                continue;
            }

            // Withdraw the required amount of funds from the strategy
            uint256 loss = IStrategy(strategy).withdraw(requiredAmount);

            // If the strategy failed to return all of the requested funds, we need to reduce the strategy's debt ratio
            if (loss > 0) {
                _decreaseBorrowerCredibility(strategy, loss);
            }
        }

        // Revert if insufficient assets remain in the vault after withdrawal from all strategies
        if (_freeAssets() < assets) {
            revert InsufficientVaultBalance(assets, shares);
        }
    }

    /// @notice Adds a new strategy to the vault.
    /// @param strategy a new strategy address.
    /// @param debtRatio a ratio that shows how much of the new strategy can take, relative to other strategies.
    function addStrategy(address strategy, uint256 debtRatio)
        external
        onlyOwner
        whenNotPaused
    {
        if (strategy == address(0)) {
            revert UnexpectedZeroAddress();
        }

        // Strategy should refer to this vault and has the same underlying asset
        if (
            address(this) != IStrategy(strategy).vault() ||
            address(asset) != IStrategy(strategy).asset()
        ) {
            revert InappropriateStrategy();
        }

        _registerBorrower(strategy, debtRatio);
        withdrawalQueue.add(strategy);

        emit StrategyAdded(strategy, debtRatio);
    }

    /// @notice Adds a strategy to the withdrawal queue. The strategy must already be registered as a borrower.
    /// @param strategy a strategy address.
    function addStrategyToQueue(address strategy) external onlyOwner {
        if (strategy == address(0)) {
            revert UnexpectedZeroAddress();
        }

        if (withdrawalQueue.contains(strategy)) {
            revert StrategyAlreadyExists();
        }

        if (borrowersData[strategy].activationTimestamp == 0) {
            revert BorrowerDoesNotExist();
        }

        withdrawalQueue.add(strategy);

        emit StrategyReturnedToQueue(strategy);
    }

    /// @notice Revokes a strategy from the vault.
    ///         Sets strategy's dept ratio to zero, so that the strategy cannot take funds from the vault.
    /// @param strategy a strategy to revoke.
    function revokeStrategy(address strategy) external onlyOwner {
        _setBorrowerDebtRatio(strategy, 0);
        emit StrategyRevoked(strategy);
    }

    /// @notice Removes a strategy from the vault.
    /// @param strategy a strategy to remove.
    /// @param fromQueueOnly if "true", then the strategy will only be removed from the withdrawal queue.
    function removeStrategy(address strategy, bool fromQueueOnly)
        external
        onlyOwner
    {
        bool removedFromQueue = withdrawalQueue.remove(strategy);
        if (!removedFromQueue) {
            revert StrategyNotFound();
        }

        if (!fromQueueOnly) {
            _unregisterBorrower(strategy);
        }

        emit StrategyRemoved(strategy, fromQueueOnly);
    }

    /// @notice Sets the withdrawal queue.
    /// @param queue a new queue that will replace the existing one.
    ///        Should contain only those elements that already present in the existing queue.
    function reorderWithdrawalQueue(address[] memory queue) external onlyOwner {
        withdrawalQueue = withdrawalQueue.reorder(queue);
    }

    /// @notice Sets the vault rewards address.
    /// @param _rewards a new rewards address.
    function setRewards(address _rewards) public onlyOwner {
        rewards = _rewards;
    }

    /// @notice Sets the vault management fee.
    /// @param _managementFee a new management fee value (in BPS).
    function setManagementFee(uint256 _managementFee) public onlyOwner {
        if (_managementFee > MAX_BPS) {
            revert ExceededMaximumFeeValue();
        }
        managementFee = _managementFee;
    }

    /// @notice Switches the vault pause state.
    /// @param shutdown a new vault pause state. If "true" is passed, the vault will be paused.
    function setEmergencyShutdown(bool shutdown) external onlyOwner {
        shutdown ? _pause() : _unpause();
    }

    /// @inheritdoc Lender
    function _chargeFees(uint256 extraFreeFunds)
        internal
        override
        returns (uint256)
    {
        uint256 fee = (extraFreeFunds * managementFee) / MAX_BPS;
        if (fee > 0) {
            _mint(address(this), convertToShares(fee), "", "", false);
            uint256 balance = balanceOf(address(this));
            if (balance > 0) {
                _send(address(this), rewards, balance, "", "", false);
            }
        }
        return fee;
    }

    /// @notice Returns the current debt of the strategy.
    /// @param strategy the strategy address.
    function strategyDebt(address strategy) external view returns (uint256) {
        return borrowersData[strategy].debt;
    }

    /// @notice Returns the debt ratio of the strategy.
    /// @param strategy the strategy address.
    function strategyRatio(address strategy) external view returns (uint256) {
        return borrowersData[strategy].debtRatio;
    }

    /// @notice Returns the size of the withdrawal queue.
    function getQueueSize() external view returns (uint256) {
        return withdrawalQueue.length;
    }

    /// @inheritdoc Lender
    function _freeAssets() internal view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    /// @inheritdoc Lender
    function _borrowerFreeAssets(address borrower)
        internal
        view
        override
        returns (uint256)
    {
        return asset.balanceOf(borrower);
    }

    /// @inheritdoc ERC4626Upgradeable
    function totalAssets() public view override returns (uint256) {
        return super.lendingAssets();
    }

    /// @inheritdoc Lender
    function _transferFundsToBorrower(address borrower, uint256 amount)
        internal
        override
    {
        asset.safeTransfer(borrower, amount);
    }

    /// @inheritdoc Lender
    function _takeFundsFromBorrower(address borrower, uint256 amount)
        internal
        override
    {
        asset.safeTransferFrom(borrower, address(this), amount);
    }
}
