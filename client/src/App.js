import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Contract from './artifacts/contracts/Bibscoin.sol/Bibscoin.json'
import Content from './components/Content'
import Hello from './components/Hello'
import Modal from './components/Modal'
import NavbarCustom from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import * as s from './styles/global.style'

const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function App() {
  const [loader, setLoader] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [balance, setBalance] = useState(0)
  const [modalShow, setModalShow] = useState(false)
  const [titleModal, setTitleModal] = useState(false)
  const [contentModal, setContentModal] = useState(false)

  useEffect(() => {
    getAccounts()
    setLoader(false)
  }, [])

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

  async function getAccounts() {
    // check if metamask o other exists
    if (typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccounts(accounts)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const balance = await provider.getBalance(accounts[0])
      const balanceInEth = ethers.utils.formatEther(balance)
      setBalance(balanceInEth)
    }
  }

  async function mint() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(address, Contract.abi, signer)

      try {
        const transaction = await contract.mint(
          accounts[0],
          ethers.utils.parseEther("1000"),
          { from: accounts[0] },
        )
        await transaction.wait()
      } catch (error) {
        handleModal('error', error.message)
      }
    }
  }

  const handleModal = (title, content) => {
    setTitleModal(title)
    setContentModal(content)
    setModalShow(true)
  }

  return (
    <s.Screen>
      <s.Container ai="center" flex={1} bc="#36468e" style={{ paddingTop: 80 }}>
        {loader || !accounts ? (
          <s.TextTitle style={{ alignSelf: 'center' }}>
            Loading Web3, accounts, and contract...
          </s.TextTitle>
        ) : (
          <Routes>
            <Route path="/" element={<NavbarCustom accounts={accounts} />}>
              <Route
                index
                element={
                  <Content bibscoinBalance={balance} mintBibscoin={mint} />
                }
              />
              <Route path="hello" element={<Hello />} />
              <Route
                path="*"
                element={
                  <>
                    <s.TextTitle fs="80" style={{ marginTop: 80 }}>
                      Il n'y a rien ici !
                    </s.TextTitle>
                    <s.ButtonHome>
                      <s.ButtonLink to="/">Accueil</s.ButtonLink>
                    </s.ButtonHome>
                  </>
                }
              />
            </Route>
          </Routes>
        )}
        <Modal
          modalShow={modalShow}
          setModalShow={setModalShow}
          title={titleModal}
          content={contentModal}
        />
      </s.Container>
    </s.Screen>
  )
}

export default App
