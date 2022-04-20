import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Contract from './artifacts/contracts/Bibs721A.sol/Bibs721A.json'
import Content from './components/Content'
import { Route, Routes } from 'react-router-dom'
import * as s from './styles/global.style'
import background from './assets/background.jpg'
import background2 from './assets/background2.jpg'

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const tokens = require('./tokens.json')
const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const owner = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' // attention aux miniscules, {accounts.length > 0 && console.log(accounts[0])}

function App() {
  const [loader, setLoader] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [goodNetwork, setGoodNetwork] = useState(false)
  const [sellingStep, setSellingStep] = useState(null)
  const [whitelistPrice, setWhitelistPrice] = useState(0)
  const [publicPrice, setPublicPrice] = useState(0)
  const [maxSup, setMaxSup] = useState(null)
  const [currentTotalSupply, setCurrentTotalSupply] = useState(null)

  async function getAccounts() {
    // check if metamask o other exists
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const { chainId } = await provider.getNetwork()
      if (chainId !== 31337 && chainId !== 1 && chainId !== 4) {
        setGoodNetwork(false)
        setError('Please Switch to the ETH Mainnet Network')
        return
      } else {
        setGoodNetwork(true)
      }

      let accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccounts(accounts)
    }
  }

  window.ethereum.addListener('connect', async (response) => {
    getAccounts()
  })

  window.ethereum.on('accountsChanged', () => {
    window.location.reload()
  })

  window.ethereum.on('chainChanged', () => {
    window.location.reload()
  })

  window.ethereum.on('disconnect', () => {
    window.location.reload()
  })

  useEffect(() => {
    async function getInfos() {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(address, Contract.abi, provider)
        try {
          const step = await contract.sellingStep()
          setSellingStep(step)
          const priceWhitelistSale = await contract.whitelistSalePrice()
          setWhitelistPrice(priceWhitelistSale)
          const pricePublicSale = await contract.publicSalePrice()
          setPublicPrice(pricePublicSale)
          const maxSup = await contract.MAX_SUPPLY()
          setMaxSup(maxSup)
          const totalSupply = await contract.totalSupply()
          setCurrentTotalSupply(totalSupply)
        } catch (error) {
          console.log(error.message)
        }
      }
    }

    getAccounts()
    getInfos()
    setLoader(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // EVENTS
  useEffect(() => {
    if (accounts[0]) {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(address, Contract.abi, provider)
        contract.on('StepChanged', (_step) => {
          setSellingStep(_step)
        })
      }

      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(address, Contract.abi, provider)
        contract.on('Transfer', async () => {
          const totalSupply = await contract.totalSupply()
          setCurrentTotalSupply(totalSupply)
        })
      }
    }
  }, [accounts])

  async function setStep(_step) {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, Contract.abi, signer)

      try {
        const transaction = await contract.setStep(_step, { from: accounts[0] })
        await transaction.wait()
        setLoading(false)
      } catch (error) {
        console.log('error', error.message)
        setLoading(false)
      }
    }
  }

  async function whitelistSaleMint(_quantity) {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, Contract.abi, signer)

      let tab = []
      tokens.map((token) => tab.push(token.address))
      const leaves = tab.map((address) => keccak256(address))
      const tree = new MerkleTree(leaves, keccak256, { sort: true })
      const leaf = keccak256(accounts[0])
      const proof = tree.getHexProof(leaf)

      try {
        let overrides = {
          from: accounts[0],
          value: whitelistPrice * _quantity,
        }
        const transaction = await contract.whitelistSaleMint(
          _quantity,
          proof,
          overrides,
        )
        await transaction.wait()
        setLoading(false)
      } catch (error) {
        // var mySubString = error.message.substring(
        //   error.message.indexOf('reverted: ') + 10,
        //   error.message.lastIndexOf('","data'),
        // )
        if (error.data) {
          var mySubString = error.data.message.substring(
            error.data.message.indexOf("string '") + 8,
            error.data.message.lastIndexOf(`'`),
          )
          setError(mySubString)
        } else {
          console.log(error.message)
        }
        // if (error.data) {
        //   setError(error.data.message)
        // } else {
        //   setError(error.message)
        // }
        setLoading(false)
      }
    }
  }

  async function publicSaleMint(_quantity) {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, Contract.abi, signer)

      try {
        let overrides = {
          from: accounts[0],
          value: publicPrice * _quantity,
        }
        const transaction = await contract.publicSaleMint(_quantity, overrides)
        await transaction.wait()
        setLoading(false)
      } catch (error) {
        if (error.data) {
          var mySubString = error.data.message.substring(
            error.data.message.indexOf("string '") + 8,
            error.data.message.lastIndexOf(`'`),
          )
          setError(mySubString)
        } else {
          console.log(error.message)
        }
        setLoading(false)
      }
    }
  }

  async function gift(_to, _quantity) {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, Contract.abi, signer)

      try {
        let overrides = {
          from: accounts[0],
        }
        const transaction = await contract.gift(_to, _quantity, overrides)
        await transaction.wait()
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setLoading(false)
      }
    }
  }

  async function setBaseUri(_baseUri) {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, Contract.abi, signer)

      try {
        let overrides = {
          from: accounts[0],
        }
        const transaction = await contract.setBaseUri(_baseUri, overrides)
        await transaction.wait()
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setLoading(false)
      }
    }
  }

  async function setMerkleRoot(_merkleRoot) {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, Contract.abi, signer)

      try {
        let overrides = {
          from: accounts[0],
        }
        const transaction = await contract.setMerkleRoot(_merkleRoot, overrides)
        await transaction.wait()
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setLoading(false)
      }
    }
  }

   // async function setMaxSupply(_amount) {
  //   if (typeof window.ethereum !== 'undefined') {
  //     setLoading(true)
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(address, Contract.abi, signer)

  //     try {
  //       let overrides = {
  //         from: accounts[0],
  //       }
  //       const transaction = await contract.setMaxSupply(_amount, overrides)
  //       await transaction.wait()
  //       setLoading(false)
  //     } catch (error) {
  //       console.log(error.message)
  //       setLoading(false)
  //     }
  //   }
  // }

  // async function setWhitelistSalePrice(_amount) {
  //   if (typeof window.ethereum !== 'undefined') {
  //     setLoading(true)
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(address, Contract.abi, signer)

  //     try {
  //       let overrides = {
  //         from: accounts[0],
  //       }
  //       const transaction = await contract.setWhitelistSalePrice(
  //         _amount,
  //         overrides,
  //       )
  //       await transaction.wait()
  //       setLoading(false)
  //     } catch (error) {
  //       console.log(error.message)
  //       setLoading(false)
  //     }
  //   }
  // }

  // async function setWhitelistLimitBalance(_amount) {
  //   if (typeof window.ethereum !== 'undefined') {
  //     setLoading(true)
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(address, Contract.abi, signer)

  //     try {
  //       let overrides = {
  //         from: accounts[0],
  //       }
  //       const transaction = await contract.setWhitelistLimitBalance(
  //         _amount,
  //         overrides,
  //       )
  //       await transaction.wait()
  //       setLoading(false)
  //     } catch (error) {
  //       console.log(error.message)
  //       setLoading(false)
  //     }
  //   }
  // }

  // async function setPublicSalePrice(_amount) {
  //   if (typeof window.ethereum !== 'undefined') {
  //     setLoading(true)
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(address, Contract.abi, signer)

  //     try {
  //       let overrides = {
  //         from: accounts[0],
  //       }
  //       const transaction = await contract.setPublicSalePrice(
  //         _amount,
  //         overrides,
  //       )
  //       await transaction.wait()
  //       setLoading(false)
  //     } catch (error) {
  //       console.log(error.message)
  //       setLoading(false)
  //     }
  //   }
  // }

  // async function setPublicSaleLimitBalance(_amount) {
  //   if (typeof window.ethereum !== 'undefined') {
  //     setLoading(true)
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const signer = provider.getSigner()
  //     const contract = new ethers.Contract(address, Contract.abi, signer)

  //     try {
  //       let overrides = {
  //         from: accounts[0],
  //       }
  //       const transaction = await contract.setPublicSaleLimitBalance(
  //         _amount,
  //         overrides,
  //       )
  //       await transaction.wait()
  //       setLoading(false)
  //     } catch (error) {
  //       console.log(error.message)
  //       setLoading(false)
  //     }
  //   }
  // }

  const handleMint = (_quantity) => {
    if (goodNetwork) {
      if (sellingStep === 1) {
        whitelistSaleMint(_quantity)
      } else if (sellingStep === 2) {
        publicSaleMint(_quantity)
      } else {
        setError('The mint has not started')
        return
      }
    } else {
      setError('Please Switch to the Mainnet Network')
    }
  }

  return (
    <s.Screen style={{ alignItems: 'center', backgroundColor: '#1d476f' }}>
      {loader || !accounts ? (
        <>
          <s.Container
            ai="center"
            jc="center"
            image={background}
            style={{ minHeight: '70vh' }}
          />
          <s.Text
            color="white"
            fs="3em"
            style={{ marginTop: '10vh', marginBottom: '10vh' }}
          >
            Waiting for connection with Metamask...
          </s.Text>
          <s.Container image={background2} style={{ minHeight: '70vh' }} />
        </>
      ) : (
        <Routes>
          <Route
            index
            element={
              <Content
                ethers={ethers}
                goodNetwork={goodNetwork}
                error={error}
                loading={loading}
                accounts={accounts}
                owner={owner}
                sellingStep={sellingStep}
                setStep={setStep}
                handleMint={handleMint}
                gift={gift}
                setMerkleRoot={setMerkleRoot}
                setBaseUri={setBaseUri}
                maxSup={maxSup}
                whitelistPrice={whitelistPrice}
                publicPrice={publicPrice}
                currentTotalSupply={currentTotalSupply}
              />
            }
          />
          <Route
            path="*"
            element={
              <>
                <s.Container
                  ai="center"
                  jc="center"
                  image={background}
                  style={{ minHeight: '70vh' }}
                />
                <s.Text color="white" fs="3em" style={{ marginTop: '5vh' }}>
                There is nothing here
                </s.Text>
                <s.ButtonLink to="/">
                  <s.Button
                    style={{ marginBottom: '5vh', marginTop: '5vh' }}
                    bc="rgba(18, 124, 255, 1)"
                    width="15vw"
                  >
                    Home
                  </s.Button>
                </s.ButtonLink>
                <s.Container
                  image={background2}
                  style={{ minHeight: '70vh' }}
                />
              </>
            }
          />
        </Routes>
      )}
    </s.Screen>
  )
}

export default App
