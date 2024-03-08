import React, { useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { PandaSigner, bsv } from 'scrypt-ts';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { OrdiProvider } from 'scrypt-ord';
import { tab } from '@testing-library/user-event/dist/tab';
import ItemViewWallet from './ItemViewWallets';

function App() {

const signerRef = useRef<PandaSigner>()

const [isConnected, setIsConnected] = useState(false)

const [walletItems, setWalletItems] = useState([])
const [marketItems, setMarketItems] = useState([])

const [activeTab, setActiveTab] = useState(0)

useEffect(() => {
  loadMarketItems()
  loadWalletItems()
}, [])

async function loadMarketItems() {
  const marketItemsRaw = localStorage.getItem('marketItems')
  if (marketItemsRaw) {
    const marketItems = JSON.parse(marketItemsRaw)
    setMarketItems(marketItems)
  }
}

async function loadWalletItems() {
  const signer = signerRef.current as PandaSigner

  if (signer) {
    try {
      const connectedOrdinalAddress = await signer.getOrdAddress()

      const url = `https://testnet.ordinals.gorillapool.io/api/txos/address/${connectedOrdinalAddress.toString()}/unspent?bsv20=false`

      const response = await fetch(url)
      const data = await response.json()

      const filteredData = data.filter(e => marketItems[e.origin.outpoint] == undefined)

      setWalletItems(filteredData)
    } catch(error) {
      console.error('Error getching wallet items', error)
    }
  }
}

const handleConect = async () => {
  const provider = new OrdiProvider(bsv.Networks.testnet)
  const signer = new PandaSigner(provider)

  signerRef.current = signer

  const { isAuthenticated, error } = await signer.requestAuth()
  if (!isAuthenticated) {
    throw new Error(error)
  }
  setIsConnected(true)
}

const handleTabChange = (e, tabIndex) => {
  if (tabIndex == 0) {
    loadWalletItems()
  } else if (tabIndex == 1) {
    loadMarketItems()
  }
  setActiveTab(tabIndex)
}

const handleList = async (idx) => {

}

  return (
    <div className="App">
      {isConnected ? (
        <div>
          <Box>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="My NFT's" />
              <Tab label="Market" />
            </Tabs>
          </Box>
          {activeTab == 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              {walletItems.map((item, idx) => {
                return <ItemViewWallet key={idx} item={item} idx={idx} onList={handleList} />
              })}
            </Box>
          )}
        </div>
      ) : (
        <div style = {{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Button variant='contained' size='large' onClick={handleConect}>
            Connect Panda Wallet
          </Button>
        </div>
      )
      }
    </div>
  );
}

export default App;
