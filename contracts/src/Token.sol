// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public owner;

    constructor(string memory _name, string memory _symbol,address _owner) ERC20(_name, _symbol) {
        owner = _owner;
    }

    function mint(address _to, uint256 _amount) public {
        require(msg.sender == owner, "Only owner can mint");
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) public {
        require(msg.sender == owner, "Only owner can burn");
        _burn(_from, _amount);
    }
    function transfer(address _to, uint256 _amount) public override returns (bool) {
        return super.transfer(_to, _amount);
    }
}
