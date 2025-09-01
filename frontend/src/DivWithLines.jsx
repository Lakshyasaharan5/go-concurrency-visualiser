import { useRef, useLayoutEffect, useState } from "react";

function Connector({ targetRef, startPercent = 0.3, fromLeft = 0, color = "blue" }) {
  const [lineStyle, setLineStyle] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    function position() {
      const rect = targetRef.current.getBoundingClientRect();
      setLineStyle({
        top: rect.top + rect.height * startPercent,
        left: fromLeft,
        width: rect.left - fromLeft
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
  }, [startPercent, fromLeft]);

  return (
    <div
      style={{
        position: "fixed",
        left: lineStyle.left,
        top: lineStyle.top,
        width: lineStyle.width,
        borderTop: `2px solid ${color}`,   // <-- use node color
        pointerEvents: "none",
        zIndex: 9999
      }}
    />
  );
}

function Tree({ node, parentLeft = 0 }) {
  const ref = useRef(null);
  const [myLeft, setMyLeft] = useState(0);

  if (!node) return null;

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setMyLeft(rect.left);
    }
  }, []);

  return (
    <>
      <div
        ref={ref}
        style={{
          flex: 1,
          display: "flex",
          height: "100%",
          marginLeft: "15px",
          borderLeft: "12px solid transparent",
          borderImage: `linear-gradient(
            to bottom,
            transparent 0,
            transparent ${node.percentStart}%,
            ${node.color} ${node.percentStart}%,
            ${node.color} ${node.percentEnd}%,
            transparent ${node.percentEnd}%,
            transparent 100%
          ) 1`,   // <-- gradient uses node.color
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,.15)"
        }}
      >
        {node.children.map((child, idx) => (
          <Tree key={idx} node={child} parentLeft={myLeft} />
        ))}
      </div>

      {/* connector: from parent's border to me */}
      <Connector
        targetRef={ref}
        startPercent={node.percentStart / 100}
        fromLeft={parentLeft}
        color={node.color}   // <-- pass color down
      />
    </>
  );
}

export function DivWithLines() {
  return (
    <div
      style={{
        width: "50%",       // you can change width
        height: "80vh",     // you can change height
        margin: "100px auto",   // center horizontally and add margin on top
        border: "1px solid #ccc",
        position: "relative",
      }}
    >
      <Tree node={data} />
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
      id: 37,
      start: 0,
      end: 15,
      percentStart: 0,
      percentEnd: 50,
      color: "#FF7F0E", // vivid orange
      children: [
        {
          id: 3,
          start: 15,
          end: 25,
          percentStart: 50,
          percentEnd: 83.3,
          color: "#FFB870", // lighter orange
          children: []
        }
      ]
    },
    {
      id: 38,
      start: 0,
      end: 15,
      percentStart: 0,
      percentEnd: 50,
      color: "#1F77B4", // vivid blue
      children: [
        {
          id: 19,
          start: 15,
          end: 17,
          percentStart: 50,
          percentEnd: 56.7,
          color: "#6BAED6", // lighter blue
          children: []
        }
      ]
    }
  ]
};
