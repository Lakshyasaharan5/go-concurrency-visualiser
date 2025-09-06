import { useState, useEffect, useCallback } from "react";
import { Timeline } from "./Timeline";
import { Tree } from "./Tree";
import { fetchData } from "./data";
import { Upload } from "./Upload";

export function Chart() {
  const [data, setData] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const loadData = useCallback(() => {
    setData(null); // reset to show loading
    fetchData()
      .then(setData)
      .catch((err) => console.error("Failed to load trace data:", err));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Upload onUploadSuccess={loadData} />

      {!data ? (
        <div
          style={{
            width: "60%",
            height: "80vh",
            margin: "0 auto",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "500",
            color: "#555",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          Loading trace data...
        </div>
      ) : (
        <div
          style={{
            width: "60%",
            height: "80vh",
            margin: "0 auto",
            padding: "10px",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            position: "relative",
            display: "flex",
            background: "#fff",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          <Timeline start={data.start} end={data.end} />
          <div style={{ flex: 1 }}>
            <Tree node={data} hoveredId={hoveredId} setHoveredId={setHoveredId} />
          </div>
        </div>
      )}
    </div>
  );
}
