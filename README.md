# starterkit_solidity_react_hardhat

## Les commandes utilisés :
```
npm init
npm i hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts dotenv
npx hardhat
npx create-react-app client
cd client
npm i ethers styled-components react-router-dom
```
## Modifier dans hardhat.config.js
```
module.exports = {
  solidity: '0.8.7',
  paths: {
    artifacts: './client/src/artifacts',
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000000,
    },
  },
  mocha: {
    timeout: 90000,
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    rinkeby: {
      url: process.env.INFURA,
      accounts: [process.env.PRIVATE_KEY],
    },  
  },
};
```
## Fichier .env
```
PRIVATE_KEY=""
INFURA="https://rinkeby.infura.io/v3/..."
```

## Déploiement :
```
npx hardhat node
npx hardhat run scripts/deploy.js --network <network-name>
```