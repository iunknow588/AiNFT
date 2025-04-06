import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useNFTContract } from '../../hooks/useNFTContract';
import { analyzeProjectVision, generateHash, uploadToIPFS, uploadToArweave, checkDuplicateHash } from '../../utils/ipfs';
import { ethers } from 'ethers';

interface Creator {
  address: string;
  share: number;
}

interface MintingData {
  file: File | null;
  title: string;
  description: string;
  vision: string;
  rightsDeclaration: string;
  creators: Creator[];
  price: string;
}

const MultiCreatorMint = () => {
  const { account } = useWeb3React();
  const nftContract = useNFTContract();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [mintingData, setMintingData] = useState<MintingData>({
    file: null,
    title: '',
    description: '',
    vision: '',
    rightsDeclaration: '',
    creators: [{ address: account || '', share: 100 }],
    price: ''
  });

  const validateContent = async (file: File) => {
    // 文件去重检测
    const fileHash = await generateHash(file);
    const isDuplicate = await checkDuplicateHash(fileHash);
    if (isDuplicate) {
      throw new Error('Duplicate content detected');
    }
    return fileHash;
  };

  const validateVision = async (vision: string) => {
    // 项目愿景相似度检测
    const similarity = await analyzeProjectVision(vision);
    if (similarity >= 30) {
      throw new Error('Vision similarity too high (>= 30%)');
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !nftContract || !mintingData.file) return;

    try {
      setLoading(true);
      setError('');

      // 1. 内容验证
      await validateContent(mintingData.file);
      await validateVision(mintingData.vision);

      // 2. 上传到 IPFS 和 Arweave
      const ipfsHash = await uploadToIPFS(mintingData.file);
      const arweaveHash = await uploadToArweave(mintingData.file);

      // 3. 创建元数据
      const metadata = {
        name: mintingData.title,
        description: mintingData.description,
        vision: mintingData.vision,
        rightsDeclaration: mintingData.rightsDeclaration,
        image: `ipfs://${ipfsHash}`,
        arweaveBackup: `ar://${arweaveHash}`,
        creators: mintingData.creators
      };

      // 4. 上传元数据
      const metadataIpfsHash = await uploadToIPFS(JSON.stringify(metadata));

      // 5. 铸造 NFT
      const creatorAddresses = mintingData.creators.map(c => c.address);
      const creatorShares = mintingData.creators.map(c => c.share);

      //下面的代码需要修改................
    /*
      const tx = await nftContract.mint(
        metadataIpfsHash,
        arweaveHash,
        Number(ethers.utils.parseEther(mintingData.price)),
        creatorAddresses.map(addr => ethers.utils.getAddress(addr))
      );

      await tx.wait();
      */

      // 重置表单
      setMintingData({
        file: null,
        title: '',
        description: '',
        vision: '',
        rightsDeclaration: '',
        creators: [{ address: account, share: 100 }],
        price: ''
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Multi-Creator NFT</h1>

      <form onSubmit={handleMint} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium">IP Content</label>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setMintingData(prev => ({ ...prev, file }));
              }
            }}
          />
        </div>

        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={mintingData.title}
            onChange={(e) => setMintingData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Project Vision */}
        <div>
          <label className="block text-sm font-medium">Project Vision</label>
          <textarea
            value={mintingData.vision}
            onChange={(e) => setMintingData(prev => ({ ...prev, vision: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={4}
          />
        </div>

        {/* Rights Declaration */}
        <div>
          <label className="block text-sm font-medium">Rights Declaration</label>
          <textarea
            value={mintingData.rightsDeclaration}
            onChange={(e) => setMintingData(prev => ({ ...prev, rightsDeclaration: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={4}
          />
        </div>

        {/* Creators */}
        <div>
          <label className="block text-sm font-medium">Creators</label>
          {mintingData.creators.map((creator, index) => (
            <div key={index} className="flex gap-4 mt-2">
              <input
                type="text"
                value={creator.address}
                onChange={(e) => {
                  const newCreators = [...mintingData.creators];
                  newCreators[index].address = e.target.value;
                  setMintingData(prev => ({ ...prev, creators: newCreators }));
                }}
                placeholder="Creator address"
                className="flex-1"
              />
              <input
                type="number"
                value={creator.share}
                onChange={(e) => {
                  const newCreators = [...mintingData.creators];
                  newCreators[index].share = parseInt(e.target.value);
                  setMintingData(prev => ({ ...prev, creators: newCreators }));
                }}
                placeholder="Share %"
                className="w-24"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMintingData(prev => ({
              ...prev,
              creators: [...prev.creators, { address: '', share: 0 }]
            }))}
            className="mt-2 text-blue-600"
          >
            Add Creator
          </button>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium">Price (ETH)</label>
          <input
            type="number"
            value={mintingData.price}
            onChange={(e) => setMintingData(prev => ({ ...prev, price: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            step="0.001"
          />
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>
    </div>
  );
};

export default MultiCreatorMint;
