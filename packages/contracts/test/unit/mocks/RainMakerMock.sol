// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/strategies/protocols/IRainMaker.sol";

contract RainMakerMock is IRainMaker {
    event ClaimCompCalled(address holder, address cToken);

    uint256 internal _compSupplySpeeds;

    function setCompSupplySpeeds(uint256 __compSupplySpeeds) public {
        _compSupplySpeeds = __compSupplySpeeds;
    }

    function compSupplierIndex(address, address)
        external
        pure
        returns (uint256)
    {
        return 0;
    }

    function compSupplyState(
        address /* cToken */
    ) external pure returns (CompMarketState memory) {
        return CompMarketState({index: 0, block: 0});
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

    function emitClaimCompCalled(address holder, address cToken) public {
        emit ClaimCompCalled(holder, cToken);
    }

    function claimComp(address holder, ICToken[] memory cTokens) external {
        emitClaimCompCalled(holder, address(cTokens[0]));
    }

    function claimComp(
        address /* holder */
    ) external {}

    function compAccrued(
        address /* holder */
    ) external pure returns (uint256) {
        return 0;
    }
}
