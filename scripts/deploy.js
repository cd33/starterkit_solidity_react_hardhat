const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners(); //get the account to deploy the contract
  console.log("Deploying contracts with the account:", deployer.address);

  const Bibscoin = await hre.ethers.getContractFactory("Bibscoin");
  const bibscoin = await Bibscoin.deploy();

  await bibscoin.deployed();

  console.log("Bibscoin deployed to:", bibscoin.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
