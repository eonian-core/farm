// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface ILender {
    function getAvailableCredit() external view returns (uint256);

    function getOutstandingDebt() external view returns (uint256);

    function reportDebtMaintainingResult(
        uint256 extraFreeFunds,
        uint256 remainingOutstandingDebt
    ) external returns (uint256);
}
