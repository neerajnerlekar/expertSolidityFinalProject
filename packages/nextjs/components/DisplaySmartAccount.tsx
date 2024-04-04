"use client";

import React, { useEffect, useState } from "react";
import { Address, Balance } from "./scaffold-eth";
import { ethers } from "ethers";
import { formatEther } from "viem";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

// import { useSignMessage } from "wagmi";

const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
// const FACTORY_ADDRESS = "0xbC99415C93b48521E2651ee9eF175dEde499B694";
const PM_ADDR = "0xb2A25a5245419Bbb39627374CaF23F1B7a4637Fc";
const SMART_ACCOUNT_ADDR = "0x032b9ca48062ddb0c1614b82ebc8a9bd7f136eba";

const DisplaySmartAccount = () => {
  const [count, setCount] = useState(0);
  const smartAccount = useScaffoldContractRead({ contractName: "YourContract", functionName: "count" });

  const paymasterBalance = useScaffoldContractRead({
    contractName: "EntryPoint",
    functionName: "balanceOf",
    args: [PM_ADDR],
  });

  const handleClick = async () => {
    const provider = new ethers.AlchemyProvider("base-sepolia", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
    // const { signMessage } = useSignMessage();

    const entryPoint = new ethers.Contract(EP_ADDR, ["EntryPoint"], provider);

    // const AccountFactory = new ethers.Contract(FACTORY_ADDRESS, ["AccountFactory"], provider);

    const sender = SMART_ACCOUNT_ADDR;

    const Account = new ethers.Contract(SMART_ACCOUNT_ADDR, ["Account"], provider);

    const userOp = {
      sender,
      nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
      initCode: "0x",
      callData: Account.interface.encodeFunctionData("execute"),
      paymasterAndData: PM_ADDR,
      signature:
        "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    };

    const { preVerificationGas, verificationGasLimit, callGasLimit } = await entryPoint.send(
      "eth_estimateUserOperationGas",
      [userOp, EP_ADDR],
    );
    console.log({ preVerificationGas, verificationGasLimit, callGasLimit });

    (userOp as any).preVerificationGas = preVerificationGas;
    (userOp as any).verificationGasLimit = verificationGasLimit;
    (userOp as any).callGasLimit = callGasLimit;

    const { maxFeePerGas } = await provider.getFeeData();
    if (maxFeePerGas !== null) {
      (userOp as any).maxFeePerGas = "0x" + maxFeePerGas.toString(16);
    }

    const maxPriorityFeePerGas = await provider.send("rundler_maxPriorityFeePerGas", {});
    (userOp as any).maxPriorityFeePerGas = maxPriorityFeePerGas;

    // const userOpHash = await entryPoint.getUserOpHash(userOp);
    // userOp.signature = await signMessage(userOpHash) as unknown as string;

    //sending the userOp to the bundler
    const opHash = await provider.send("eth_sendUserOperation", [userOp, EP_ADDR]);
    console.log({ opHash });
  };

  const getCount = async () => {
    setCount(Number(smartAccount.data) || 0); // Update count state with the result or default to 0
  };

  useEffect(() => {
    if (smartAccount) {
      getCount(); // Call getCount when the component mounts
    }
  }, [smartAccount]);

  return (
    <>
      <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
        <h1>
          Smart Account: <Balance address={SMART_ACCOUNT_ADDR} />
        </h1>
        <Address address={SMART_ACCOUNT_ADDR} />

        <h1 className="mt-6">Paymaster Balance on Entry Point: {Number(formatEther(paymasterBalance.data ?? 0n))}</h1>

        <button className="btn secondary mt-5" onClick={handleClick}>
          Execute Count
        </button>
      </div>
      <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
        <p className="text-lg">Count: {count}</p>
      </div>
    </>
  );
};

export default DisplaySmartAccount;
