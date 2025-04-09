import * as fcl from "@onflow/fcl";

const network = import.meta.env.VITE_FLOW_NETWORK || "testnet";
const isTestnet = network === "testnet";

fcl
  .config()
  .put("app.detail.title", "NFT Platform")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")
  // 添加 WalletConnect projectId
  .put("walletConnect.projectId", import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID)
  .put("accessNode.api", import.meta.env.VITE_FLOW_ENDPOINT_URL || (isTestnet ? "https://rest-testnet.onflow.org" : "https://rest-mainnet.onflow.org"))
  .put("discovery.wallet", import.meta.env.VITE_FLOW_WALLET_DISCOVERY || (isTestnet ? "https://fcl-discovery.onflow.org/testnet/authn" : "https://fcl-discovery.onflow.org/authn"))
  .put("0xFungibleToken", import.meta.env.VITE_FLOW_FUNGIBLE_TOKEN_ADDRESS || (isTestnet ? "0x9a0766d93b6608b7" : "0xf233dcee88fe0abe"))
  .put("flow.network", network);

// 添加配置验证
if (!import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
  console.warn(
    "WalletConnect projectId not found. Some wallets may not work. Visit https://cloud.walletconnect.com/ to get one."
  );
}
