const hre = require("hardhat");

async function main() {

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  console.log("IND Token deployed to:", token.address);

  const EthSwap = await hre.ethers.getContractFactory("EthSwap");
  const ethSwap = await EthSwap.deploy(token.address);
  await ethSwap.deployed();
  console.log("EthSwap deployed to:", ethSwap.address);
  await token.transfer(ethSwap.address, '1000000000000000000000000');
  console.log("Balance on IND in EthSwap contract: ", (await token.balanceOf(ethSwap.address)).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
