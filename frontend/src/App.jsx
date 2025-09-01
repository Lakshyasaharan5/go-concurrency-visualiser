import { useState } from "react";
import { Timeline } from "./Timeline";
import { Tree } from "./Tree"
import data from "./data";  // adjust path if needed

export default function App() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div
      style={{
        width: "60%",
        height: "80vh",
        margin: "100px auto",
        border: "1px solid #ccc",
        position: "relative",
        display: "flex",
        background: "#fff"
      }}
    >
      <Timeline start={data.start} end={data.end} />
      <div style={{ flex: 1 }}>
        <Tree node={data} hoveredId={hoveredId} setHoveredId={setHoveredId} />
      </div>
    </div>
  );
}

