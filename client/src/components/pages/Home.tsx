import { Link } from 'react-router-dom';
import { Shield, Zap, Code, Coins } from 'lucide-react';
import FeaturedNFTs from '../sections/FeaturedNFTs';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        Welcome to NFT Platform
      </h1>
      <p className="text-xl text-gray-300 mb-12">
        Discover, create, and trade unique digital assets on our platform
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Link
          to="/mint"
          className="bg-purple-500 hover:bg-purple-600 p-8 rounded-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-4">Create NFT</h2>
          <p className="text-gray-200">Mint your own unique digital assets</p>
        </Link>

        <Link
          to="/gallery"
          className="bg-pink-500 hover:bg-pink-600 p-8 rounded-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-4">Explore Gallery</h2>
          <p className="text-gray-200">Browse and collect amazing NFTs</p>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <Shield className="h-12 w-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Verification</h3>
          <p className="text-gray-300">
            Advanced AI-powered content verification ensures authenticity and protects intellectual property.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <Zap className="h-12 w-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">One-Click Minting</h3>
          <p className="text-gray-300">
            Streamlined process for creating and deploying NFTs with automated metadata generation.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <Code className="h-12 w-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Contracts</h3>
          <p className="text-gray-300">
            Customizable smart contracts with built-in royalties and transfer mechanisms.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <Coins className="h-12 w-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Token Management</h3>
          <p className="text-gray-300">
            Flexible token allocation and management system for creators and collectors.
          </p>
        </div>
      </div>

      {/* Token Integration */}
      <section className="mb-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Integrated Token System</h2>
            <p className="text-gray-300 mb-6">
              Each NFT is backed by our native token system, providing real value and utility. Define token allocations
              during minting and enable seamless trading within the ecosystem.
            </p>
            <div className="flex items-center space-x-2 text-purple-400">
              <Coins className="h-5 w-5" />
              <span>Automated token grading and distribution</span>
            </div>
          </div>
          <div className="hidden lg:block">
            {/* Add token visualization or stats here */}
          </div>
        </div>
      </section>

      {/* Featured NFTs Section */}
      <FeaturedNFTs />
    </div>
  );
};

export default Home;
