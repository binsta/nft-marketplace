// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// ERC 721 NFT
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // counters allow us to keep track of tokenIds
    // address of marketplace ofr NFT to intract
    address contractAddress;

    //OBJ: Give the NFT the ability to transact with token or change ownership
    // setApprovalForAll allows to do that with contract address

    constructor(address marketplaceAddress) ERC721("Rorschach", "RCH") {
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // passsing Ids and url
        _mint(msg.sender, newItemId);
        // set token URI: id and url
        _setTokenURI(newItemId, tokenURI);
        // give the marketplace the approval to transact between users
        setApprovalForAll(contractAddress, true);
        // mint the token and set it for sale - return the id to do so
        return newItemId;
    }
}
