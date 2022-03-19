import React from 'react'
import dai from '../dai.png'
import * as s from '../styles/global.style'

const Content = ({ bibscoinBalance, mintBibscoin }) => (
  <s.Container
    bc="black"
    ai="center"
    style={{ borderRadius: 20, width: '30%', padding: 20 }}
  >
    <s.TextTitle>Bibscoin</s.TextTitle>
    {bibscoinBalance <= 0 ? (
      <s.Button onClick={mintBibscoin} primary>
        Mint Bibscoin
      </s.Button>
    ) : (
      <>
        <s.Container fd="row" ai="center" style={{ width: 'auto' }}>
          <img src={dai} height="35" alt="" style={{ marginRight: 5 }} />
          <s.TextSubTitle>
            Available: {bibscoinBalance} ETH
          </s.TextSubTitle>
        </s.Container>
        <s.Button onClick={mintBibscoin} primary>
          Mint Bibscoin
        </s.Button>
      </>
    )}
  </s.Container>
)

export default Content
