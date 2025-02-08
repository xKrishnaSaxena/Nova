// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "../src/TokenFactory.sol";

contract TestContract is Test {
    TokenFactory public factory;

    function setUp() public {
        factory = new TokenFactory();
    }

   function testCreateToken() public {
    string memory name = "TestToken";
    string memory symbol = "TST";
    vm.prank(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    address tokenAddress = factory.createToken(name, symbol);
    Token token = Token(tokenAddress);
    vm.prank(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    token.mint(address(this), 100);
    vm.prank(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    token.burn(address(this), 10);
    assertEq(token.balanceOf(address(this)), 90);
    
    token.transfer(address(0xdAC17F958D2ee523a2206206994597C13D831ec7), 20);
    assertEq(token.balanceOf(address(this)), 70);
    assertEq(token.totalSupply(), 90);
    assertEq(token.name(), name);
    assertEq(token.symbol(), symbol);
  
}

}
