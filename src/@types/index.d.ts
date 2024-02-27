type TApiKeys = {
  chainId: string;
  api: string;
};

type GetApiUrlByChainIdParams = { chainId: string };

type SimulateTransactionParams = {
  from: string;
  to: string;
  value: string;
  data: string;
  chainId: string;
};

type AssetType = "ERC20" | "NATIVE" | "ERC721" | "ERC1155" | "SPECIAL_NFT";

type SimulateTransactionResponse = {
  result: {
    changes: {
      assetType: AssetType;
      changeType: "TRANSFER" | "APPROVE";
      from: string;
      to: string;
      rawAmount: string;
      contractAddress: string | null;
      decimals: number | null;
      symbol: string;
      name: string;
      logo: string | null;
      amount: string;
    }[];
    error: {
      message: string;
      revertReason: string | null;
    } | null;
  };
  error: {
    message: string;
    revertReason: string | null;
  } | null;
};
