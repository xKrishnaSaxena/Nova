// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public mintAuthority;
    address public freezeAuthority;
    mapping(address => bool) public isFrozen;
    address public owner;

    constructor(string memory _name, string memory _symbol,address _owner) ERC20(_name, _symbol) {
        owner = _owner;
        mintAuthority = _owner;
        freezeAuthority = _owner;
    }
   modifier onlyMintAuthority() {
        require(msg.sender == mintAuthority, "Only mint authority");
        _;
    }

    modifier onlyFreezeAuthority() {
        require(msg.sender == freezeAuthority, "Only freeze authority");
        _;
    }

    function mint(address _to, uint256 _amount) public onlyMintAuthority(){
        _mint(_to, _amount);
    }

     function burn(address _from, uint256 _amount) public onlyMintAuthority {
        _burn(_from, _amount);
    }
      function setMintAuthority(address newAuthority) public onlyMintAuthority {
        mintAuthority = newAuthority;
    }
       function setFreezeAuthority(address newAuthority) public onlyFreezeAuthority {
        freezeAuthority = newAuthority;
    }
       function freeze(address account) public onlyFreezeAuthority {
        isFrozen[account] = true;
    }
    function unfreeze(address account) public onlyFreezeAuthority {
        isFrozen[account] = false;
    }
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(!isFrozen[msg.sender], "Account is frozen");
        return super.transfer(recipient, amount);
    }
}
