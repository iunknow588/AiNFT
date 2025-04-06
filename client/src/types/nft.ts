export interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tokenValue: number;
  owner: string;
  createdAt: string;
  hash: string;
}

export interface MintingData {
  file: File | null;
  projectName: string;
  description: string;
  tokenValue: string;
  agreesToTerms: boolean;
}