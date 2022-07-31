/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "contracts/automation/gelato/IOps.sol";

/// Testing implementation of IOps
contract OpsMock is IOps {
    
    address payable public gelato;

    function setGelato(address payable _gelato) public {
        gelato = _gelato;
    }

    uint256 public fee;
    address public feeToken;

    function setFeeDetails(uint256 _fee, address _feeToken) public {
        fee = _fee;
        feeToken = _feeToken;
    }

    function getFeeDetails() public view returns (uint256, address) {
        return (fee, feeToken);
    }

}