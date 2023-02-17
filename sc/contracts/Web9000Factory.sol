// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

// solhint-disable no-empty-blocks, func-name-mixedcase

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./Web9000ERC721.sol";

contract Web9000Factory is ERC2771Context {

    address public trustedForwarder;

    struct Collection {
        address sc;
        address owner;
        string name;
        string symbol;
    }
    struct Call {
        address target;
        bytes callData;
    }

    Collection[] private _collections;
    mapping(address => Collection[]) _collectionsByOwner;

    event DeployERC721(
        Collection collection,
        uint256 timestamp
    );

    constructor(address trustedForwarder_) ERC2771Context(trustedForwarder_) {
        trustedForwarder = trustedForwarder_;
    }

    function deployERC721(
        address implementation_,
        string memory name_,
        string memory symbol_,
        uint256 salt_
    ) external returns (address) {

        address instance = Clones.cloneDeterministic(implementation_, bytes32(salt_));

        Collection memory newCollection = Collection({
            sc: instance,
            owner: _msgSender(),
            name: name_,
            symbol: symbol_
        });

        _collections.push(newCollection);
        _collectionsByOwner[_msgSender()].push(newCollection);

        Web9000ERC721(instance).initialize(name_, symbol_, _msgSender(), trustedForwarder);

        emit DeployERC721(
            newCollection,
            block.timestamp
        );

        return instance;
    }

    function getAllCollections() view external returns(Collection[] memory) {
        return _collections;
    }

    function getAllCollectionsByOwner(address target) view external returns(Collection[] memory) {
        return _collectionsByOwner[target];
    }

    // multicall helper
    function aggregateCall(Call[] memory calls) external view returns (uint256 blockNumber, bytes[] memory returnData) {
        blockNumber = block.number;
        returnData = new bytes[](calls.length);
        for(uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.staticcall(calls[i].callData);
            require(success, "failed");
            returnData[i] = ret;
        }
    }

}
