// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import {ICToken} from "./ICToken.sol";

/// @notice Interface for a compound-like controller used to control incentivized tokens received during interaction with the protocol.
interface IRainMaker {
    struct CompMarketState {
        /// @notice The market's last updated compBorrowIndex or compSupplyIndex
        uint224 index;
        /// @notice The block number the index was last updated at
        uint32 block;
    }

    function compSupplierIndex(address, address)
        external
        view
        returns (uint256);

    function compSpeeds(address cToken) external view returns (uint256);

    function compSupplySpeeds(address cToken) external view returns (uint256);

    function compBorrowSpeeds(address cToken) external view returns (uint256);

    function claimComp(address holder, ICToken[] memory cTokens) external;

    function claimComp(address holder) external;

    function compAccrued(address holder) external view returns (uint256);

    function compSupplyState(address cToken)
        external
        view
        returns (CompMarketState memory);
}
