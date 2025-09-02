import { useState } from "react";
import { Timeline } from "./Timeline";
import { Tree } from "./Tree";
import data from "./data";  

export function Chart() {
    const [hoveredId, setHoveredId] = useState(null);

    return (
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
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)"
        }}
    >
        <Timeline start={data.start} end={data.end} />
        <div style={{ flex: 1 }}>
        <Tree node={data} hoveredId={hoveredId} setHoveredId={setHoveredId} />
        </div>
    </div>);
}