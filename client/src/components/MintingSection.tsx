import { type FC, useState } from 'react';
import { Upload, Check, AlertCircle, Loader } from 'lucide-react';
import { generateHash, simulateIPFSUpload, simulateArweaveStorage } from '../utils/crypto';
import { analyzeProjectVision, generatePromotionStrategy } from '../utils/ai';
import { type MintingData } from '../types/nft';

const MintingSection: FC = () => {
  const [mintingData, setMintingData] = useState<MintingData>({
    file: null,
    projectName: '',
    description: '',
    tokenValue: '',
    agreesToTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [promotionTips, setPromotionTips] = useState<string[]>([]);

  const handleMint = async () => {
    if (!mintingData.file || !mintingData.projectName || !mintingData.description || !mintingData.tokenValue || !mintingData.agreesToTerms) {
      setFeedback('Please fill in all required fields and accept the terms.');
      return;
    }

    setLoading(true);
    setFeedback('Processing your NFT...');

    try {
      // Generate hash and simulate storage
      const fileHash = generateHash(mintingData.file.name + Date.now());
      const ipfsUrl = await simulateIPFSUpload(mintingData.file);
      const arweaveUrl = await simulateArweaveStorage(fileHash);

      // Store URLs for later use
      console.log('IPFS URL:', ipfsUrl);
      console.log('Arweave URL:', arweaveUrl);

      // AI Analysis
      const visionAnalysis = await analyzeProjectVision(mintingData.description);
      if (visionAnalysis.similarity >= 30) {
        setFeedback('Project vision appears too similar to existing projects. Please revise.');
        setLoading(false);
        return;
      }

      // Generate promotion strategy
      const strategy = await generatePromotionStrategy({
        name: mintingData.projectName,
        description: mintingData.description
      });
      setPromotionTips(strategy);

      setFeedback('NFT successfully minted! Check your promotion strategy below.');
    } catch (error) {
      setFeedback('Error during minting process. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-gray-800/30 p-8 rounded-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-8 text-center">Create Your NFT</h2>

      <form onSubmit={handleMint} className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => setMintingData({
              ...mintingData,
              file: e.target.files?.[0] || null
            })}
            accept="image/*,video/*,audio/*"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <span className="text-gray-300">
              {mintingData.file ? mintingData.file.name : 'Upload your IP content'}
            </span>
          </label>
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={mintingData.projectName}
              onChange={(e) => setMintingData({
                ...mintingData,
                projectName: e.target.value
              })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Vision
            </label>
            <textarea
              value={mintingData.description}
              onChange={(e) => setMintingData({
                ...mintingData,
                description: e.target.value
              })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white h-32"
              placeholder="Describe your project's vision and purpose"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Token Value
            </label>
            <input
              type="number"
              value={mintingData.tokenValue}
              onChange={(e) => setMintingData({
                ...mintingData,
                tokenValue: e.target.value
              })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
              placeholder="Enter token value"
              min="0"
            />
          </div>
        </div>

        {/* Rights Agreement */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="rights"
            checked={mintingData.agreesToTerms}
            onChange={(e) => setMintingData({
              ...mintingData,
              agreesToTerms: e.target.checked
            })}
            className="mt-1"
          />
          <label htmlFor="rights" className="text-sm text-gray-300">
            I confirm that I own or have the rights to use this IP content and agree to the platform's terms and conditions
          </label>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`p-4 rounded-lg ${loading ? 'bg-blue-900/20' : feedback.includes('error') ? 'bg-red-900/20' : 'bg-green-900/20'}`}>
            <div className="flex items-center space-x-2">
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : feedback.includes('error') ? (
                <AlertCircle className="h-5 w-5 text-red-400" />
              ) : (
                <Check className="h-5 w-5 text-green-400" />
              )}
              <span className="text-sm">{feedback}</span>
            </div>
          </div>
        )}

        {/* Promotion Tips */}
        {promotionTips.length > 0 && (
          <div className="bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">AI-Generated Promotion Strategy:</h4>
            <ul className="list-disc list-inside space-y-1">
              {promotionTips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-300">{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mint Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Mint NFT'}
        </button>
      </form>
    </section>
  );
};

export default MintingSection;
