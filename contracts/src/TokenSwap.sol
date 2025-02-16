// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenSwap {
    ERC20 public tokenA;
    ERC20 public tokenB;
    address public owner;
    uint256 public rate;

    event Swapped(address indexed user, uint256 amountA, uint256 amountB);

    constructor(address _tokenA, address _tokenB, uint256 _rate) {
        tokenA = ERC20(_tokenA);
        tokenB = ERC20(_tokenB);
        owner = msg.sender;
        rate = _rate;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function swap(uint256 amountA) external {
        require(amountA > 0, "Amount must be positive");
        uint256 amountB = amountA * rate;
        require(tokenB.balanceOf(address(this)) >= amountB, "Insufficient tokenB balance");
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "Transfer of tokenA failed");
        require(tokenB.transfer(msg.sender, amountB), "Transfer of tokenB failed");
        emit Swapped(msg.sender, amountA, amountB);
    }

    function depositTokenB(uint256 amount) external onlyOwner {
        require(tokenB.transferFrom(msg.sender, address(this), amount), "Deposit failed");
    }

    function withdrawTokenB(uint256 amount) external onlyOwner {
        require(tokenB.transfer(owner, amount), "Withdrawal failed");
    }

    function updateRate(uint256 newRate) external onlyOwner {
        rate = newRate;
    }
}