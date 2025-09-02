import { useRef, useLayoutEffect, useState } from "react";
import { LineConnector } from "./LineConnector";

export function Tree({ node, rootLeft = null, hoveredId, setHoveredId }) {
    const ref = useRef(null);
    const [myLeft, setMyLeft] = useState(0);
  
    if (!node) return null;
  
    useLayoutEffect(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rootLeft === null) {
          setMyLeft(rect.left);
        }
      }
    }, [rootLeft]);
  
    const effectiveRootLeft = rootLeft ?? myLeft;
    const isHovered = hoveredId === node.id;
  
    return (
      <>
        <div
          ref={ref}
          style={{
            flex: 1,
            display: "flex",
            height: "100%",
            marginLeft: "20px",
            borderLeft: "10px solid transparent",
            borderImage: `linear-gradient(
              to bottom,
              transparent 0,
              transparent ${node.percentStart}%,
              ${node.color} ${node.percentStart}%,
              ${node.color} ${node.percentEnd}%,
              transparent ${node.percentEnd}%,
              transparent 100%
            ) 1`,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.07)",
            position: "relative"
          }}
        >

        {/* ID label near vertical border */}
        <span
          style={{
            position: "absolute",
            left: "-25px", // shift slightly left from border
            top: `${node.percentStart}%`,
            fontSize: "10px",
            fontWeight: "bold",
            color: "black",
            background: "rgba(255,255,255,0.9)",
            padding: "2px 4px",
            borderRadius: "3px",
            pointerEvents: "none"
          }}
        >
          {node.id}
        </span>

          {/* hover detection only on vertical colored part */}
          <div
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              position: "absolute",
              left: "-10px",
              top: `${node.percentStart}%`,
              height: `${node.percentEnd - node.percentStart}%`,
              width: "10px",
              cursor: "pointer"
            }}
          />

          {/* Tooltip (only visible when hovered) */}
          {isHovered && (
            <div
              style={{
                position: "absolute",
                left: "15px",
                top: `${node.percentStart}%`,
                background: "#333",
                color: "#fff",
                fontSize: "11px",
                padding: "4px 6px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                transform: "translateY(-50%)",
                zIndex: 10000
              }}
            >
              <strong>ID:</strong> {node.id} <br />
              <strong>Start:</strong> {node.start} <br />
              <strong>End:</strong> {node.end} <br />
              <strong>Duration:</strong> {node.end - node.start}s
            </div>
          )}
  
          {node.children.map((child, idx) => (
            <Tree
              key={idx}
              node={child}
              rootLeft={effectiveRootLeft}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>
  
        {/* START connector (faint when not hovered, solid when hovered) */}
        {rootLeft !== null && (
          <LineConnector
            targetRef={ref}
            startPercent={node.percentStart / 100}
            rootLeft={effectiveRootLeft}
            color={node.color}
            highlight={isHovered}
          />
        )}
  
        {/* END connector (completely hidden until hover) */}
        {rootLeft !== null && (
          <LineConnector
            targetRef={ref}
            startPercent={node.percentEnd / 100}
            rootLeft={effectiveRootLeft}
            color={node.color}
            highlight={isHovered}
            hideWhenNotHovered // 👈 new flag
          />
        )}
      </>
    );
  }