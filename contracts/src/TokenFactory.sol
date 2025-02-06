// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./Token.sol";

contract TokenFactory {
    event TokenCreated(address indexed owner, address tokenAddress, string name, string symbol);

    function createToken(string memory _name, string memory _symbol) public returns (address) {
        Token newToken = new Token(_name, _symbol, msg.sender);
        emit TokenCreated(msg.sender, address(newToken), _name, _symbol);
        return address(newToken);
    }
}
