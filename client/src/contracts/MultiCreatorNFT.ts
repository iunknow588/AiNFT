export const MultiCreatorNFTABI = [
  // 基础 NFT 功能
  "function mint(string ipfsHash, string arweaveHash, uint256 price, uint256[] creatorShares) returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  
  // 多人共创功能
  "function getCreators(uint256 tokenId) view returns (address[])",
  "function getCreatorShares(uint256 tokenId) view returns (uint256[])",
  "function addCreator(uint256 tokenId, address creator, uint256 share)",
  "function removeCreator(uint256 tokenId, address creator)",
  
  // IP 权利管理
  "function setRightsDeclaration(uint256 tokenId, string declaration)",
  "function getRightsDeclaration(uint256 tokenId) view returns (string)",
  
  // 治理接口预留
  "function governanceInterface() view returns (address)",
  
  // 事件
  "event NFTMinted(uint256 indexed tokenId, address[] creators, uint256[] shares)",
  "event CreatorAdded(uint256 indexed tokenId, address creator, uint256 share)",
  "event CreatorRemoved(uint256 indexed tokenId, address creator)"
];