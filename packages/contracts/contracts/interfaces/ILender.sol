// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface ILender {
    function getAvailableCredit() external view returns (uint256);

    function getOutstandingDebt() external view returns (uint256);

    function reportPositiveDebtMaintainingResult(uint256 extraFreeFunds)
        external;

    function reportNegativeDebtMaintainingResult(uint256 remainingDebt)
        external;
}
