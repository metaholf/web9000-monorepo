// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

// solhint-disable no-empty-blocks, func-name-mixedcase

// inheritance
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// libs
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/SignatureCheckerUpgradeable.sol";

contract Web9000ERC721 is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC2771ContextUpgradeable,
    OwnableUpgradeable
{

    mapping(uint256 => bool) public releases;

    // event Mint(
    //     address indexed target,
    //     uint256 indexed tokenId,
    //     string uri,
    //     uint256 mintPrice,
    //     uint256 nonce,
    //     uint256 deadline,
    //     bytes signature
    // );

    //
    // proxy constructor
    //

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_
    ) external initializer {
        __Web9000ERC721_init(name_, symbol_, owner_);
    }

    function __Web9000ERC721_init(
        string memory name_,
        string memory symbol_,
        address owner_
    ) internal onlyInitializing {
        __ERC721_init_unchained(name_, symbol_);
        __ERC721Enumerable_init_unchained();
        __Ownable_init_unchained();

        __Web9000ERC721_init_unchained(
            name_,
            symbol_,
            owner_
        );
    }

    function __Web9000ERC721_init_unchained(
        string memory,
        string memory,
        address owner_
    ) internal onlyInitializing {
        _transferOwnership(owner_);
    }

    //
    // external methods
    //

    function setURI(
        uint256 tokenId_,
        string memory uri_
    ) external virtual onlyOperator {
        _setTokenURI(tokenId_, uri_);
    }

    function mint(
        address target_,
        uint256 tokenId_,
        string memory uri_,
        uint256 mintPrice_,
        uint256 nonce_,
        uint256 deadline_,
        bytes memory signature_
    ) external payable virtual {
        require(!nonces[nonce_], "Web9000ERC721: nonce already used");
        require(
            block.timestamp <= deadline_,
            "Web9000ERC721: expired deadline"
        );
        require(msg.value == mintPrice_, "Web9000ERC721: wrong mint price");

        payable(operator()).sendValue(msg.value);

        bytes32 structHash = keccak256(
            abi.encode(
                MINT_TYPEHASH,
                target_,
                tokenId_,
                keccak256(bytes(uri_)),
                mintPrice_,
                nonce_,
                deadline_
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);

        require(
            SignatureCheckerUpgradeable.isValidSignatureNow(
                operator(),
                digest,
                signature_
            ),
            "Web9000ERC721: invalid signature"
        );

        nonces[nonce_] = true;
        _mint(target_, tokenId_);
        _setTokenURI(tokenId_, uri_);

        emit Mint({
            target: target_,
            tokenId: tokenId_,
            uri: uri_,
            mintPrice: mintPrice_,
            nonce: nonce_,
            deadline: deadline_,
            signature: signature_
        });
    }

    function tokenURI(
        uint256 tokenId_
    )
        public
        view
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId_);
    }

    function supportsInterface(
        bytes4 interfaceId_
    )
        public
        view
        virtual
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return
            interfaceId_ == type(IRoyalty).interfaceId ||
            super.supportsInterface(interfaceId_);
    }

    //
    // overridden methods for creator fees (https://support.opensea.io/hc/en-us/articles/1500009575482)
    //

    function setApprovalForAll(
        address operator_,
        bool approved_
    )
        public
        virtual
        override(ERC721Upgradeable, IERC721Upgradeable)
        onlyAllowedOperatorApproval(operator_)
    {
        super.setApprovalForAll(operator_, approved_);
    }

    function approve(
        address operator_,
        uint256 tokenId_
    )
        public
        virtual
        override(ERC721Upgradeable, IERC721Upgradeable)
        onlyAllowedOperatorApproval(operator_)
    {
        super.approve(operator_, tokenId_);
    }

    function transferFrom(
        address from_,
        address to_,
        uint256 tokenId_
    )
        public
        virtual
        override(ERC721Upgradeable, IERC721Upgradeable)
        onlyAllowedOperator(from_)
    {
        super.transferFrom(from_, to_, tokenId_);
    }

    function safeTransferFrom(
        address from_,
        address to_,
        uint256 tokenId_
    )
        public
        virtual
        override(ERC721Upgradeable, IERC721Upgradeable)
        onlyAllowedOperator(from_)
    {
        super.safeTransferFrom(from_, to_, tokenId_);
    }

    function safeTransferFrom(
        address from_,
        address to_,
        uint256 tokenId_,
        bytes memory data_
    )
        public
        virtual
        override(ERC721Upgradeable, IERC721Upgradeable)
        onlyAllowedOperator(from_)
    {
        super.safeTransferFrom(from_, to_, tokenId_, data_);
    }

    //
    // internal methods
    //

    function _beforeTokenTransfer(
        address from_,
        address to_,
        uint256 tokenId_
    )
        internal
        virtual
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from_, to_, tokenId_);
    }

    function _beforeConsecutiveTokenTransfer(
        address from,
        address to,
        uint256 first,
        uint96 size
    )
        internal
        virtual
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeConsecutiveTokenTransfer(from, to, first, size);
    }

    function _burn(
        uint256 tokenId_
    )
        internal
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId_);
        _resetTokenRoyalty(tokenId_);
    }
}
