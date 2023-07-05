/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/Vault.sol";

contract VaultMock is Vault {
    constructor(
        address underlying,
        address rewards,
        uint256 fee,
        uint256 lockedProfitReleaseDuration,
        uint256 _foundersRewardFee
    ) Vault(false) {
        initialize(
            underlying,
            rewards,
            fee,
            lockedProfitReleaseDuration,
            "",
            "",
            new address[](0),
            _foundersRewardFee
        );
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

    function emitTransferEvent(address to, uint256 amount) external {
        emit Transfer(address(this), to, amount);
    }

    function emitMintTransferEvent(address to, uint256 amount) external {
        emit Transfer(address(0), to, amount);
    }

    function emitLockedProfitReleaseRateChanged(uint256 rate) external {
        emit LockedProfitReleaseRateChanged(rate);
    }

    function hasStrategyAsBorrower(address strategy)
        external
        view
        returns (bool)
    {
        return borrowersData[strategy].activationTimestamp > 0;
    }

    function freeAssets() external view returns (uint256) {
        return _freeAssets();
    }

    function reentrantDeposit(uint256 amount) external nonReentrant {
        super.deposit(amount);
    }

    function reentrantWithdraw(uint256 amount) external nonReentrant {
        super.withdraw(amount);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount, "", "", false);
    }

    function calculateLockedProfit() external view returns (uint256) {
        return _lockedProfit();
    }

    function registerDepositHook(IVaultHook hook) public {
        addDepositHook(hook);
    }

    function registerWithdrawHook(IVaultHook hook) public {
        addWithdrawHook(hook);
    }

    function unregisterDepositHook(IVaultHook hook) public {
        removeDepositHook(hook);
    }

    function unregisterWithdrawHook(IVaultHook hook) public {
        removeWithdrawHook(hook);
    }

    function increaseDebt(address borrower, uint256 amount) public {
        super._increaseDebt(borrower, amount);
    }

    /// @notice Decreases given to borrower debt and total debt
    function decreaseDebt(address borrower, uint256 amount) public {
        super._decreaseDebt(borrower, amount);
    }
}
