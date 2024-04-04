import React, { useState } from "react";
import DisplaySmartAccount from "./DisplaySmartAccount";
import { useAccount } from "wagmi";

const SmartaccountConnector = () => {
  const [connected, setIsConnected] = useState(false);

  const handleclick = async () => {
    setIsConnected(true);
  };

  const { address } = useAccount();

  return (
    <>
      {address === "0xd0983D7dA8e89fb292C41684408366cB78c2EA04" ? (
        connected ? (
          <DisplaySmartAccount />
        ) : (
          <div>
            <h1 className="text-lg pb-4">Login To Your Smart Account</h1>
            <button className="btn primary" onClick={handleclick}>
              Connect
            </button>
          </div>
        )
      ) : (
        <div>
          <h1 className="text-lg pb-4">No smart Account deployed.</h1>
        </div>
      )}
    </>
  );
};

export default SmartaccountConnector;
