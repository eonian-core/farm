// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.19;

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

library AccessTestHelper{

    function getErrorMessage(address account, bytes32 role) public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "AccessControl: account ",
                StringsUpgradeable.toHexString(account),
                " is missing role ",
                StringsUpgradeable.toHexString(uint256(role), 32)
            )
        );
    }

}