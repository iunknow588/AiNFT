import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useNFTContract } from '../../hooks/useNFTContract';

interface NFTDetails {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  tokenAllocation: number;
  creator: string;
  owner: string;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { account } = useWeb3React();
  const nftContract = useNFTContract();

  const [nft, setNft] = useState<NFTDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (nftContract && id) {
      fetchNFTDetails();
    }
  }, [nftContract, id]);

  const fetchNFTDetails = async () => {
    if (!nftContract || !id) {
      setError('Contract not initialized or invalid ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const tokenId = parseInt(id);
      const tokenURI = await nftContract.tokenURI(tokenId);
      const creator = await nftContract.creatorOf(tokenId);
      const owner = await nftContract.ownerOf(tokenId);
      const price = await nftContract.priceOf(tokenId);
      const tokenAllocation = await nftContract.tokenAllocationOf(tokenId);

      // Fetch metadata from IPFS
      const response = await fetch(tokenURI.replace('ipfs://', process.env.VITE_IPFS_GATEWAY_URL || ''));
      const metadata = await response.json();

      setNft({
        id: tokenId,
        title: metadata.name,
        description: metadata.description,
        image: metadata.image.replace('ipfs://', process.env.VITE_IPFS_GATEWAY_URL || ''),
        price: price.toNumber(),
        tokenAllocation: tokenAllocation.toNumber(),
        creator,
        owner
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NFT details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading NFT details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchNFTDetails}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">NFT not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* NFT Image */}
        <div>
          <img
            src={nft.image}
            alt={nft.title}
            className="w-full rounded-xl shadow-lg"
          />
        </div>

        {/* NFT Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{nft.title}</h1>
          <p className="text-gray-300 mb-6">{nft.description}</p>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Price</span>
              <span className="font-medium">{nft.price} ETH</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Token Allocation</span>
              <span className="font-medium">{nft.tokenAllocation}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Creator</span>
              <span className="font-medium text-purple-400">{nft.creator}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Owner</span>
              <span className="font-medium text-purple-400">{nft.owner}</span>
            </div>
          </div>

          {account && account.toLowerCase() !== nft.owner.toLowerCase() && (
            <button
              className="w-full bg-purple-500 hover:bg-purple-600 py-3 rounded-lg font-medium"
              onClick={() => {/* Implement purchase logic */}}
            >
              Purchase NFT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 