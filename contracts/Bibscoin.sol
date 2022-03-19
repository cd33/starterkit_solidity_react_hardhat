// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/** @title Bibscoin Token. */
/** @dev Homemade token, Ownership must be transfered to BibsStaking, for reward minting. */
contract Bibscoin is ERC20, Ownable {
    /** @notice Constructor of the token. */
    constructor() ERC20("Bibscoin", "BIBS") {}

    /** @notice Mint Bibscoin.
     * @dev OnlyOwner only the owner can execute this function.
     * @param recipient The recipient for the token.
     * @param amount The amount of token.
     */
    function mint(address recipient, uint256 amount) external onlyOwner {
        _mint(recipient, amount);
    }
}