const { expect } = require("chai");
const { ethers } = require("hardhat");

function tokens(n) {
  return ethers.utils.parseEther(n);
}

describe("EthSwap", function () {
  let Token, token, EthSwap, ethSwap, provider;
  let admin, user1, user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();
    provider = ethers.getDefaultProvider();
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.deployed();
    EthSwap = await ethers.getContractFactory("EthSwap");
    ethSwap = await EthSwap.deploy(token.address);
    await ethSwap.deployed();
    await token.transfer(ethSwap.address, tokens('1000000'))
  });
  describe('Deployment', async function () {
    it('Should deploy contracts and transfer all tokens to EthSwap', async function () {

      expect(await token.name()).to.equal("Indian Token");
      expect(await ethSwap.name()).to.equal("EthSwap Instant Exchange");
      expect(await token.balanceOf(ethSwap.address)).to.equal(tokens('1000000'));
    });
  });
  describe('Buy Tokens', async function () {
    it('Should allow users to purchase IND tokens instantly', async function () {
      await ethSwap.connect(user1).buyTokens({ value: ethers.utils.parseEther('1') });
      expect(await token.balanceOf(user1.address)).to.equal(tokens('100'));
      expect(await token.balanceOf(ethSwap.address)).to.equal(tokens('999900'));
      //expect(await provider.getBalance(ethSwap.address).toString()).to.equal(tokens('1'));

      console.log((await ethSwap.getBalance()).toString());
      // const event = buy.logs[0].args;
      // expect(event.account).to.equal(user1);
      // expect(event.token).to.equal(token.address);
      // expect(event.amount.toString()).to.equal(tokens('100').toString());
      // expect(event.rate).to.equal('100');
    });
  });
  describe('Sell Tokens', async function () {
    it('Should allow users to sell IND tokens instantly', async function () {
      await ethSwap.connect(user1).buyTokens({ value: ethers.utils.parseEther('1') });

      await token.connect(user1).approve(ethSwap.address, tokens('100'));
      await ethSwap.connect(user1).sellTokens(tokens('100'));
      expect(await token.balanceOf(user1.address)).to.equal(tokens('0'))
      expect(await token.balanceOf(ethSwap.address)).to.equal(tokens('1000000'))

      // console.log(buy);
      // const event = buy.logs[0].args;
      // expect(event.account).to.equal(user1);
      // expect(event.token).to.equal(token.address);
      // expect(event.amount.toString()).to.equal(tokens('100').toString());
      // expect(event.rate).to.equal('100');
    });
  });
});



