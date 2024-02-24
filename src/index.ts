/** @notice Imports */
import type {
  OnTransactionHandler,
  OnInstallHandler,
} from "@metamask/snaps-sdk";
import { heading, panel, text } from "@metamask/snaps-sdk";

/// OnInstallHandler
export const onInstall: OnInstallHandler = async () => {
  await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: panel([
        heading("Thank you for installing BlockDefend."),
        text(
          "Blockdefend AI proactively protects you from malicious smart contracts and phishing websites."
        ),
        text(
          "To use this Snap, visit the companion dapp at [BlockDefend](https://blockdefend.vercel.app/)."
        ),
      ]),
    },
  });
};

/// OnTransactionHandler
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  const insights = [
    {
      value: "Hello from BlockDefend!",
    },
  ];

  return {
    content: panel([
      heading("Transaction Insights!"),
      text("Here are the insights:"),
      ...insights.map((insight) => text(insight.value)),
    ]),
  };
};
