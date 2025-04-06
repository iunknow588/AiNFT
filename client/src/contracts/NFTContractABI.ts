import { Fragment } from '@ethersproject/abi';

export const NFTContractABI: Array<string | Fragment> = [
  // View Functions
  "function totalSupply() view returns (uint256)",
  "function tokenByIndex(uint256 index) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function creatorOf(uint256 tokenId) view returns (address)",
  "function priceOf(uint256 tokenId) view returns (uint256)",
  "function tokenAllocationOf(uint256 tokenId) view returns (uint256)",
  "function createdAt(uint256 tokenId) view returns (uint256)",
  // Write Functions
  "function mint(address to, string memory tokenURI, uint256 price, uint256 tokenAllocation) returns (uint256)"
];

export default NFTContractABI; 