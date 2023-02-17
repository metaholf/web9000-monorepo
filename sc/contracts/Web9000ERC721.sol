// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

// solhint-disable no-empty-blocks, func-name-mixedcase

// inheritance
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ERC2771ContextFixed.sol";

// libs
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/SignatureCheckerUpgradeable.sol";

contract Web9000ERC721 is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    ERC2771ContextFixed
{

    uint256 public tokenIdCounter;
    uint256 public totalReleases;
    mapping(uint256 => bytes32) public releases;
    mapping(uint256 => mapping(uint256 => bool)) public claimed;

    event Mint(
        address indexed target,
        uint256 indexed releaseId,
        uint256 leafId,
        uint256 tokenId,
        bytes32[] proof,
        uint256 timestamp
    );

    //
    // proxy constructor
    //

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        address trustedForwarder_
    ) external initializer {
        __Web9000ERC721_init(name_, symbol_, owner_, trustedForwarder_);
    }

    function __Web9000ERC721_init(
        string memory name_,
        string memory symbol_,
        address owner_,
        address trustedForwarder_
    ) internal onlyInitializing {
        __ERC721_init_unchained(name_, symbol_);
        __ERC721Enumerable_init_unchained();
        __Ownable_init_unchained();

        __Web9000ERC721_init_unchained(
            name_,
            symbol_,
            owner_,
            trustedForwarder_
        );
    }

    function __Web9000ERC721_init_unchained(
        string memory,
        string memory,
        address owner_,
        address trustedForwarder_
    ) internal onlyInitializing {
        _transferOwnership(owner_);
        _setTrustedForwarder(trustedForwarder_);
    }

    //
    // external methods
    //

    function createRelease(bytes32 merkleRoot_) external onlyOwner {
        releases[totalReleases] = merkleRoot_;
        totalReleases += 1;
    }

    function mint(
        uint256 releaseId_, uint256 leafId_, bytes32[] memory merkleProof_
    ) external virtual {
        require(releaseId_ < totalReleases, "Web9000ERC721: wrong releaseId");
        require(_verify(releaseId_, _msgSender(), leafId_, merkleProof_), "Web9000ERC721: invalid proof or wrong data");
        require(!claimed[releaseId_][leafId_], "Web9000ERC721: already claimed");

        _mint(_msgSender(), tokenIdCounter);

        emit Mint({
            target: _msgSender(),
            releaseId: releaseId_,
            leafId: leafId_,
            tokenId: tokenIdCounter,
            proof: merkleProof_,
            timestamp: block.timestamp
        });

        claimed[releaseId_][leafId_] = true;
        tokenIdCounter += 1;
    }

    function debugMint(address target) external {
        _mint(target, tokenIdCounter);
        tokenIdCounter += 1;
    }

    function getAllReleases() external view returns(bytes32[] memory) {
        bytes32[] memory result = new bytes32[](totalReleases);
        for (uint256 i = 0; i < totalReleases; i++) {
            result[i] = releases[i];
        }
        return result;
    }

    function checkClaim(uint256 releaseId_, address target_, uint256 leafId_, bytes32[] memory merkleProof_) external view returns(bool) {
        return (_verify(releaseId_, target_, leafId_, merkleProof_));
    }

    function getUserTokens(address target_) external view returns(uint256[] memory) {
        uint256 amount = ERC721Upgradeable.balanceOf(target_);
        uint256[] memory result = new uint256[](amount);

        for (uint256 i = 0; i < amount; i++) {
            result[i] = tokenOfOwnerByIndex(target_, i);
        }

        return(result);
    }

    function tokenURI(
        uint256 tokenId_
    )
        public
        view
        virtual
        override(ERC721Upgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId_);
    }

    //
    // internal method
    //

    function _verify(uint256 releaseId, address _target, uint256 _leafId, bytes32[] memory _merkleProof) internal view returns(bool) {
        bytes32 node = keccak256(abi.encodePacked(releaseId, _target, _leafId));
        return(MerkleProofUpgradeable.verify(_merkleProof, releases[releaseId], node));
    }

    //
    // overriden methods
    //

    function supportsInterface(
        bytes4 interfaceId_
    )
        public
        view
        virtual
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId_);
    }

    function _beforeTokenTransfer(
        address from_,
        address to_,
        uint256 tokenId_,
        uint256 batchSize
    )
        internal
        virtual
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from_, to_, tokenId_, batchSize);
    }

    function _msgSender() internal view virtual override(ContextUpgradeable, ERC2771ContextFixed) returns (address sender) {
        return(ERC2771ContextFixed._msgSender());
    }

    function _msgData() internal view virtual override(ContextUpgradeable, ERC2771ContextFixed) returns (bytes calldata) {
        return(ERC2771ContextFixed._msgData());
    }

}
