// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

import "./ICToken.sol";

interface IRainMaker {
    function compSpeeds(address cToken) external view returns (uint256);

    function compSupplySpeeds(address cToken) external view returns (uint256);

    function compBorrowSpeeds(address cToken) external view returns (uint256);

    function claimComp(address holder, ICToken[] memory cTokens) external;

    function claimComp(address holder) external;

    function compAccrued(address holder) external view returns (uint256);
}
