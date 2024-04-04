import React, { useState } from "react";
import DisplaySmartAccount from "./DisplaySmartAccount";

const SmartaccountConnector = () => {
  const [connected, setIsConnected] = useState(false);

  const handleclick = async () => {
    console.log("clicked");
    setIsConnected(true);
  };

  return (
    <>
      {connected ? (
        <DisplaySmartAccount />
      ) : (
        <div>
          <h1 className="text-lg pb-4">Login To Your Smart Account</h1>
          <button className="btn primary" onClick={handleclick}>
            Connect
          </button>
        </div>
      )}
    </>
  );
};

export default SmartaccountConnector;
