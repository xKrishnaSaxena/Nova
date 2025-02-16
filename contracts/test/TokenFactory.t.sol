// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/TokenFactory.sol";
import "../src/TokenSwap.sol";

contract TestContract is Test {
    TokenFactory public factory;
    address public constant OWNER = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address public user = address(1);
    Token public tokenA;
    Token public tokenB;
    TokenSwap public swapContract;
    uint256 public constant RATE = 1;

    function setUp() public {
        factory = new TokenFactory();
        vm.prank(OWNER);
        address tokenAAddress = factory.createToken("TokenA", "TKA");
        tokenA = Token(tokenAAddress);
        vm.prank(OWNER);
        address tokenBAddress = factory.createToken("TokenB", "TKB");
        tokenB = Token(tokenBAddress);
        swapContract = new TokenSwap(address(tokenA), address(tokenB), RATE);
        vm.prank(OWNER);
        tokenA.mint(user, 1000);
        vm.prank(OWNER);
        tokenB.mint(address(swapContract), 1000);
        vm.prank(user);
        tokenA.approve(address(swapContract), type(uint256).max);
    }

    function testCreateToken() public {
        string memory name = "TestToken";
        string memory symbol = "TST";
        vm.prank(OWNER);
        address tokenAddress = factory.createToken(name, symbol);
        Token token = Token(tokenAddress);
        assertEq(token.mintAuthority(), OWNER);
        assertEq(token.freezeAuthority(), OWNER);
        vm.prank(OWNER);
        token.mint(address(this), 100);
        vm.prank(OWNER);
        token.burn(address(this), 10);
        assertEq(token.balanceOf(address(this)), 90);
        token.transfer(OWNER, 20);
        assertEq(token.balanceOf(address(this)), 70);
        assertEq(token.totalSupply(), 90);
        assertEq(token.name(), name);
        assertEq(token.symbol(), symbol);
    }

    function testFreeze() public {
        vm.prank(OWNER);
        tokenA.freeze(user);
        vm.prank(user);
        vm.expectRevert("Account is frozen");
        tokenA.transfer(address(2), 10);
        vm.prank(OWNER);
        tokenA.unfreeze(user);
        vm.prank(user);
        tokenA.transfer(address(2), 10);
        assertEq(tokenA.balanceOf(address(2)), 10);
    }

    function testChangeMintAuthority() public {
        address newAuthority = address(2);
        vm.prank(OWNER);
        tokenA.setMintAuthority(newAuthority);
        assertEq(tokenA.mintAuthority(), newAuthority);
        vm.prank(OWNER);
        vm.expectRevert("Only mint authority");
        tokenA.mint(address(this), 100);
        vm.prank(newAuthority);
        tokenA.mint(address(this), 100);
        assertEq(tokenA.balanceOf(address(this)), 100);
    }

    function testSwap() public {
        uint256 amountA = 100;
        assertEq(tokenA.balanceOf(user), 1000);
        assertEq(tokenB.balanceOf(address(swapContract)), 1000);
        vm.prank(user);
        swapContract.swap(amountA);
        assertEq(tokenA.balanceOf(user), 900);
        assertEq(tokenA.balanceOf(address(swapContract)), 100);
        assertEq(tokenB.balanceOf(user), 100);
        assertEq(tokenB.balanceOf(address(swapContract)), 900);
    }

    function testInsufficientTokenB() public {
        vm.prank(user);
        vm.expectRevert("Insufficient tokenB balance");
        swapContract.swap(1500);
    }

    function testOnlyOwnerWithdraw() public {
        vm.prank(user);
        vm.expectRevert("Only owner");
        swapContract.withdrawTokenB(100);
    }
}