# Coffee Supply Chain

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between farmer, distributor, retailer and consumer in a coffee supply chain. The user story is similar to any commonly used supply chain process. In this case, the farmer can harvest, process, pack and sell to a distributor, the distributor can ship it to a retailer, and the retailer is able to sell it to a customer.

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
* [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier.
