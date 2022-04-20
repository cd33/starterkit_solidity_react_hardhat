// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Bibs NFTs 1155 Collection
/// @author cd33
contract Bibs1155 is Ownable, ERC1155 {
    using Strings for uint256;

    address private recipient = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    enum Step {
        Before,
        WhitelistSale,
        PublicSale
    }

    Step public sellingStep;

    uint8 constant NFT1 = 1;

    uint16 public nextNFT;
    uint16 public maxSupply = 6000;

    uint32 public whitelistStartTime = 1652738400; // 17/05 à minuit

    uint256 public whitelistSalePrice = 0.01 ether;
    uint256 public publicSalePrice = 0.02 ether;

    mapping(address => uint8) amountPerWalletWhitelist;

    string public baseURI;

    bytes32 merkleRoot;

    /**
     * @notice Emitted when the step changed.
     */
    event StepChanged(uint8 _step);

    /**
     * @notice Constructor of the contract ERC1155.
     * @param _merkleRoot Used for the whitelist.
     * @param _baseURI Metadatas for the ERC1155.
     */
    constructor(bytes32 _merkleRoot, string memory _baseURI) ERC1155(_baseURI) {
        merkleRoot = _merkleRoot;
        baseURI = _baseURI;
    }

    /**
     * @notice Enables only externally owned accounts (= users) to mint.
     */
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "Caller is a contract");
        _;
    }

    /**
     * @notice Allows to change the step of the contract.
     * @param _step Step to change.
     */
    function setStep(uint8 _step) external onlyOwner {
        sellingStep = Step(_step);
        emit StepChanged(_step);
    }

    /**
     * @notice Change the base URI.
     * @param _newBaseURI New base URI.
     **/
    function setBaseUri(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    /**
     * @notice Change the token's image URI, override for OpenSea traits compatibility.
     * @param _tokenId Id of the token.
     * @return string Token's metadatas URI.
     */
    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_tokenId > 0 && _tokenId < 5, "NFT doesn't exist");
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    /**
     * @notice Mint during the whitelist.
     * @param _proof Merkle Proof.
     * @param _quantity Number of tokens to mint.
     */
    function whitelistSaleMint(bytes32[] calldata _proof, uint8 _quantity) external payable {
        require(block.timestamp >= whitelistStartTime, "Whitelist Sale has not started yet");
        require(block.timestamp < whitelistStartTime + 1 days, "Whitelist Sale is finished");
        require(sellingStep == Step.WhitelistSale, "Whitelist sale not active");
        require(_isWhiteListed(msg.sender, _proof), "Not whitelisted");
        require(_quantity > 0 && _quantity < 4, "Quantity between 1 & 3");
        require(amountPerWalletWhitelist[msg.sender] + _quantity <= 3, "Max 3 NFT per wallet");
        require(nextNFT + _quantity <= maxSupply, "Sold out");
        require(msg.value >= _quantity * whitelistSalePrice, "Not enough funds");
        payable(recipient).transfer(address(this).balance);
        amountPerWalletWhitelist[msg.sender] += _quantity;
        nextNFT += _quantity;
        _mint(msg.sender, NFT1, _quantity, bytes(abi.encodePacked("Bibs NFT #1")));   
    }

    /**
     * @notice Mint in BNB during the public sale 1.
     * @param _quantity Number of tokens to mint.
     */
    function publicSaleMint(uint16 _quantity) external payable {
        require(sellingStep == Step.PublicSale, "Public sale not active");
        require(_quantity > 0 && _quantity < 16, "Quantity between 1 & 15");
        require(nextNFT + _quantity <= maxSupply, "Sold out");
        require(msg.value >= _quantity * publicSalePrice, "Not enough funds");
        payable(recipient).transfer(address(this).balance);
        nextNFT += _quantity;
        _mint(msg.sender, NFT1, _quantity, bytes(abi.encodePacked("Bibs NFT Type #1")));
    }

    /**
     * @notice Allows the owner to offer NFTs.
     * @param _to Receiving address.
     * @param _tokenId Id of tokens to mint.
     * @param _quantity Number of tokens to mint.
     * @param _name Name of tokens to mint.
     */
    function gift(
        address _to,
        uint16 _tokenId,
        uint16 _quantity,
        string memory _name
    ) external onlyOwner {
        require(nextNFT + _quantity <= maxSupply, "Sold out");
        require(_tokenId > 0 && _tokenId < 2, "NFT doesn't exist");
        nextNFT += _quantity;
        _mint(_to, _tokenId, _quantity, bytes(abi.encodePacked(_name)));
    }

    // WHITELIST
    /**
     * @notice Change Merkle root to update the whitelist.
     * @param _merkleRoot Merkle Root.
     **/
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    /**
     * @notice Return true or false if the account is whitelisted or not.
     * @param _account User's account.
     * @param _proof Merkle Proof.
     * @return bool Account whitelisted or not.
     **/
    function _isWhiteListed(address _account, bytes32[] calldata _proof)
        internal
        view
        returns (bool)
    {
        return _verify(_leafHash(_account), _proof);
    }

    /**
     * @notice Return the account hashed.
     * @param _account Account to hash.
     * @return bytes32 Account hashed.
     **/
    function _leafHash(address _account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_account));
    }

    /**
     * @notice Returns true if a leaf can be proven to be part of a Merkle tree defined by root.
     * @param _leaf Leaf.
     * @param _proof Merkle Proof.
     * @return bool Be part of the Merkle tree or not.
     **/
    function _verify(bytes32 _leaf, bytes32[] memory _proof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(_proof, merkleRoot, _leaf);
    }
}