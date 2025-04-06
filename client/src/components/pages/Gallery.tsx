import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNFTContract } from '../../hooks/useNFTContract';

interface NFT {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  tokenAllocation: number;
  creator: string;
}

const Gallery = () => {
  const { account } = useWeb3React();
  const nftContract = useNFTContract();

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'tokens'>('recent');
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const fetchNFTs = useCallback(async () => {
    if (!nftContract) {
      setError('Contract not initialized');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const totalSupply = await nftContract.totalSupply();
      const fetchedNFTs: NFT[] = [];

      for (let i = 0; i < totalSupply.toNumber(); i++) {
        const tokenId = await nftContract.tokenByIndex(i);
        const tokenIdNum = tokenId.toNumber();
        const tokenURI = await nftContract.tokenURI(tokenIdNum);
        const creator = await nftContract.creatorOf(tokenIdNum);
        const price = await nftContract.priceOf(tokenIdNum);
        const tokenAllocation = await nftContract.tokenAllocationOf(tokenIdNum);

        // Fetch metadata from IPFS
        const response = await fetch(tokenURI.replace('ipfs://', process.env.VITE_IPFS_GATEWAY_URL || ''));
        const metadata = await response.json();

        fetchedNFTs.push({
          id: tokenIdNum,
          title: metadata.name,
          description: metadata.description,
          image: metadata.image.replace('ipfs://', process.env.VITE_IPFS_GATEWAY_URL || ''),
          price: price.toNumber(),
          tokenAllocation: tokenAllocation.toNumber(),
          creator
        });
      }

      setNfts(fetchedNFTs);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
    } finally {
      setLoading(false);
    }
  }, [nftContract]);

  useEffect(() => {
    if (nftContract) {
      fetchNFTs();
    }
  }, [nftContract, fetchNFTs]);

  const filteredAndSortedNFTs = () => {
    let filtered = [...nfts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(nft =>
        nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by creator
    if (showOnlyMine && account) {
      filtered = filtered.filter(nft =>
        nft.creator.toLowerCase() === account.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'tokens':
        filtered.sort((a, b) => b.tokenAllocation - a.tokenAllocation);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchNFTs}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'price' | 'tokens')}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="recent">Most Recent</option>
            <option value="price">Highest Price</option>
            <option value="tokens">Most Tokens</option>
          </select>

          <button
            onClick={() => setShowOnlyMine(!showOnlyMine)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              showOnlyMine
                ? 'bg-purple-500 border-purple-400'
                : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
            }`}
          >
            <Filter className="h-5 w-5" />
            My NFTs
          </button>
        </div>
      </div>

      {/* NFT Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading NFTs...</p>
        </div>
      ) : filteredAndSortedNFTs().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNFTs().map(nft => (
            <Link
              key={nft.id}
              to={`/project/${nft.id}`}
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
        <div className="text-center py-12">
          <p className="text-gray-400">No NFTs found</p>
        </div>
      )}
    </div>
  );
};

export default Gallery; 