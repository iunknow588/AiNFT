import * as fcl from "@onflow/fcl";
import { Coins, Home, PlusSquare, Grid, User, LayoutIcon, BookOpen } from "lucide-react";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState({ loggedIn: null, addr: null });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError('');

      const timeoutDuration = parseInt(import.meta.env.VITE_WALLET_CONNECT_TIMEOUT || '30000');
      console.log(`Attempting to connect with timeout: ${timeoutDuration}ms`);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          console.log('Connection timed out after', timeoutDuration, 'ms');
          reject(new Error('CONNECTION_TIMEOUT'));
        }, timeoutDuration);
      });

      console.log('Initiating FCL authentication...');
      const authPromise = fcl.authenticate();

      // 添加调试信息
      authPromise.then(
        (result) => console.log('Authentication successful:', result),
        (error) => console.log('Authentication failed:', error)
      );

      // 使用 Promise.race 来处理超时情况
      await Promise.race([
        authPromise,
        timeoutPromise
      ]);

    } catch (error: any) {
      console.error('Connection error details:', {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      });

      const errorMessages: Record<string, string> = {
        'CONNECTION_TIMEOUT': 'Connection timed out. Please check your network and try again.',
        'USER_REJECTED': 'Connection rejected by user.',
        'NETWORK_ERROR': 'Network error. Please check your connection.',
      };

      let errorMessage = 'Failed to connect wallet';

      if (error.message === 'CONNECTION_TIMEOUT') {
        errorMessage = errorMessages['CONNECTION_TIMEOUT'];
      } else if (error.message?.includes('User rejected')) {
        errorMessage = errorMessages['USER_REJECTED'];
      } else if (error.message?.includes('Network Error')) {
        errorMessage = errorMessages['NETWORK_ERROR'];
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      if (error.message?.includes('Network Error')) {
        console.log('Attempting to clear authentication state due to network error');
        await fcl.unauthenticate();
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    fcl.unauthenticate();
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
              {user?.loggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-300">
                    {user.addr && typeof user.addr === 'string' ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}` : ''}
                  </span>
                  <button
                    onClick={disconnectWallet}
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
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect Flow Wallet'}
                  </button>
                  {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
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
