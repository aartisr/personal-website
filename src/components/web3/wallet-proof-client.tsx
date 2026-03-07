"use client";

import { useEffect, useMemo, useState } from "react";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

function shortAddress(address: string) {
  if (!address) {
    return "";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletProofClient() {
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [signature, setSignature] = useState("");
  const [signedAt, setSignedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providerAvailable, setProviderAvailable] = useState(false);

  const checkProviderAvailability = () => {
    if (typeof window === "undefined") {
      return;
    }

    setProviderAvailable(!!window.ethereum);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    checkProviderAvailability();

    const timer = window.setTimeout(checkProviderAvailability, 1200);

    window.addEventListener("focus", checkProviderAvailability);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", checkProviderAvailability);
    };
  }, []);

  const verificationState = useMemo(() => {
    if (walletAddress && signature) {
      return "verified";
    }

    if (walletAddress) {
      return "connected";
    }

    return "disconnected";
  }, [signature, walletAddress]);

  const handleConnect = async () => {
    if (!window.ethereum) {
      setError("No wallet detected. Install MetaMask or another EVM wallet.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      const currentChain = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;

      if (!accounts || accounts.length === 0) {
        setError("Wallet connected but no account was returned.");
        return;
      }

      setWalletAddress(accounts[0]);
      setChainId(currentChain);
    } catch (connectError) {
      setError(
        connectError instanceof Error
          ? connectError.message
          : "Failed to connect wallet."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignProof = async () => {
    if (!window.ethereum || !walletAddress) {
      setError("Connect wallet first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const issuedAt = new Date().toISOString();
      const message = [
        "Aarti Sri Ravikumar Portfolio — Web3 Verification Proof",
        `Wallet: ${walletAddress}`,
        `Issued At: ${issuedAt}`,
        "Purpose: Public proof of wallet control for profile authenticity.",
      ].join("\n");

      const signed = (await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      })) as string;

      setSignature(signed);
      setSignedAt(issuedAt);
    } catch (signError) {
      setError(
        signError instanceof Error
          ? signError.message
          : "Failed to sign verification message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="rounded-xl border p-6 md:p-8"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <h2 className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
        Wallet Verification
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
        Connect an EVM wallet and sign a message to produce a public ownership proof.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleConnect}
          disabled={loading || !providerAvailable}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            opacity: loading || !providerAvailable ? 0.6 : 1,
          }}
        >
          {walletAddress ? "Wallet Connected" : "Connect Wallet"}
        </button>

        <button
          type="button"
          onClick={handleSignProof}
          disabled={loading || !walletAddress}
          className="rounded-full px-4 py-2 text-sm font-semibold border"
          style={{
            borderColor: "var(--border)",
            color: "var(--foreground)",
            opacity: loading || !walletAddress ? 0.6 : 1,
          }}
        >
          Sign Verification Proof
        </button>
      </div>

      {!providerAvailable && (
        <div
          className="mt-4 rounded-lg border p-4 text-sm"
          style={{ borderColor: "var(--border)", background: "var(--muted)" }}
        >
          <p className="font-medium" style={{ color: "var(--foreground)" }}>
            No wallet provider detected in this browser profile.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5" style={{ color: "var(--muted-foreground)" }}>
            <li>Open this page in the same browser profile where your wallet extension is installed.</li>
            <li>Unlock the wallet extension, then return to this tab and click anywhere in the page.</li>
            <li>Disable other wallet extensions temporarily and retry.</li>
            <li>
              If needed, install MetaMask from{" "}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--primary)" }}
              >
                metamask.io/download
              </a>
              .
            </li>
          </ul>
          <button
            type="button"
            onClick={checkProviderAvailability}
            className="mt-3 rounded-full border px-3 py-1.5 text-xs font-semibold"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Re-check wallet
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm" style={{ color: "var(--destructive)" }}>
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-3 text-sm">
        <div>
          <span style={{ color: "var(--muted-foreground)" }}>Status: </span>
          <span style={{ color: "var(--foreground)", fontWeight: 600 }}>
            {verificationState === "verified"
              ? "Verified"
              : verificationState === "connected"
              ? "Connected"
              : "Disconnected"}
          </span>
        </div>

        {walletAddress && (
          <div>
            <span style={{ color: "var(--muted-foreground)" }}>Address: </span>
            <code style={{ color: "var(--foreground)" }}>{shortAddress(walletAddress)}</code>
          </div>
        )}

        {chainId && (
          <div>
            <span style={{ color: "var(--muted-foreground)" }}>Chain ID: </span>
            <code style={{ color: "var(--foreground)" }}>{chainId}</code>
          </div>
        )}

        {signature && (
          <div>
            <span style={{ color: "var(--muted-foreground)" }}>Signature: </span>
            <code style={{ color: "var(--foreground)" }}>{`${signature.slice(0, 14)}...${signature.slice(-10)}`}</code>
          </div>
        )}

        {signedAt && (
          <div>
            <span style={{ color: "var(--muted-foreground)" }}>Signed At: </span>
            <span style={{ color: "var(--foreground)" }}>{new Date(signedAt).toLocaleString()}</span>
          </div>
        )}
      </div>
    </section>
  );
}
