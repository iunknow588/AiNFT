import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import NFTContractABI from '../contracts/NFTContractABI';
import { NFT_CONTRACT_ADDRESS } from '../constants';
import { BigNumber } from 'ethers';

export function useNFTContract() {
  const { provider, account } = useWeb3React();

  if (!provider || !NFT_CONTRACT_ADDRESS || !account) {
    console.log('Missing dependencies:', {
      hasProvider: !!provider,
      hasAddress: !!NFT_CONTRACT_ADDRESS,
      hasAccount: !!account
    });
    return null;
  }

  try {
    const signer = provider.getSigner();
    const contract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFTContractABI,
      signer
    );

    console.log('Contract initialized:', {
      address: contract.address,
      hasABI: !!NFTContractABI,
      signer: account
    });

    return contract as NFTContract;
  } catch (error) {
    console.error('Contract initialization error:', error);
    return null;
  }
}

// Contract interface for TypeScript
export interface NFTContract extends Contract {
  totalSupply: () => Promise<BigNumber>;
  tokenByIndex: (index: number) => Promise<BigNumber>;
  tokenOfOwnerByIndex: (owner: string, index: number) => Promise<BigNumber>;
  tokenURI: (tokenId: number) => Promise<string>;
  ownerOf: (tokenId: number) => Promise<string>;
  balanceOf: (owner: string) => Promise<BigNumber>;
  creatorOf: (tokenId: number) => Promise<string>;
  priceOf: (tokenId: number) => Promise<BigNumber>;
  tokenAllocationOf: (tokenId: number) => Promise<BigNumber>;
  createdAt: (tokenId: number) => Promise<BigNumber>;
  mint: (to: string, tokenURI: string, price: number, tokenAllocation: number) => Promise<ContractTransaction>;
}
