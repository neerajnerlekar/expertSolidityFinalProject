// Uncomment the following line to require the hardhat runtime environment
// const hre = require("hardhat");

// console.log(hre.ethers);

// to deploy another smart account change the factory nonce to 2
// const ACC_FACTORY_NONCE = 1;

// Entry point address from Alchemy
// const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
// Actual entry point address
const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
// const FACTORY_ADDRESS = "0xd9291D937F450bb6e64DDC97e266f3eCA5342a10";
// previous account factory address
const FACTORY_ADDRESS = "0xbC99415C93b48521E2651ee9eF175dEde499B694";
const PM_ADDR = "0xb2A25a5245419Bbb39627374CaF23F1B7a4637Fc";
// previous paymaster address
// const PM_ADDR = "0x4c091eF65F5b5b16f64655D528af7CCd8F4FF8c0";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);

  // previous implementation using create opcode
  // const sender = await hre.ethers.getCreateAddress({
  //   from: FACTORY_ADDRESS,
  //   nonce: ACC_FACTORY_NONCE,
  // });

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  // if smart account is created, then the init code can be 0, so that we don't reinitialize the smart contract again
  // const initCode = "0x";

  // init code to create a new account with address0 as the owner
  let initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);

  // implementation using create2 opcode
  // `getSenderAddress` reverts with an error since there is no return value. So we need to try catch the error and parse out the address from the error message.
  let sender;
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (error) {
    sender = "0x" + error.data.slice(-40);
  }

  const code = await ethers.provider.getCode(sender);

  if (code !== "0x") {
    initCode = "0x";
  }

  console.log({ sender });

  const Account = await hre.ethers.getContractFactory("YourContract");

  const userOp = {
    sender,
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PM_ADDR,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  const { preVerificationGas, verificationGasLimit, callGasLimit } = await ethers.provider.send(
    "eth_estimateUserOperationGas",
    [userOp, EP_ADDR],
  );

  userOp.preVerificationGas = preVerificationGas;
  userOp.verificationGasLimit = verificationGasLimit;
  userOp.callGasLimit = callGasLimit;

  const { maxFeePerGas } = await ethers.provider.getFeeData();
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  const maxPriorityFeePerGas = await ethers.provider.send("rundler_maxPriorityFeePerGas");
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
  // console.log(response);

  // maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
  // maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  //sending the userOp to the bundler
  const opHash = await ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDR]);
  console.log({ opHash });
  //   const tx = await entryPoint.handleOps([userOp], address0);
  //   const receipt = await tx.wait();
  //   console.log(receipt);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
