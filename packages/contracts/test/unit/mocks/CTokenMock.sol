// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import {ERC20Mock} from "./ERC20Mock.sol";
import {ICToken} from "contracts/strategies/protocols/ICToken.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CTokenMock is ERC20, ICToken {
    ERC20Mock internal _underlying;
    uint8 internal _decimals;

    uint256 public exchangeRate;

    bool public blocksBased;
    uint256 public borrowRatePerBlock;
    uint256 public supplyRatePerBlock;
    uint256 public exchangeRateCurrent;
    uint256 public accrueInterest;

    constructor(ERC20Mock __underlying) ERC20("CToken", "CT") {
        setUnderlying(__underlying);
        setDecimals(8);
        setExchangeRate(1 * 1e18);
    }

    function setUnderlying(ERC20Mock __underlying) public {
        _underlying = __underlying;
    }

    function setDecimals(uint8 __decimals) public {
        _decimals = __decimals;
    }

    function setExchangeRate(uint256 _exchangeRate) public {
        exchangeRate = _exchangeRate;
    }

    function setBlocksBased(bool _blocksBased) public {
        blocksBased = _blocksBased;
    }

    function setBorrowRatePerBlock(uint256 _borrowRatePerBlock) public {
        borrowRatePerBlock = _borrowRatePerBlock;
    }

    function setSupplyRatePerBlock(uint256 _supplyRatePerBlock) public {
        supplyRatePerBlock = _supplyRatePerBlock;
    }

    function setExchangeRateCurrent(uint256 _exchangeRateCurrent) public {
        exchangeRateCurrent = _exchangeRateCurrent;
    }

    function setAccrueInterest(uint256 _accrueInterest) public {
        accrueInterest = _accrueInterest;
    }

    function decimals() public view override(ICToken, ERC20) returns (uint8) {
        return _decimals;
    }

    function underlying() external view returns (address) {
        return address(_underlying);
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
        address account
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
        return (0, balanceOf(account), 0, exchangeRate);
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


    function seize(
        address, /* liquidator */
        address, /* borrower */
        uint256 /* seizeTokens */
    ) external pure returns (uint256) {
        return 0;
    }

    function mint(uint256 mintAmount) external override returns (uint256) {
        _mint(address(msg.sender), mintAmount);
        _underlying.mint(address(this), mintAmount);
        return 0;
    }

    function burn(uint256 burnAmount) external returns (uint256) {
        _burn(address(msg.sender), burnAmount);
        _underlying.burn(address(this), burnAmount);
        return 0;
    }

    function redeem(
        uint256 /* redeemTokens */
    ) external pure override returns (uint256) {
        return 0;
    }

    function redeemUnderlying(
        uint256 redeemAmount
    ) external override returns (uint256) {
        _burn(address(msg.sender), redeemAmount);
        _underlying.transfer(msg.sender, redeemAmount);
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
