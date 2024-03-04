/** @notice Imports */
import type { Component } from "@metamask/snaps-sdk";
import { heading, text, divider } from "@metamask/snaps-sdk";
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

export const getNativeSecurityOverview = (
  address: string
): Promise<Component[]> =>
  new Promise((resolve, reject) =>
    fetch(
      `https://api.gopluslabs.io/api/v1/address_security/${address}?chain_id=1`
    )
      .then((response) => response.json())
      .then(({ result, code }: GetNativeSecurityOverviewResponse) => {
        if (code !== 1) reject("Not found");

        const insights: Component[] = [
          heading("🔎 Security Overview"),
          divider(),
          text(
            `Cyber Crime: ${!Boolean(Number(result.cybercrime)) ? "❌" : "✅"}`
          ),
          text(
            `Money Laundering: ${
              !Boolean(Number(result.money_laundering)) ? "❌" : "✅"
            }`
          ),
          text(
            `Financial Crime: ${
              !Boolean(Number(result.financial_crime)) ? "❌" : "✅"
            }`
          ),
          text(
            `Darkweb Transactions: ${
              !Boolean(Number(result.darkweb_transactions)) ? "❌" : "✅"
            }`
          ),
          text(
            `Phishing Activities: ${
              !Boolean(Number(result.phishing_activities)) ? "❌" : "✅"
            }`
          ),
          text(`Fake KYC: ${!Boolean(Number(result.fake_kyc)) ? "❌" : "✅"}`),
          text(
            `Blacklist: ${
              !Boolean(Number(result.blacklist_doubt)) ? "❌" : "✅"
            }`
          ),
          text(
            `Stealing Attack: ${
              !Boolean(Number(result.stealing_attack)) ? "❌" : "✅"
            }`
          ),
          text(
            `Blackmail Activities: ${
              !Boolean(Number(result.blackmail_activities)) ? "❌" : "✅"
            }`
          ),
          text(
            `Sanctioned: ${!Boolean(Number(result.sanctioned)) ? "❌" : "✅"}`
          ),
          text(
            `Malicious Mining Activities: ${
              !Boolean(Number(result.malicious_mining_activities)) ? "❌" : "✅"
            }`
          ),
          text(
            `Honeypot: ${
              !Boolean(Number(result.honeypot_related_address)) ? "❌" : "✅"
            }`
          ),
        ];
        resolve(insights);
      })
      .catch((err) => reject(err))
  );
