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