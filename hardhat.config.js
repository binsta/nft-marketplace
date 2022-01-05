require("@nomiclabs/hardhat-waffle");

const projectId = process.env.infuraId;
const fs = require("fs");
const { env } = require("process");
const keyData = fs.readFileSync("./p-key.txt", {
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
