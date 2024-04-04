"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import SmartaccountConnector from "~~/components/SmartaccountConnector";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Hacker Dashboard</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            {connectedAddress ? (
              <div>
                <p className="my-2 font-medium">Connected Address:</p>
                <Address address={connectedAddress} />
              </div>
            ) : (
              "Login to connect to your hacker"
            )}
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <SmartaccountConnector />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
