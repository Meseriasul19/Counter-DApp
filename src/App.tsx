import { useState, useEffect } from "react";
import { WalletKitProvider, ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import "./index.css";

const PACKAGE_ID = "0x8943ac4651cd4818dfa9ec976a1fa496e6ebe4a80bab3c0bcd5b383eac71a4cd";
const client = new SuiClient({ url: "https://fullnode.testnet.sui.io" });

function DApp() {
  const { currentAccount, signAndExecuteTransactionBlock } = useWalletKit();
  const [counterId, setCounterId] = useState<string | null>(null);
  const [counterValue, setCounterValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserCounter = async () => {
    if (!currentAccount) return;

    try {
      const objects = await client.getOwnedObjects({
        owner: currentAccount.address,
        options: { showType: true },
      });

      const found = objects.data.find((obj) =>
        obj.data?.type?.includes(`${PACKAGE_ID}::counter::Counter`)
      
      );

      if (found) {
        setCounterId(found.data?.objectId || null);
      } else {
        setCounterId(null);
      }
    } catch (err) {
      console.error("Eroare la verificarea counterului:", err);
    }
  };

  const fetchCounterValue = async () => {
    if (!counterId) return;

    try {
      const response = await client.getObject({
        id: counterId,
        options: { showContent: true },
      });

      let value: number | string | undefined;
      const content = response.data?.content;
      if (content && content.dataType === "moveObject" && "fields" in content) {
        value = (response.data?.content as any)?.fields?.value
      }
      setCounterValue(
        typeof value === "string"
          ? parseInt(value)
          : typeof value === "number"
          ? value
          : null
      );
    } catch (error) {
      console.error("Eroare la citirea counterului:", error);
    }
  };

  const createCounter = async () => {
    if (!currentAccount) return;

    setLoading(true);
    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::counter::create`,
        arguments: [],
      });

      const result = await signAndExecuteTransactionBlock({ transactionBlock: tx as unknown as any });
      console.log("Counter creat:", result);

      await fetchUserCounter(); 
    } catch (error) {
      console.error("Eroare la crearea counterului:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const incrementCounter = async () => {
    if (!counterId) return;

    setLoading(true);
    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${PACKAGE_ID}::counter::increment`,
        arguments: [tx.object(counterId)],
      });

      await signAndExecuteTransactionBlock({ transactionBlock: tx as unknown as any });
      await fetchCounterValue();
    } catch (error) {
      console.error("Eroare la incrementare:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount) fetchUserCounter();
  }, [currentAccount]);


  useEffect(() => {
    if (counterId) fetchCounterValue();
  }, [counterId]);

  return (
    <div className="container">
      <h1 className="title">Sui Counter DApp</h1>
      <ConnectButton />

      {currentAccount ? (
        <>

          {counterId ? (
            <>
              <p className="value">Value: {counterValue ?? "..."}</p>
              <button onClick={incrementCounter} disabled={loading}>
                {loading ? "Incrementing..." : "Increment"}
              </button>
            </>
          ) : (
            <button onClick={createCounter} disabled={loading}>
              {loading ? "Creating..." : "Create Counter"}
            </button>
          )}
        </>
      ) : (
        <p>Connect your Wallet to start</p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WalletKitProvider>
      <DApp />
    </WalletKitProvider>
  );
}
