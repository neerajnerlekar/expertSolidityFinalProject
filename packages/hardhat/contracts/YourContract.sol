//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract is IAccount{
	uint public count;
    address public owner; 

    constructor (address _owner) {
        owner = _owner; 
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 ) view
    external returns (uint256 validationData) {
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);

        // validateUserOp doesn't return a boolean, so we know if it returns 1 then, the validation failed.If it returns 0 then, the owner is the same as the recovered address.
        return recovered == owner ? 0 : 1;
        
    }

    function execute() external {
        count++;
    }

    receive() external payable {}
}

contract AccountFactory {
    function createAccount(address owner) external returns (address) {

        bytes32 salt = bytes32(uint256(uint160(owner)));
        bytes memory bytecode = abi.encodePacked(type(YourContract).creationCode, abi.encode(owner));

        address accountAddress = Create2.computeAddress(salt, keccak256(bytecode));
        if(accountAddress.code.length > 0) {
            return accountAddress;
        }

        return deploy(salt, bytecode);

        // returns a new account address using create op code
        // return address(new Account(owner));
    }

    function deploy( bytes32 salt, bytes memory bytecode) internal returns (address addr) {
        require(bytecode.length != 0, "Create2: bytecode length is zero");
        /// @solidity memory-safe-assembly
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Create2: Failed on deploy");
    }
}