import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Wallet, Home, PlusSquare, Grid, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isActive, account, connector } = useWeb3React();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    if (!connector || !(connector instanceof MetaMask)) {
      setError('Please install MetaMask to connect');
      return;
    }

    try {
      setIsConnecting(true);
      setError('');

      // 检查是否安装了MetaMask
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to connect');
      }

      await (connector as MetaMask).activate();

      const chainId = import.meta.env.VITE_CHAIN_ID || '0x1';
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId,
                chainName: import.meta.env.VITE_NETWORK_NAME || 'Ethereum Mainnet',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [import.meta.env.VITE_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/your-api-key'],
                blockExplorerUrls: ['https://etherscan.io/'],
              }],
            });
          } catch (addError) {
            console.error('Error adding chain:', addError);
            setError('Failed to add network to MetaMask');
          }
        }
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold">NFT Platform</span>
            </Link>
          </div>

          <div>
            {isActive ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
                <button
                  onClick={() => connector && connector.deactivate()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
