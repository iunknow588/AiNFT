interface Window {
  ethereum?: {
    addListener(eventName: string, handler: (...args: any[]) => void): unknown;
    removeListener(eventName: string, handler: (...args: any[]) => void): unknown;
    isMetaMask?: boolean;
    request: (args: {
      method: string;
      params?: unknown[];
    }) => Promise<unknown>;
  };
}
