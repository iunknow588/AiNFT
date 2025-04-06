import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useNFTContract } from '../../hooks/useNFTContract';

interface FormData {
  title: string;
  description: string;
  price: string;
  tokenAllocation: string;
  file: File | null;
  previewUrl: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

const Mint = () => {
  const { account } = useWeb3React();
  const nftContract = useNFTContract();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    tokenAllocation: '',
    file: null,
    previewUrl: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !nftContract) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Upload image to IPFS
      const imageUrl = await uploadToIPFS(formData.file!);

      // Create metadata
      const metadata = {
        name: formData.title,
        description: formData.description,
        image: imageUrl
      };

      // Upload metadata to IPFS
      const metadataUrl = await uploadMetadataToIPFS(metadata);

      // Mint NFT
      const tx = await nftContract.mint(
        account,
        metadataUrl,
        parseFloat(formData.price),
        parseInt(formData.tokenAllocation)
      );

      await tx.wait();

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        tokenAllocation: '',
        file: null,
        previewUrl: ''
      });

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setLoading(false);
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    if (!process.env.VITE_IPFS_API_URL || !process.env.VITE_IPFS_API_KEY) {
      throw new Error('IPFS configuration is missing');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(process.env.VITE_IPFS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_IPFS_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to IPFS');
    }

    const data = await response.json();
    return `ipfs://${data.Hash}`;
  };

  const uploadMetadataToIPFS = async (metadata: NFTMetadata): Promise<string> => {
    if (!process.env.VITE_IPFS_API_URL || !process.env.VITE_IPFS_API_KEY) {
      throw new Error('IPFS configuration is missing');
    }

    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(process.env.VITE_IPFS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_IPFS_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    const data = await response.json();
    return `ipfs://${data.Hash}`;
  };

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Please connect your wallet to mint NFTs</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New NFT</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">NFT Image</label>
            <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
              {formData.previewUrl ? (
                <div className="relative w-full">
                  <img
                    src={formData.previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, file: null, previewUrl: '' }))}
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">Drop your image here or click to browse</p>
                  <p className="text-gray-500 text-sm mt-2">Supported formats: PNG, JPG, GIF</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Token Allocation */}
            <div>
              <label className="block text-sm font-medium mb-2">Token Allocation</label>
              <input
                type="number"
                min="1"
                value={formData.tokenAllocation}
                onChange={(e) => setFormData({ ...formData, tokenAllocation: e.target.value })}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Minting...
              </span>
            ) : (
              'Create NFT'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Mint;
