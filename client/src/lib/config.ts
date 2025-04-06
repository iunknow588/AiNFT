import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("app.detail.title", "ElizaOS Flow")
  .put("app.detail.icon", "https://placekitten.com/g/200/200")
  .put("accessNode.api", "https://rest-mainnet.onflow.org") // Mainnet: https://rest-mainnet.onflow.org
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/authn")
  .put("0xFungibleToken", "0xf233dcee88fe0abe")
