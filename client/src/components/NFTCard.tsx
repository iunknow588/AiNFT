import React from 'react';
import { Shield, Coins } from 'lucide-react';
import { NFT } from '../types/nft';

interface NFTCardProps {
  nft: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700">
      <img 
        src={nft.imageUrl} 
        alt={nft.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{nft.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{nft.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-purple-400" />
            <span>{nft.tokenValue} tokens</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span className="text-gray-400">Verified</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            Owner: {nft.owner}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Created: {new Date(nft.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;