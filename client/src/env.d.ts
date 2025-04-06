/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NFT_CONTRACT_ADDRESS: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_NETWORK_NAME: string
  readonly VITE_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 