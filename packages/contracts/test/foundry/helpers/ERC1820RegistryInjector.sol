// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "forge-std/Test.sol";

import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777SenderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol";

contract ERC1820Registry is IERC1820RegistryUpgradeable {
    function setManager(address account, address newManager) external {}

    function getManager(address account) external pure returns (address) {
        return account;
    }

    function setInterfaceImplementer(
        address account,
        bytes32 _interfaceHash,
        address implementer
    ) external {}

    function getInterfaceImplementer(
        address, /* account */
        bytes32 /* _interfaceHash */
    ) external pure returns (address) {
        return address(0);
    }

    function interfaceHash(string calldata interfaceName)
        external
        pure
        returns (bytes32)
    {
        return bytes32(bytes(interfaceName));
    }

    function updateERC165Cache(address account, bytes4 interfaceId) external {}

    function implementsERC165Interface(
        address, /* account */
        bytes4 /* interfaceId */
    ) external pure returns (bool) {
        return true;
    }

    function implementsERC165InterfaceNoCache(
        address, /* account */
        bytes4 /* interfaceId */
    ) external pure returns (bool) {
        return true;
    }
}

abstract contract ERC1820RegistryInjector {
    address private constant _ERC1820_REGISTRY_ADDRESS =
        0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24;

    constructor(Vm vm) {
        ERC1820Registry registry = new ERC1820Registry();
        vm.etch(_ERC1820_REGISTRY_ADDRESS, address(registry).code);
    }
}
