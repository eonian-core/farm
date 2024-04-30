// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {MathUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";

import {Lender, BorrowerDoesNotExist} from "./Lender.sol";
import {ILender} from "./ILender.sol";
import {IStrategiesLender} from "./IStrategiesLender.sol";
import {IStrategy} from "../strategies/IStrategy.sol";
import {AddressList} from "../structures/AddressList.sol";

error UnexpectedZeroAddress();
error StrategyNotFound();
error StrategyAlreadyExists();
error AccessDeniedForCaller(address caller);
error StrategiesLenderMustBeOwned();

/// Lender contract which targeted to lend specifically for investments strategies.
/// Basically represent specific case of implementation of whitelist not colletaraized lending contract.
abstract contract StrategiesLender is IStrategiesLender, Lender, OwnableUpgradeable {

    using AddressList for address[];

    /// @notice Arranged list of addresses of strategies, which defines the order for withdrawal.
    address[] public withdrawalQueue;

    /// @dev This empty reserved space is put in place to allow future versions to add new
    ///      variables without shifting down storage in the inheritance chain.
    ///      See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
    uint256[50] private __gap;

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

    /// @notice Event that should happen when tokens withdrawn from strategy.
    event WinthdrawnFromStrategy(address indexed strategy, uint256 requiredAmount, uint256 withdrawnAmount, uint256 loss);

    modifier onlyOwnerOrStrategy(address strategy) {
        if (msg.sender != owner() && msg.sender != strategy) {
            revert AccessDeniedForCaller(msg.sender);
        }
        _;
    }

    // ------------------------------------------ Constructors ------------------------------------------

    function __StrategiesLender_init() internal onlyInitializing {
        __Ownable_init();

        __StrategiesLender_init_lenderSpecific();
    }

    /// Init only direct constructors of business logic, ignore Ownable and simular common contracts
    function __StrategiesLender_init_lenderSpecific() internal onlyInitializing {
        if(owner() == address(0)) {
            revert StrategiesLenderMustBeOwned();
        }

        __Lender_init();
    }

    /// @notice Switches the vault pause state.
    /// @param shutdown a new vault pause state. If "true" is passed, the vault will be paused.
    function setEmergencyShutdown(bool shutdown) external onlyOwner {
        shutdown ? _pause() : _unpause();
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
        
        _beforeStrategyRegistered(IStrategy(strategy));

        _registerBorrower(strategy, debtRatio);
        withdrawalQueue.add(strategy);

        emit StrategyAdded(strategy, debtRatio);
    }

    /// Allow check strategy complience before it added
    function _beforeStrategyRegistered(IStrategy strategy) internal virtual;

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

    /// @inheritdoc IStrategiesLender
    function revokeStrategy(address strategy)
        external
        onlyOwnerOrStrategy(strategy)
    {
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

    function _withdrawFromAllStrategies(uint256 assets) internal returns (uint256 totalLoss) {
        for (uint256 i = 0; i < withdrawalQueue.length; i++) {
            // If the vault already has the required amount of funds, we need to finish the withdrawal
            uint256 vaultBalance = _freeAssets();
            if (assets <= vaultBalance) {
                // We withdrawn all what we need
                break;
            }

            address strategy = withdrawalQueue[i];

            // We can only withdraw the amount that the strategy has as debt,
            // so that the strategy can work on the unreported (yet) funds it has earned
            uint256 requiredAmount = MathUpgradeable.min(
                assets - vaultBalance,
                borrowersData[strategy].debt
            );

            // Skip this strategy is there is nothing to withdraw
            if (requiredAmount == 0) {
                continue;
            }


            totalLoss += withdrawFromStrategy(IStrategy(strategy), requiredAmount);
        }
    }

    /// @notice Withdraws funds from the strategy.
    function withdrawFromStrategy(IStrategy strategy, uint256 requiredAmount) internal returns (uint256) {
        uint256 balanceBefore = _freeAssets();
        // Withdraw the required amount of funds from the strategy
        uint256 loss = strategy.withdraw(requiredAmount);
        uint256 withdrawnAmount = _freeAssets() - balanceBefore;

        // If the strategy failed to return all of the requested funds, we need to reduce the strategy's debt ratio
        if (loss > 0) {
            _decreaseBorrowerCredibility(address(strategy), loss);
        }

        // Reduce the Strategy's debt by the amount withdrawn ("realized returns")
        // Normally this is changed during report, but in this case we need update it manually
        // important to do it after _decreaseBorrowerCredibility, because it rely on old debt value
        _decreaseDebt(address(strategy), withdrawnAmount);

        emit WinthdrawnFromStrategy(address(strategy), requiredAmount, withdrawnAmount, loss);

        return loss;
    }

    /// @notice Sets the withdrawal queue.
    /// @param queue a new queue that will replace the existing one.
    ///        Should contain only those elements that already present in the existing queue.
    function reorderWithdrawalQueue(address[] memory queue) external onlyOwner {
        withdrawalQueue = withdrawalQueue.reorder(queue);
    }

    /// @notice Returns the size of the withdrawal queue.
    function getQueueSize() external view returns (uint256) {
        return withdrawalQueue.length;
    }

    /// @notice Sets the borrower's debt ratio. Will be reverted if the borrower doesn't exist or the total debt ratio is exceeded.
    /// @dev In the case where you want to disable the borrower, you need to set its ratio to 0.
    ///      Thus, the borrower's current debt becomes an outstanding debt, which he must repay to the lender.
    function setBorrowerDebtRatio(address borrower, uint256 borrowerDebtRatio) external onlyOwner {
        _setBorrowerDebtRatio(borrower, borrowerDebtRatio);
    }
    
    /// @inheritdoc IStrategiesLender
    function interestRatePerBlock() public view returns (uint256, uint256) {
        uint256 totalUtilisationRate;
        uint256 totalInterestRate;

        if(totalDebt == 0) {
            return (0, 0);
        }

        uint256 withdrawalQueueLength = withdrawalQueue.length;
        for (uint256 i = 0; i < withdrawalQueueLength; i++) {
            IStrategy strategy = IStrategy(withdrawalQueue[i]);

            uint256 utilisationRate = utilizationRate(address(strategy)); // in BPS
            totalUtilisationRate += utilisationRate;
            
            // interest rate scaled by 1e18
            // utilisation rate in BPS * interest rate scaled by 1e18 / BPS = total interest rate scaled by 1e18
            totalInterestRate += utilisationRate * strategy.interestRatePerBlock() / MAX_BPS; 
        }

        // sanity check
        if (totalUtilisationRate == 0) {
            return (0, 0);
        }

        return (totalInterestRate, totalUtilisationRate);
    }

    /// @inheritdoc Lender
    /// @dev Explicitly overridden here to keep this function exposed via "ILender" interface.
    function paused()
        public
        view
        override(ILender, Lender)
        virtual
        returns (bool)
    {
        return super.paused();
    }

}