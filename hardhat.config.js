require("@nomiclabs/hardhat-waffle");
require("dotenv").config;
const fs = require("fs");
const projectId = fs.readFileSync(".env").toString().trim() || "";
const keyData = fs.readFileSync(".pkey", {
  encoding: "utf8",
  flag: "r",
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337, // config standard
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${projectId}`,
    },

    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: [keyData],
    },
  },
  solidity: {
    version: "0.8.4",
    setting: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
