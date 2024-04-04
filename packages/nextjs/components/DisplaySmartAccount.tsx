"use client";

import React, { useEffect, useState } from "react";
import { Address, Balance } from "./scaffold-eth";
import { formatEther } from "viem";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

// const EP_ADDR = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
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
    console.log("clicked");
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
