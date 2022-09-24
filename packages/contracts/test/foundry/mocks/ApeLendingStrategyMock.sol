// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "contracts/strategies/ApeLendingStrategy.sol";

contract ApeLendingStrategyMock is ApeLendingStrategy {
    constructor(
        address _vault,
        address _cToken,
        address _ops,
        address __nativeTokenPriceFeed,
        address __assetPriceFeed,
        uint256 _minReportInterval,
        bool _isPrepaid
    ) {
        initialize(
            _vault,
            _cToken,
            _ops,
            __nativeTokenPriceFeed,
            __assetPriceFeed,
            _minReportInterval,
            _isPrepaid
        );
    }

    function estimatedAccruedBanana() public view returns (uint256) {
        return super._estimatedAccruedBanana();
    }

    function estimatedAccruedBananaPerBlock() public view returns (uint256) {
        return super._estimatedAccruedBananaPerBlock();
    }
}
