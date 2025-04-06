import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Bell, Eye, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNFTContract } from '../../hooks/useNFTContract';

interface NFT {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  tokenAllocation: number;
}

const Profile = () => {
  const { account, provider } = useWeb3React();
  const nftContract = useNFTContract();

  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [error, setError] = useState('');

  const fetchUserNFTs = useCallback(async () => {
    console.log('fetchUserNFTs called with:', { account, nftContract: !!nftContract, provider: !!provider });
    
    if (!nftContract || !account) {
      console.log('Missing dependencies:', { hasContract: !!nftContract, hasAccount: !!account });
      setError('Please connect your wallet and try again');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const balance = await nftContract.balanceOf(account);
      console.log('User NFT balance:', balance.toString());

      const fetchedNFTs: NFT[] = [];
      let valueSum = 0;
      let tokensSum = 0;

      for (let i = 0; i < balance.toNumber(); i++) {
        console.log(`Fetching NFT ${i + 1} of ${balance.toString()}`);
        const tokenId = await nftContract.tokenOfOwnerByIndex(account, i);
        console.log('TokenId:', tokenId.toString());
        
        const tokenURI = await nftContract.tokenURI(tokenId.toNumber());
        console.log('TokenURI:', tokenURI);
        
        const price = await nftContract.priceOf(tokenId.toNumber());
        const tokenAllocation = await nftContract.tokenAllocationOf(tokenId.toNumber());

        // Fetch metadata from IPFS
        const response = await fetch(tokenURI.replace('ipfs://', process.env.VITE_IPFS_GATEWAY_URL || ''));
        const metadata = await response.json();

        const nft = {
          id: tokenId.toNumber(),
          title: metadata.name,
          description: metadata.description,
          image: metadata.image.replace('ipfs://', process.env.VITE_IPFS_GATEWAY_URL || ''),
          price: price.toNumber(),
          tokenAllocation: tokenAllocation.toNumber()
        };

        fetchedNFTs.push(nft);
        valueSum += nft.price;
        tokensSum += nft.tokenAllocation;
      }

      setUserNFTs(fetchedNFTs);
      setTotalValue(valueSum);
      setTotalTokens(tokensSum);
    } catch (err: unknown) {
      console.error('Error in fetchUserNFTs:', err);
      setError(err instanceof Error ? err.message : 'Error fetching user NFTs');
    } finally {
      setLoading(false);
    }
  }, [account, nftContract, provider]);

  useEffect(() => {
    console.log('Profile component mounted/updated:', { 
      hasAccount: !!account, 
      hasContract: !!nftContract,
      contractAddress: nftContract?.address
    });
    
    if (account && nftContract) {
      fetchUserNFTs();
    }
  }, [account, nftContract, fetchUserNFTs]);

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Please connect your wallet to view your profile</p>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchUserNFTs}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex flex-wrap gap-6 justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Value</p>
              <p className="text-xl font-semibold">{totalValue.toFixed(3)} ETH</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Tokens</p>
              <p className="text-xl font-semibold">{totalTokens}</p>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">My NFTs</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your NFTs...</p>
          </div>
        ) : userNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNFTs.map(nft => (
              <Link
                key={nft.id}
                to={`/nft/${nft.id}`}
                className="bg-gray-800/50 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-transform"
              >
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{nft.title}</h3>
                  <p className="text-gray-400 line-clamp-2 mb-4">{nft.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400">{nft.price} ETH</span>
                    <span className="text-gray-400">{nft.tokenAllocation} Tokens</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl">
            <p className="text-gray-400 mb-4">You don't have any NFTs yet</p>
            <Link
              to="/mint"
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg inline-block"
            >
              Mint Your First NFT
            </Link>
          </div>
        )}
      </div>

      {/* Settings */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Push notifications</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold">Display</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Show token values</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Dark mode</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold">Privacy</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Public profile</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Show activity</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 