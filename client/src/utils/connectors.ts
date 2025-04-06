import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 5, 137, 80001] // Mainnet, Goerli, Polygon, Mumbai
}); 