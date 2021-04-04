# Supply chain & data auditing

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

## Tool stack

```()
Node: v10.10.0
Solidity: v0.4.24
Truffle: v4.1.14
```

## Get Started

1. **Install dependencies:**

```()
> npm install
```

2. a. **Run smart contract locally:**

In `./project`

```()
> truffle
(truffle-console) > compile
```

2. b. **Deploy in Rinkeby testnet:**

In `.project/truffle.js` change the `infuraEndpoint` and add your Metamask mnemonic to `metamaskSeed`.

```()
> truffle
(truffle-console) > compile
(truffle-console) > migrate --reset --network rinkeby
```

2. c. **Use deployed contract in Rinkeby testnet:**

In the address `0x1264a0F1ae19C6327a31a32513BFFb825eC1DA5d` in the rinkeby testnet network there is a deployed contract to use with the dapp.

3. **Deploy the frontend:**

```()
> npm run dev
```

## Contract

Address in Rinkeby network: [0x1264a0F1ae19C6327a31a32513BFFb825eC1DA5d](https://rinkeby.etherscan.io/address/0x1264a0f1ae19c6327a31a32513bffb825ec1da5d)

## Built With

* [Ethereum](https://www.ethereum.org/) - Ethereum is a decentralized platform that runs smart contracts
* [IPFS](https://ipfs.io/) - IPFS is the Distributed Web | A peer-to-peer hypermedia protocol to make the web faster, safer, and more open.
* [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier.
