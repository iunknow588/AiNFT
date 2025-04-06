import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';

interface NFT {
  id: string;
  title: string;
  creator: string;
  image: string;
  price: number;
  likes: number;
  tokenAllocation: number;
}

const sampleNFTs: NFT[] = [
  {
    id: '1',
    title: 'Cosmic Dreamscape',
    creator: '0x1234...5678',
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?auto=format&fit=crop&w=800&q=80',
    price: 0.5,
    likes: 128,
    tokenAllocation: 1000
  },
  {
    id: '2',
    title: 'Digital Renaissance',
    creator: '0x8765...4321',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    price: 1.2,
    likes: 256,
    tokenAllocation: 2000
  },
  {
    id: '3',
    title: 'Future Metropolis',
    creator: '0x9876...1234',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80',
    price: 0.8,
    likes: 192,
    tokenAllocation: 1500
  }
];

const FeaturedNFTs = () => {
  const [likedNFTs, setLikedNFTs] = useState<Set<string>>(new Set());

  const handleLike = (id: string) => {
    setLikedNFTs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured NFTs</h2>
        <Link to="/gallery" className="text-purple-400 hover:text-purple-300">
          View All
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {sampleNFTs.map(nft => (
          <div key={nft.id} className="bg-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="relative">
              <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-sm">{nft.tokenAllocation} Tokens</span>
              </div>
            </div>

            <div className="p-4">
              <Link to={`/project/${nft.id}`} className="block">
                <h3 className="text-xl font-semibold mb-2 hover:text-purple-400">
                  {nft.title}
                </h3>
              </Link>
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-400">
                  by <span className="text-purple-400">{nft.creator}</span>
                </div>
                <div className="text-sm font-semibold">
                  {nft.price} ETH
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleLike(nft.id)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-pink-500"
                >
                  <Heart
                    className={`h-5 w-5 ${likedNFTs.has(nft.id) ? 'fill-current text-pink-500' : ''}`}
                  />
                  <span>{nft.likes + (likedNFTs.has(nft.id) ? 1 : 0)}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-gray-400 hover:text-purple-400">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedNFTs; 