import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/Market.sol/Market.json";
import Image from "next/image";

export default function AccountDashboard() {
  const [nfts, setNFts] = useState([]);
  const [sold, setSold] = useState([]);

  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // what we want to load:
    // ***provider, tokenContract, marketContract, data for our marketItems***

    const web3Modal = new Web3Modal({
      network: "ropsten",
      cacheProvider: true,
    });
    console.log(web3Modal);
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const data = await marketContract.fetchItemsCreated();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // we want get the token metadata - json
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );

    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNFts(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <h1 className='px-20 py-7 text-4x1 justify-center text-[#e6e6e9]'>
        You have not Minted any NFTs! :(
      </h1>
    );
  return (
    <div className='p-4'>
      <h1 className='py-2 text-2xl'>Token Mited</h1>
      <div className='px-4' style={{ maxWidth: "1600px" }}>
        <div className='grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4'>
          {nfts.map((nft, i) => (
            <div key={i} className='overflow-hidden border shadow rounded-x1'>
              <Image src={nft.image} alt='image' />
              <div className='p-4'>
                <p
                  style={{ height: "64px" }}
                  className='font-semibold text-3x1'
                >
                  {nft.name}
                </p>
                <div style={{ height: "72px", overflow: "hidden" }}>
                  <p className='text-gray-400'>{nft.description}</p>
                </div>
              </div>
              <div className='p-4 bg-[#e6e6e9]'>
                <p className='mb-4 font-bold text-white text-3x-1'>
                  {nft.price} ETH
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
