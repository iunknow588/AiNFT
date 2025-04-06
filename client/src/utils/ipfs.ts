import { create } from 'ipfs-http-client';
import Arweave from 'arweave';
import { Configuration, OpenAIApi } from 'openai';

// IPFS 客户端配置
const ipfs = create({ url: process.env.VITE_IPFS_API_URL });

// Arweave 客户端配置
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// OpenAI 配置
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.VITE_OPENAI_API_KEY
}));

export const generateHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const uploadToIPFS = async (content: File | string): Promise<string> => {
  const result = await ipfs.add(content);
  return result.path;
};

export const uploadToArweave = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const transaction = await arweave.createTransaction({ data: buffer });
  await arweave.transactions.sign(transaction);
  await arweave.transactions.post(transaction);
  return transaction.id;
};

export const analyzeProjectVision = async (vision: string): Promise<number> => {
  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt: `Analyze the following project vision and return a similarity score (0-100) compared to existing projects:\n\n${vision}`,
    max_tokens: 100
  });
  
  const similarityScore = parseInt(response.data.choices[0].text || '0');
  return similarityScore;
};

export const checkDuplicateHash = async (hash: string): Promise<boolean> => {
  // 这里需要实现检查逻辑，可以是检查链上记录或数据库
  return false;
};