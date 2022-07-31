// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

error ListsDoNotMatch();

library AddressList {
    /// @notice Adds an address to the list.
    /// @param list the list of addresses.
    /// @param addr the address to add.
    function add(address[] storage list, address addr) internal {
        list.push(addr);
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
        for (uint256 i = 0; i < list.length - 1; i++) {
            if (list[i] == addr) {
                addressFound = true;
            }
            if (addressFound) {
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
    function reorder(address[] storage list, address[] calldata reoderedList)
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
                if (existingAddress == list[j]) {
                    break;
                }
                if (j == length - 1) {
                    revert ListsDoNotMatch();
                }
            }
        }
        return reoderedList;
    }
}
