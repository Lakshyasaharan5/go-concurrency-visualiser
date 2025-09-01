import { useRef, useLayoutEffect, useState } from "react";

function Connector({ targetRef, startPercent = 0.3 }) {
  const [lineStyle, setLineStyle] = useState({ top: 0, width: 0 });

  useLayoutEffect(() => {
    function position() {
      const rect = targetRef.current.getBoundingClientRect();
      setLineStyle({
        top: rect.top + rect.height * startPercent,
        width: rect.left
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
  }, [startPercent]);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: lineStyle.top,
        width: lineStyle.width,
        borderTop: "2px solid blue",
        pointerEvents: "none",
        zIndex: 9999
      }}
    />
  );
}

function Tree({ node }) {
  const ref = useRef(null);

  if (!node) {
    return null;
  }

  return (
    <>
      <div
        ref={ref}
        style={{
          flex: 1,
          display: "flex",
          height: "100vh",
          marginLeft: "15px",
          borderLeft: "12px solid transparent",
          borderImage: `linear-gradient(
            to bottom,
            transparent 0,
            transparent ${node.percentStart}%,
            blue ${node.percentStart}%,
            blue ${node.percentEnd}%,
            transparent ${node.percentEnd}%,
            transparent 100%
          ) 1`,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,.15)"
        }}
      >
        {node.children.map((child, idx) => (
          <Tree key={idx} node={child} />
        ))}
      </div>

      {/* connector for this node */}
      <Connector targetRef={ref} startPercent={node.percentStart / 100} />
    </>
  );
}

export function DivWithLines() {
  return <Tree node={data} />;
}

const data = {
  id: 1,
  start: 0,
  end: 30,
  percentStart: 0,
  percentEnd: 100,
  children: [
    {
      id: 37,
      start: 0,
      end: 15,
      percentStart: 0,
      percentEnd: 50,
      children: [
        {
          id: 3,
          start: 15,
          end: 25,
          percentStart: 50,
          percentEnd: 83.3,
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
      children: [
        {
          id: 19,
          start: 15,
          end: 17,
          percentStart: 50,
          percentEnd: 56.7,
          children: []
        }
      ]
    }
  ]
};
