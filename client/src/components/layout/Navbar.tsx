import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Wallet, Home, PlusSquare, Grid, User, Coins, BookOpen, Layout as LayoutIcon } from 'lucide-react';
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
          {/* Left section: Logo and primary navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold">NFT Platform</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link to="/mint" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <PlusSquare className="w-4 h-4" />
                <span>Mint</span>
              </Link>
              <Link to="/gallery" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <Grid className="w-4 h-4" />
                <span>Gallery</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </div>
          </div>

          {/* Right section: Secondary navigation and wallet */}
          <div className="flex items-center space-x-6">
            {/* Secondary navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/platform" className="text-gray-300 hover:text-white transition-colors">
                <LayoutIcon className="w-4 h-4" />
              </Link>
              <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">
                <BookOpen className="w-4 h-4" />
              </Link>
            </div>

            {/* Wallet connection */}
            <div>
              {isActive ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-300">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                  <button
                    onClick={() => connector?.deactivate?.()}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
