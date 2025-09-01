import { useRef, useLayoutEffect, useState } from "react";
import { Timeline } from "./Timeline";

function Connector({ targetRef, startPercent = 0.3, rootLeft = 0, color = "blue", highlight = false, hideWhenNotHovered = false }) {
  const [lineStyle, setLineStyle] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    function position() {
      const rect = targetRef.current.getBoundingClientRect();
      setLineStyle({
        top: rect.top + rect.height * startPercent,
        left: rootLeft,
        width: rect.left - rootLeft
      });
    }
    position();

    const ro = new ResizeObserver(position);
    if (targetRef.current) ro.observe(targetRef.current);

    window.addEventListener("scroll", position, { passive: true });
    window.addEventListener("resize", position, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", position);
      window.removeEventListener("resize", position);
    };
  }, [startPercent, rootLeft]);

  return (
    <div
      style={{
        position: "fixed",
        left: lineStyle.left,
        top: lineStyle.top,
        width: lineStyle.width,
        borderTop: highlight ? `4px solid ${color}` : `2px dashed ${color}`,
        opacity: hideWhenNotHovered ? (highlight ? 1 : 0) : (highlight ? 1 : 0.3), // logic here
        pointerEvents: "none",
        zIndex: 9999,
        transition: "all 0.2s ease"
      }}
    />
  );
}

function Tree({ node, rootLeft = null, hoveredId, setHoveredId }) {
  const ref = useRef(null);
  const [myLeft, setMyLeft] = useState(0);

  if (!node) return null;

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      // capture root left position once
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
          position: "relative" // needed for overlay positioning
        }}
      >
        {/* invisible overlay for hover detection only on vertical colored part */}
        <div
          onMouseEnter={() => setHoveredId(node.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            position: "absolute",
            left: "-10px",
            top: `${node.percentStart}%`,
            height: `${node.percentEnd - node.percentStart}%`,
            width: "10px", // matches the border thickness
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
        <Connector
          targetRef={ref}
          startPercent={node.percentStart / 100}
          rootLeft={effectiveRootLeft}
          color={node.color}
          highlight={isHovered}
        />
      )}

      {/* END connector (completely hidden until hover) */}
      {rootLeft !== null && (
        <Connector
          targetRef={ref}
          startPercent={node.percentEnd / 100}
          rootLeft={effectiveRootLeft}
          color={node.color}
          highlight={isHovered}
          hideWhenNotHovered // new flag
        />
      )}
    </>
  );
}

export function DivWithLines() {
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
      {/* Timeline on the left side of Tree */}
      <Timeline start={data.start} end={data.end} />

      {/* Tree */}
      <div style={{ flex: 1 }}>
        <Tree node={data} hoveredId={hoveredId} setHoveredId={setHoveredId} />
      </div>
    </div>
  );
}

const data = {
  id: 1,
  start: 0,
  end: 30,
  percentStart: 0,
  percentEnd: 100,
  color: "#000000", // root = black
  children: [
    {
      id: 10,
      start: 0,
      end: 10,
      percentStart: 0,
      percentEnd: 33.3,
      color: "#FF7F0E", // vivid orange
      children: [
        {
          id: 101,
          start: 2,
          end: 6,
          percentStart: 6.7,
          percentEnd: 20,
          color: "#FFB870", // lighter orange
          children: [
            {
              id: 1011,
              start: 3,
              end: 5,
              percentStart: 10,
              percentEnd: 16.7,
              color: "#FFE0C2", // even lighter orange
              children: []
            }
          ]
        },
        {
          id: 102,
          start: 6,
          end: 9,
          percentStart: 20,
          percentEnd: 30,
          color: "#FFB870", // lighter orange
          children: []
        }
      ]
    },
    {
      id: 20,
      start: 10,
      end: 20,
      percentStart: 33.3,
      percentEnd: 66.7,
      color: "#1F77B4", // vivid blue
      children: [
        {
          id: 201,
          start: 12,
          end: 16,
          percentStart: 40,
          percentEnd: 53.3,
          color: "#6BAED6", // lighter blue
          children: [
            {
              id: 2011,
              start: 13,
              end: 15,
              percentStart: 43.3,
              percentEnd: 50,
              color: "#C6DBEF", // even lighter blue
              children: []
            }
          ]
        },
        {
          id: 202,
          start: 16,
          end: 19,
          percentStart: 53.3,
          percentEnd: 63.3,
          color: "#6BAED6", // lighter blue
          children: []
        }
      ]
    },
    {
      id: 30,
      start: 20,
      end: 30,
      percentStart: 66.7,
      percentEnd: 100,
      color: "#2CA02C", // vivid green
      children: [
        {
          id: 301,
          start: 22,
          end: 26,
          percentStart: 73.3,
          percentEnd: 86.7,
          color: "#98DF8A", // lighter green
          children: [
            {
              id: 3011,
              start: 23,
              end: 25,
              percentStart: 76.7,
              percentEnd: 83.3,
              color: "#D5F5E3", // even lighter green
              children: []
            }
          ]
        },
        {
          id: 302,
          start: 26,
          end: 29,
          percentStart: 86.7,
          percentEnd: 96.7,
          color: "#98DF8A", // lighter green
          children: []
        }
      ]
    }
  ]
};
