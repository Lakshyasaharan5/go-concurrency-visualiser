import { useState, useLayoutEffect } from "react";

export function LineConnector({ targetRef, startPercent = 0.3, rootLeft = 0, color = "blue", highlight = false, hideWhenNotHovered = false }) {
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
          opacity: hideWhenNotHovered ? (highlight ? 1 : 0) : (highlight ? 1 : 0.3), // 👈 logic here
          pointerEvents: "none",
          zIndex: 9999,
          transition: "all 0.2s ease"
        }}
      />
    );
  }