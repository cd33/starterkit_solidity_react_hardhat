import React, { useState, useEffect } from 'react'
import * as s from '../styles/global.style'
import nft from '../assets/nft.gif'
import Counter from './Counter'

const Content = ({
  ethers,
  goodNetwork,
  error,
  loading,
  accounts,
  owner,
  sellingStep,
  setStep,
  handleMint,
  gift,
  setMerkleRoot,
  setBaseUri,
  maxSup,
  whitelistPrice,
  publicPrice,
  currentTotalSupply,
}) => {
  const [counterNFT, setCounterNFT] = useState(1)
  const [counterStep, setCounterStep] = useState(0)
  const [basketETH, setBasketETH] = useState(0)
  const [giftAddress, setGiftAddress] = useState(null)
  const [giftCounter, setGiftCounter] = useState(1)
  const [newMerkleRoot, setNewMerkleRoot] = useState(null)
  const [newBaseUri, setNewBaseUri] = useState(null)

  useEffect(() => {
    if (sellingStep === 1) {
      setBasketETH(counterNFT * whitelistPrice)
    }
    if (sellingStep === 2) {
      setBasketETH(counterNFT * publicPrice)
    }
    if (sellingStep === 0) {
      setBasketETH(0)
    }
  }, [sellingStep, counterNFT, whitelistPrice, publicPrice])

  return (
    <s.Container bc="white" ai="center" jc="center">
      <img alt="nftGif" src={nft} />

      {!goodNetwork ? (
        <s.Text
          fs="3em"
          color="red"
          style={{ marginBottom: '15vh', marginTop: '10vh' }}
        >
          {error}
        </s.Text>
      ) : (
        <>
          {sellingStep !== 1 && sellingStep !== 2 ? (
            <s.Text
              fs="4em"
              color="rgba(18, 124, 255, 1)"
              style={{ marginBottom: '15vh', marginTop: '10vh' }}
            >
              The sale has not yet started
              {/* <br/><span style={{fontSize: "0.8em", color: "black"}}>Or the site has problems connecting to the Smart Contract</span> */}
            </s.Text>
          ) : (
            <>
              {error && (
                <s.Text fs="3em" color="red" style={{ marginBottom: '2vh' }}>
                  {error}
                </s.Text>
              )}

              {(sellingStep === 1 || sellingStep === 2) && (
                <>
                  <s.Text fs="3em">How many NFTs do you want ?</s.Text>

                  <Counter
                    counter={counterNFT}
                    setCounter={setCounterNFT}
                    limit={sellingStep === 1 ? 2 : 4}
                  />
                </>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: '5vh',
                  marginTop: '5vh',
                }}
              >
                <s.Text
                  fs="2em"
                  style={{ alignSelf: 'center', marginRight: '2vw' }}
                >
                  Price : {ethers.utils.formatEther(basketETH.toString())} ETH
                </s.Text>
                <s.Button
                  width="8em"
                  onClick={() => handleMint(counterNFT)}
                  disabled={loading ? 1 : 0}
                >
                  {loading ? 'Loading...' : 'MINT'}
                </s.Button>
              </div>

              {currentTotalSupply && (
                <s.Text
                  color="rgba(18, 124, 255, 1)"
                  fs="3em"
                  style={{ marginBottom: '5vh' }}
                >
                  NFTs minted : {currentTotalSupply.toString()}/{maxSup}
                </s.Text>
              )}
            </>
          )}
        </>
      )}

      {accounts.length > 0 && owner === accounts[0] && (
        <>
          <s.Text fs="4em" color="red" style={{ marginTop: '10vh' }}>
            ADMIN
          </s.Text>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: '5vh',
              marginBottom: '10vh',
            }}
          >
            <s.Text
              fs="3em"
              color="green"
              style={{ alignSelf: 'center', marginRight: '2vw' }}
            >
              Actuel : {sellingStep}
            </s.Text>

            <Counter
              counter={counterStep}
              setCounter={setCounterStep}
              limit={2}
              start={0}
            />

            <s.Button
              style={{ marginLeft: '2vw' }}
              width="11em"
              onClick={() => setStep(counterStep)}
              disabled={loading ? 1 : 0}
            >
              {loading ? 'Loading...' : 'SETSTEP'}
            </s.Button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '10vh',
              zIndex: 1,
            }}
          >
            <s.Input
              placeholder="Address"
              onChange={(e) => setGiftAddress(e.target.value)}
              style={{ marginRight: '2vw' }}
            />

            <Counter
              counter={giftCounter}
              setCounter={setGiftCounter}
              limit={3}
            />

            <s.Button
              style={{ marginLeft: '2vw' }}
              width="11em"
              onClick={() => gift(giftAddress, giftCounter)}
              disabled={loading ? 1 : 0}
            >
              {loading ? 'Loading...' : 'GIFT'}
            </s.Button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              zIndex: 1,
              marginBottom: '10vh',
            }}
          >
            <s.Input
              placeholder="Merkle Root"
              onChange={(e) => setNewMerkleRoot(e.target.value)}
            />

            <s.Button
              style={{ marginLeft: '2vw' }}
              width="11em"
              onClick={() => setMerkleRoot(newMerkleRoot)}
              disabled={loading ? 1 : 0}
            >
              {loading ? 'Loading...' : 'SETMERKLEROOT'}
            </s.Button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '10vh',
            }}
          >
            <s.Input
              placeholder="Base URI"
              onChange={(e) => setNewBaseUri(e.target.value)}
            />

            <s.Button
              style={{ marginLeft: '2vw' }}
              width="11em"
              onClick={() => setBaseUri(newBaseUri)}
              disabled={loading ? 1 : 0}
            >
              {loading ? 'Loading...' : 'SET BASE URI'}
            </s.Button>
          </div>
        </>
      )}
    </s.Container>
  )
}

export default Content