const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Market", function () {
  it("Should mint and trade NFTs", async function () {
    // test to recive contract address
    const Market = await ethers.getContractFactory("Market");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    // test to receive listing price and auction price
    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    // test for minting
    await nft.mintToken("https-t1");
    await nft.mintToken("https-t1");

    await market.makeMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.makeMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    // test for different address from distance from different users - test auctions
    // return an array of however many address
    const [_, buyerAddress] = await ethers.getSigners();

    //create a market sale with address id and price,
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {
      value: auctionPrice,
    });

    const items = await market.fetchMarketTokens();

    // test out all items
    console.log("items", items);
  });
});
