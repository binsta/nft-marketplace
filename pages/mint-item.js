import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/Market.sol/Market.json";
import { useRouter } from "next/router";
import Image from "next/image";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function MintItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (err) {
      console.log(err);
    }
  }

  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (err) {
      console.log(err);
    }
  }

  async function createSale(url) {
    // create list them on marketplace
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // create token
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.mintToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, "ether");

    // List item for sales
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.maketMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("./");
  }

  return (
    <div className='flex justify-center'>
      <div className='flex flex-col w-1/2 pb-12'>
        <input
          placeholder='Asset Name'
          className='p-4 mt-8 border rounded text-[#ffff]'
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder='Asset Description'
          className='p-4 mt-2 border rounded text-[#ffff]'
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder='Asset Price in Eth'
          type='number'
          className='p-4 mt-2 border rounded text-[#ffff]'
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type='file' name='Asset' className='mt-4' onChange={onChange} />{" "}
        {fileUrl && (
          <Image
            className='mt-4 rounded'
            width={50}
            src={fileUrl}
            alt='fileUrls'
            height={50}
            layout='responsive'
          />
        )}
        <button
          onClick={createMarket}
          className='p-4 mt-4 font-bold text-#000000 bg-[#66666e] hover:bg-[#e6e6e9] rounded shadow-lg'
        >
          Mint NFT
        </button>
      </div>
    </div>
  );
}
