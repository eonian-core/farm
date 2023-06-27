/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/lending/StrategiesLender.sol";
import "./SafeInitializableMock.sol";

contract StrategiesLenderMock is StrategiesLender, SafeInitializableMock {

    uint256 public beforeStrategyRegisteredCalled;

    constructor(
    ) initializer {
        __StrategiesLender_init();
    }

    function emitStrategyAddedEvent(address strategy, uint256 debtRatio)
        external
    {
        emit StrategyAdded(strategy, debtRatio);
    }

    function emitStrategyRevokedEvent(address strategy) external {
        emit StrategyRevoked(strategy);
    }

    function emitStrategyRemovedEvent(address strategy, bool fromQueueOnly)
        external
    {
        emit StrategyRemoved(strategy, fromQueueOnly);
    }

    function emitStrategyReturnedToQueueEvent(address strategy) external {
        emit StrategyReturnedToQueue(strategy);
    }

    function emitPausedEvent() external {
        emit Paused(msg.sender);
    }

    function emitUnpausedEvent() external {
        emit Unpaused(msg.sender);
    }

    function hasStrategyAsBorrower(address strategy)
        external
        view
        returns (bool)
    {
        return borrowersData[strategy].activationTimestamp > 0;
    }

    function freeAssets() external pure returns (uint256) {
        return _freeAssets();
    }

    function _afterNegativeDebtManagementReport(uint256 /* loss */) internal override {
        // do nothing
    }

    function _afterPositiveDebtManagementReport(
        uint256 extraFreeFunds,
        uint256 chargedFees
    ) internal override {
        // do nothing
    }

    function _beforeStrategyRegistered(IStrategy /* strategy */) internal override {
        beforeStrategyRegisteredCalled = 1 + beforeStrategyRegisteredCalled;
    }

    function _borrowerFreeAssets(address /* borrower */)
        internal
        pure
        override
        returns (uint256)
    {
        return 0;
    }

    function _chargeFees(uint256 /* extraFreeFunds */) internal override returns (uint256) {
        // do nothing
    }

    function _freeAssets() internal pure override returns (uint256) {
        return 0;
    }

    function _takeFundsFromBorrower(address /* borrower */, uint256 /* amount */)
        internal
        override
    {
        // do nothing
    }

    function _transferFundsToBorrower(address /* borrower */, uint256 /* amount */)
        internal
        override
    {
        // do nothing
    }
}
