/** @notice Imports */
import type {
  OnTransactionHandler,
  OnInstallHandler,
  Component,
} from "@metamask/snaps-sdk";
import { heading, panel, text, divider, copyable } from "@metamask/snaps-sdk";
import {
  getNativeSecurityOverview,
  isChainIdAvailableForSimulation,
  simulateTransaction,
} from "./lib/helpers";
import { formatEther } from "viem";

/**
 * @notice Runs after successfully installed.
 */
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

/**
 * @notice Runs on every transaction.
 */
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  /// Checking if chainId available.
  const isAvailable = isChainIdAvailableForSimulation({ chainId });

  /// If No simulation available for the chain Id.
  if (!isAvailable) {
    return {
      content: panel([
        heading("⚠️ Caution ⚠️"),
        heading("We are not currently providing simulation on this network."),
        text(
          "Transaction simulation may lead to unforeseen consequences and hinder comprehensive risk assessment."
        ),
      ]),
    };
  }

  try {
    /// If simulation available for the chain Id.
    const { result: simulationResult, error: simulationError } =
      await simulateTransaction({
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        data: transaction.data,
        chainId,
      });

    const insights: Component[] = [
      heading("🔎 Transaction Insights!"),
      divider(),
    ];

    /// Go security
    let securityResult: Component[] = [];
    if (chainId === "eip155:1") {
      try {
        securityResult = await getNativeSecurityOverview(transaction.to);
      } catch (error) {}
    }

    /// If any revert occurred!.
    if (simulationError) {
      insights.push(
        heading(`❌ Transaction failed!`),
        text(simulationError.message)
      );
      if (simulationError.revertReason)
        insights.push(text(simulationError.revertReason));

      return {
        content: panel([...insights, ...securityResult]),
      };
    }

    if (simulationResult.error) {
      insights.push(
        heading(`❌ Transaction failed!`),
        text(simulationResult.error.message)
      );
      if (simulationResult.error.revertReason)
        insights.push(text(simulationResult.error.revertReason));

      return {
        content: panel([...insights, ...securityResult]),
      };
    }

    if (simulationResult.changes.length === 0) {
      insights.push(
        heading(`🧾 Contract Interaction!`),
        text(`Contract: ${transaction.to}`),
        text(`Amount: ${formatEther(BigInt(transaction.value))}`),
        divider(),
        text("Hex Data"),
        copyable(transaction.data)
      );

      return {
        content: panel([...insights, ...securityResult]),
      };
    }

    simulationResult.changes.forEach((change) => {
      /// If tx is for approval.
      if (change.changeType === "APPROVE") {
        insights.push(
          heading(`🧾 Approving ${change.symbol}`),
          text(`You are approving ${change.amount} ${change.symbol}.`),
          text(`Spender: ${change.to}`),
          text(`Contract: ${change.contractAddress}`),
          text(`Amount: ${change.amount} ${change.symbol} `)
        );
      }
      /// If tx is for transfer.
      else {
        /// If transferring native coin.
        if (change.assetType === "NATIVE") {
          insights.push(
            heading(`💰 Transferring ${change.symbol}`),
            text(`You are transferring ${change.amount} ${change.symbol}.`),
            text(`Receiver: ${change.to}`),
            text(`Amount: ${change.amount} ${change.symbol} `)
          );
        }
        /// If transferring others.
        else {
          insights.push(
            heading(`💰 Transferring ${change.symbol}`),
            text(`You are transferring ${change.amount} ${change.symbol}.`),
            text(`Receiver: ${change.to}`),
            text(`Contract: ${change.contractAddress || ""}`),
            text(`Amount: ${change.amount} ${change.symbol} `)
          );
        }
      }

      /// Divide
      if (simulationResult.changes.length > 1) insights.push(divider());
    });

    return {
      content: panel([...insights, ...securityResult]),
    };
  } catch (error) {
    return {
      content: panel([
        heading("⚠️ Caution ⚠️"),
        text(
          "Failure to provide Ethereum contract transaction simulation may lead to unforeseen consequences and hinder comprehensive risk assessment."
        ),
      ]),
    };
  }
};
