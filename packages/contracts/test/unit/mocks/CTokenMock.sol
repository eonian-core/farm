// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/strategies/protocols/ICToken.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CTokenMock is ERC20, ICToken {
    address internal _underlying;
    uint8 internal _decimals;
    bool public blocksBased;

    uint256 public balanceSnapshot;
    uint256 public exchangeRate;

    constructor(address __underlying) ERC20("CToken", "CT") {
        setUnderlying(__underlying);
        setDecimals(8);
    }

    function setUnderlying(address __underlying) public {
        _underlying = __underlying;
    }

    function setDecimals(uint8 __decimals) public {
        _decimals = __decimals;
    }

    function setBalanceSnapshot(uint256 _balanceSnapshot) public {
        balanceSnapshot = _balanceSnapshot;
    }

    function setExchangeRate(uint256 _exchangeRate) public {
        exchangeRate = _exchangeRate;
    }

    function decimals() public view override(ICToken, ERC20) returns (uint8) {
        return _decimals;
    }

    function underlying() external view returns (address) {
        return _underlying;
    }

    function transfer(address dst, uint256 amount)
        public
        override(ICToken, ERC20)
        returns (bool)
    {
        return super.transfer(dst, amount);
    }

    function transferFrom(
        address src,
        address dst,
        uint256 amount
    ) public override(ICToken, ERC20) returns (bool) {
        return super.transferFrom(src, dst, amount);
    }

    function approve(address spender, uint256 amount)
        public
        override(ICToken, ERC20)
        returns (bool)
    {
        return super.approve(spender, amount);
    }

    function allowance(address owner, address spender)
        public
        view
        override(ICToken, ERC20)
        returns (uint256)
    {
        return super.allowance(owner, spender);
    }

    function balanceOf(address owner)
        public
        view
        override(ICToken, ERC20)
        returns (uint256)
    {
        return super.balanceOf(owner);
    }

    function balanceOfUnderlying(address owner)
        public
        view
        override
        returns (uint256)
    {
        // For testing purposes let's consider that balance = underlying balance
        return balanceOf(owner);
    }

    function getAccountSnapshot(
        address /* account */
    )
        external
        view
        override
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (0, balanceSnapshot, 0, exchangeRate);
    }

    function borrowRatePerBlock() external pure override returns (uint256) {
        return 0;
    }

    function supplyRatePerBlock() external pure override returns (uint256) {
        return 0;
    }

    function totalBorrowsCurrent() external pure override returns (uint256) {
        return 0;
    }

    function borrowBalanceCurrent(
        address /* account */
    ) external pure override returns (uint256) {
        return 0;
    }

    function borrowBalanceStored(
        address /* account */
    ) external pure override returns (uint256) {
        return 0;
    }

    function exchangeRateCurrent() external pure override returns (uint256) {
        return 0;
    }

    function exchangeRateStored() external view override returns (uint256) {
        return exchangeRate;
    }

    function getCash() external pure override returns (uint256) {
        return 0;
    }

    function totalSupply()
        public
        view
        override(ICToken, ERC20)
        returns (uint256)
    {
        return super.totalSupply();
    }

    function accrueInterest() external pure override returns (uint256) {
        return 0;
    }

    function seize(
        address, /* liquidator */
        address, /* borrower */
        uint256 /* seizeTokens */
    ) external pure returns (uint256) {
        return 0;
    }

    function mint(uint256 mintAmount) external override returns (uint256) {
        _mint(address(msg.sender), mintAmount);

        return 0;
    }

    function redeem(
        uint256 /* redeemTokens */
    ) external pure override returns (uint256) {
        return 0;
    }

    function redeemUnderlying(
        uint256 /* redeemAmount */
    ) external pure override returns (uint256) {
        return 0;
    }

    function borrow(
        uint256 /* borrowAmount */
    ) external pure override returns (uint256) {
        return 0;
    }

    function repayBorrow(
        uint256 /* repayAmount */
    ) external pure override returns (uint256) {
        return 0;
    }

    function repayBorrowBehalf(
        address, /* borrower */
        uint256 /* repayAmount */
    ) external pure override returns (uint256) {
        return 0;
    }

    function liquidateBorrow(
        address, /* borrower */
        uint256, /* repayAmount */
        ICToken /* cTokenCollateral */
    ) external pure override returns (uint256) {
        return 0;
    }
}
