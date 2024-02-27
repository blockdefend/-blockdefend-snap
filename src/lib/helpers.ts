/** @notice Imports */
import { API_KEYS } from "../constants";

/// Returns if chainId available for simulation.
export const isChainIdAvailableForSimulation = ({
  chainId,
}: GetApiUrlByChainIdParams) => getApiUrlByChainId({ chainId }) !== undefined;

/// Returns the URL as per chain id.
export const getApiUrlByChainId = ({ chainId }: GetApiUrlByChainIdParams) =>
  API_KEYS.find((apiKey) => apiKey.chainId === chainId)?.api;

/// Simulate the transaction
export const simulateTransaction = ({
  from,
  to,
  value,
  data,
  chainId,
}: SimulateTransactionParams): Promise<SimulateTransactionResponse> => {
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_simulateAssetChanges",
      params: [
        {
          from,
          to,
          value,
          data,
        },
      ],
    }),
  };

  return new Promise((resolve, reject) => {
    const apiURL = getApiUrlByChainId({ chainId });
    fetch(apiURL!, options)
      .then((response) => response.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
