// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/strategies/protocols/IRainMaker.sol";

contract RainMakerMock is IRainMaker {
    uint256 internal _compSupplySpeeds;

    function setCompSupplySpeeds(uint256 __compSupplySpeeds) public {
        _compSupplySpeeds = __compSupplySpeeds;
    }

    function compSpeeds(
        address /* cToken */
    ) external pure returns (uint256) {
        return 0;
    }

    function compSupplySpeeds(
        address /* cToken */
    ) external view returns (uint256) {
        return _compSupplySpeeds;
    }

    function compBorrowSpeeds(
        address /* cToken */
    ) external pure returns (uint256) {
        return 0;
    }

    function claimComp(
        address, /* holder */
        ICToken[] memory /* cTokens */
    ) external {}

    function claimComp(
        address /* holder */
    ) external {}

    function compAccrued(
        address /* holder */
    ) external pure returns (uint256) {
        return 0;
    }
}
