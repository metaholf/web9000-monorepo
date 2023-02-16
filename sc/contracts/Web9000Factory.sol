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
        string name;
        string symbol;
    }

    Collection[] private _collections;

    event DeployArtWhaleERC721(
        address indexed deployer,
        address indexed newContract,
        Collection collection
    );

    constructor(address trustedForwarder_) ERC2771Context(trustedForwarder_) {
        trustedForwarder = trustedForwarder_;
    }

    function deployArtWhaleERC721(
        address implementation_,
        string memory name_,
        string memory symbol_,
        uint256 salt_
    ) external returns (address) {

        address instance = Clones.cloneDeterministic(implementation_, bytes32(salt_));

        Collection memory newCollection = Collection({
            sc: instance,
            name: name_,
            symbol: symbol_
        });

        _collections.push(newCollection);

        Web9000ERC721(instance).initialize(name_, symbol_, _msgSender(), trustedForwarder);

        emit DeployArtWhaleERC721(
            _msgSender(),
            address(instance),
            newCollection
        );

        return instance;
    }

    function getAllCollections() view external returns(Collection[] memory) {
        return _collections;
    }

}
