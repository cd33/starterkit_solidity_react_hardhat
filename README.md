# starterkit_solidity_react_hardhat
## Installation
### Les modifications à effectuer :
* Modifier le README.md
* Ajout d'un fichier .env
```
PRIVATE_KEY=""
INFURA="https://rinkeby.infura.io/v3/..."
```

* Dans ./client:
  - Modifier "name" du package.json
* Dans ./client/public:
  - Personnaliser index.html et manifest.json
  - Modifier les icons à l'aide du site https://realfavicongenerator.net/
* Dans ./client/src:
  - Changer address
  - Changer chainId

### Les commandes à utiliser avant utilisation :
```
npm init
npm i hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts dotenv hardhat-contract-sizer keccak256 merkletreejs prettier-plugin-solidity
npx hardhat
cd client
npm install
```

## Déploiement :
```
npx hardhat node
npx hardhat run scripts/deploy.js --network <network-name> (ex: localhost, rinkeby...)
```

### Les commandes utilisées pour ce projet :
```
npm init
npm i hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
npx hardhat
npx create-react-app client
cd client
npm i ethers styled-components react-router-dom keccak256 merkletreejs
```