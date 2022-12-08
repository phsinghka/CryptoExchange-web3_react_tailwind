const hre = require('hardhat');

const main = async () => {
  const Transactions = await hre.ethers.getContractFactory('Transactions');
  const transaction = await Transactions.deploy();

  await transaction.deployed();

  console.log(`Transactions deployed to ${transaction.address}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
