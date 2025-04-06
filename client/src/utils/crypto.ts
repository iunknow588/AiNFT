import SHA256 from 'crypto-js/sha256';

export const generateHash = (content: string): string => {
  return SHA256(content).toString();
};

export const simulateIPFSUpload = async (file: File): Promise<string> => {
  // Simulate IPFS upload with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `ipfs://${generateHash(file.name)}`;
};

export const simulateArweaveStorage = async (hash: string): Promise<string> => {
  // Simulate Arweave storage with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return `ar://${hash}`;
};