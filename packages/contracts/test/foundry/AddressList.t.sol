// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.10;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "contracts/structures/AddressList.sol";

contract AddressListTest is Test {
    using AddressList for address[];

    address[] list;

    function setUp() public {
        delete list;
    }

    function testAdd(uint8 length) public {
        vm.assume(length < 64);
        for (uint256 i = 0; i < length; i++) {
            list.add(vm.addr(i + 1));
        }
        assertEq(list.length, length);
    }

    function testContains() public {
        list = [
            address(0x1),
            address(0x2),
            address(0x3),
            address(0x4),
            address(0x5)
        ];

        assertEq(list.contains(address(0x1)), true);
        assertEq(list.contains(address(0x2)), true);
        assertEq(list.contains(address(0x5)), true);

        assertEq(list.contains(address(0x0)), false);
        assertEq(list.contains(address(0x8)), false);
    }

    function testContainsFuzz(uint8 length, uint8 index) public {
        vm.assume(length < 64);
        vm.assume(index < length);
        for (uint256 i = 0; i < length; i++) {
            list.add(vm.addr(i + 1));
        }
        assertEq(list.contains(vm.addr(index + 1)), true);
    }

    function testRemove() public {
        list = [
            address(0x0),
            address(0x1),
            address(0x2),
            address(0x3),
            address(0x4)
        ];
        assertEq(list.length, 5);

        list.remove(address(0x2));

        address[] memory expected = new address[](4);
        expected[0] = address(0x0);
        expected[1] = address(0x1);
        expected[2] = address(0x3);
        expected[3] = address(0x4);

        assertEq(list.length, expected.length);
        for (uint256 i = 0; i < list.length; i++) {
            assertEq(list[i], expected[i]);
        }
    }

    function testRemoveFuzz(uint8 length, uint8 index) public {
        vm.assume(length < 64);
        vm.assume(index < length);

        list = _filledArray(length);
        assertEq(list.length, length);

        address toRemove = vm.addr(index + 1);
        list.remove(toRemove);

        assertEq(list.length, length - 1);

        if (index > 0) {
            assertEq(list[index - 1], vm.addr(index));
        }

        if (index < list.length) {
            assertEq(list[index], vm.addr(index + 2));
        }
    }

    function testReorder() public {
        list = [
            address(0x0),
            address(0x1),
            address(0x2),
            address(0x3),
            address(0x4)
        ];

        address[] memory newOrder = new address[](5);
        newOrder[0] = address(0x1);
        newOrder[1] = address(0x0);
        newOrder[2] = address(0x3);
        newOrder[3] = address(0x4);
        newOrder[4] = address(0x2);

        list = list.reorder(newOrder);

        for (uint256 i = 0; i < list.length; i++) {
            assertEq(list[i], newOrder[i]);
        }
    }

    function testReorderWithTheSameItems() public {
        list = [
            address(0x0),
            address(0x1),
            address(0x2),
            address(0x3),
            address(0x0)
        ];

        address[] memory newOrder = new address[](5);
        newOrder[0] = address(0x1);
        newOrder[1] = address(0x0);
        newOrder[2] = address(0x0);
        newOrder[3] = address(0x3);
        newOrder[4] = address(0x2);

        list = list.reorder(newOrder);

        for (uint256 i = 0; i < list.length; i++) {
            assertEq(list[i], newOrder[i]);
        }
    }

    function testReorderFailIfNewOrderHasDifferentLength() public {
        list = [
            address(0x0),
            address(0x1),
            address(0x2),
            address(0x3),
            address(0x4)
        ];

        address[] memory newOrder = new address[](5);
        newOrder[0] = address(0x0);
        newOrder[1] = address(0x1);
        newOrder[2] = address(0x3);
        newOrder[3] = address(0x4);

        vm.expectRevert(ListsDoNotMatch.selector);
        list = list.reorder(newOrder);
    }

    function testReorderFailIfNewOrderHasDifferentItems() public {
        list = [
            address(0x0),
            address(0x1),
            address(0x2),
            address(0x3),
            address(0x4)
        ];

        address[] memory newOrder = new address[](5);
        newOrder[0] = address(0x0);
        newOrder[1] = address(0x1);
        newOrder[2] = address(0x3);
        newOrder[3] = address(0x4);
        newOrder[4] = address(0x9);

        vm.expectRevert(ListsDoNotMatch.selector);
        list = list.reorder(newOrder);
    }

    function _filledArray(uint8 length) private returns (address[] memory) {
        address[] memory expected = new address[](length);
        for (uint8 i = 0; i < length; i++) {
            expected[i] = vm.addr(i + 1);
        }
        return expected;
    }
}
