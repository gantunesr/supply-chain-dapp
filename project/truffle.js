const HDWallet = require("@truffle/hdwallet-provider");
const infuraEndpoint = "";
const metamaskSeed = "";

module.exports = {
  networks: {
    rinkeby: {
      provider: () => new HDWallet(metamaskSeed, infuraEndpoint),
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24", 
    }
  }
};