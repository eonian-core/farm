// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.19;

error ListsDoNotMatch();

library AddressList {
    /// @notice Adds an address to the list.
    /// @param list the list of addresses.
    /// @param addr the address to add.
    function add(address[] storage list, address addr) internal {
        list.push(addr);
    }

    /// @notice Checks if the list contains the specified item.
    /// @param list the list of addresses.
    /// @param addr the address to find.
    function contains(address[] storage list, address addr)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == addr) {
                return true;
            }
        }
        return false;
    }

    /// @notice Removes an address from the list and fills the gap with the following items by moving them up.
    /// @param list the list of addresses.
    /// @param addr the address to remove.
    /// @return A boolean value that indicates if the address was found and removed from the list.
    function remove(address[] storage list, address addr)
        internal
        returns (bool)
    {
        bool addressFound;
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == addr) {
                addressFound = true;
            }
            if (addressFound && i < list.length - 1) {
                list[i] = list[i + 1];
            }
        }
        if (addressFound) {
            list.pop();
        }
        return addressFound;
    }

    /// @notice Checks if the list can be reordered in the specified way.
    /// @param list the list of addresses.
    /// @param reoderedList the desired reordered list, which must have the same content as the existing list.
    /// @return A reordered list
    function reorder(address[] storage list, address[] memory reoderedList)
        internal
        view
        returns (address[] memory)
    {
        uint256 length = list.length;
        if (length != reoderedList.length) {
            revert ListsDoNotMatch();
        }
        for (uint256 i = 0; i < length; i++) {
            address existingAddress = list[i];
            for (uint256 j = 0; j < length; j++) {
                // Address is found, move to the next item
                if (existingAddress == reoderedList[j]) {
                    break;
                }
                // If this is the last iteration, then the address is not found
                if (j == length - 1) {
                    revert ListsDoNotMatch();
                }
            }
        }
        return reoderedList;
    }
}
