// const hre = require("hardhat");

// const SMART_ACCOUNT_ADDR = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
// const SMART_ACCOUNT_ADDR = "0x06f39ffff79e127bc92c68670be9947d999377c4";
const SMART_ACCOUNT_ADDR = "0x032b9ca48062ddb0c1614b82ebc8a9bd7f136eba";

const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDR = "0xb2A25a5245419Bbb39627374CaF23F1B7a4637Fc";

async function main() {
  const smartAccount = await hre.ethers.getContractAt("YourContract", SMART_ACCOUNT_ADDR);
  const count = await smartAccount.count();
  console.log("Count is:", count);
  //   const code = await hre.ethers.provider.getCode(EP_ADDR);
  //   console.log("Code at the address is", code);

  // check balances
  console.log("smart account balance", await hre.ethers.provider.getBalance(SMART_ACCOUNT_ADDR));

  const epContract = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
  console.log("smart account balance on EntryPoint Contract", await epContract.balanceOf(SMART_ACCOUNT_ADDR));
  console.log("Paymaster balance on EntryPoint Contract", await epContract.balanceOf(PM_ADDR));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
