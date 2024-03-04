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

type GetNativeSecurityOverviewResponse = {
  code: number;
  result: {
    cybercrime: "0" | "1";
    money_laundering: "0" | "1";
    financial_crime: "0" | "1";
    darkweb_transactions: "0" | "1";
    phishing_activities: "0" | "1";
    fake_kyc: "0" | "1";
    blacklist_doubt: "0" | "1";
    stealing_attack: "0" | "1";
    blackmail_activities: "0" | "1";
    sanctioned: "0" | "1";
    malicious_mining_activities: "0" | "1";
    honeypot_related_address: "0" | "1";
  };
};
