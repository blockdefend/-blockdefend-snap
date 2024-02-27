/// Alchemy API key
const ALCHEMY_API_KEY = "HFfTkrHsBdeK5kxkn1tJzwp_gvAI_zkx";

/// All the API keys
export const API_KEYS: TApiKeys[] = [
  /// Ethereum Mainnet
  {
    chainId: "eip155:1",
    api: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  },

  /// Ethereum Sepolia
  {
    chainId: "eip155:aa36a7",
    api: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  },
];
