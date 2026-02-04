"use client";

import { useDhSet } from "@/hooks/useDiffieHellmanSetExchange";
import { usePrivateSetIntersection } from "@/hooks/usePrivateSetIntersection";
import { useState } from "react";

export default function PSITest() {
  const set1 = new Set(["alice", "bob", "charlie"]);
  const set2 = new Set(["bob", "oscar"]);
  const set3 = new Set(["greta", "donald", "oscar"]);

  const dh1 = useDhSet();
  const dh2 = useDhSet();
  const dh3 = useDhSet();
  const psi = usePrivateSetIntersection();

  const [results, setResults] = useState<{
    intersection12?: Set<string>;
    intersection13?: Set<string>;
    intersection23?: Set<string>;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleComputePSI12 = async () => {
    setLoading(true);
    // PSI between set1 and set2
    const set1Encoded = await dh1.encodeSet(set1);
    const set2Encoded = await dh2.encodeSet(set2);

    const set1DoubleExp = await dh1.exponentiateReceived(set2Encoded);
    const set2DoubleExp = await dh2.exponentiateReceived(set1Encoded);

    const intersection12 = await psi.computeIntersection(
      set1,
      dh1.secret,
      set2DoubleExp,
      set2Encoded,
    );

    setResults((prev) => ({ ...prev, intersection12 }));
    setLoading(false);
  };

  const handleComputePSI13 = async () => {
    setLoading(true);
    // PSI between set1 and set3
    const set1Encoded = await dh1.encodeSet(set1);
    const set3Encoded = await dh3.encodeSet(set3);

    const set1DoubleExp3 = await dh1.exponentiateReceived(set3Encoded);
    const set3DoubleExp1 = await dh3.exponentiateReceived(set1Encoded);

    const intersection13 = await psi.computeIntersection(
      set1,
      dh1.secret,
      set3DoubleExp1,
      set3Encoded,
    );

    setResults((prev) => ({ ...prev, intersection13 }));
    setLoading(false);
  };

  const handleComputePSI23 = async () => {
    setLoading(true);
    // PSI between set2 and set3
    const set2Encoded = await dh2.encodeSet(set2);
    const set3Encoded = await dh3.encodeSet(set3);

    const set2DoubleExp3 = await dh2.exponentiateReceived(set3Encoded);
    const set3DoubleExp2 = await dh3.exponentiateReceived(set2Encoded);

    const intersection23 = await psi.computeIntersection(
      set2,
      dh2.secret,
      set3DoubleExp2,
      set3Encoded,
    );

    setResults((prev) => ({ ...prev, intersection23 }));
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
        PSI Test Results
      </p>
      <p style={{ color: "white" }}>Set 1: {Array.from(set1).join(", ")}</p>
      <p style={{ color: "white" }}>Set 2: {Array.from(set2).join(", ")}</p>
      <p style={{ color: "white" }}>Set 3: {Array.from(set3).join(", ")}</p>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={handleComputePSI12}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Compute Set1 ∩ Set2
        </button>
        <button
          onClick={handleComputePSI13}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Compute Set1 ∩ Set3
        </button>
        <button
          onClick={handleComputePSI23}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007AFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Compute Set2 ∩ Set3
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p style={{ color: "lightgreen" }}>
          Set1 ∩ Set2:{" "}
          {results.intersection12
            ? Array.from(results.intersection12).join(", ") || "(empty)"
            : "Not computed"}
        </p>
        <p style={{ color: "lightgreen" }}>
          Set1 ∩ Set3:{" "}
          {results.intersection13
            ? Array.from(results.intersection13).join(", ") || "(empty)"
            : "Not computed"}
        </p>
        <p style={{ color: "lightgreen" }}>
          Set2 ∩ Set3:{" "}
          {results.intersection23
            ? Array.from(results.intersection23).join(", ") || "(empty)"
            : "Not computed"}
        </p>
      </div>
    </div>
  );
}
