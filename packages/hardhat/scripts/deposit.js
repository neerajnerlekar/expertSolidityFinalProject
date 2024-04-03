// Uncomment the following line to run this script with Hardhat EVM
// const hre = require("hardhat");

// const EP_ADDR = "0x2815D183258273c7233BAc225cb004F56eb48798";
const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDR = "0xb2A25a5245419Bbb39627374CaF23F1B7a4637Fc";
// previous paymaster address
// const PM_ADDR = "0x4c091eF65F5b5b16f64655D528af7CCd8F4FF8c0";

async function main() {
  const entryPoint = await ethers.getContractAt("EntryPoint", EP_ADDR);

  // run this once to fund the entry point contract to execute userOPs since we don't have a bundler yet.
  await entryPoint.depositTo(PM_ADDR, {
    value: ethers.parseEther("0.3"),
  });

  console.log("Funded the Paymaster on the entry point contract");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
