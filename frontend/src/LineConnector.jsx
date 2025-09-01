import { useRef, useLayoutEffect, useState } from "react";

export function LineConnector() {
  const boxRef = useRef(null);
  const [lineStyle, setLineStyle] = useState({ top: 0, width: 0 });

  useLayoutEffect(() => {
    const rect = boxRef.current.getBoundingClientRect();
    setLineStyle({
      top: rect.top,
      width: rect.left
    })
    console.log(`Top: ${rect.top} Left: ${rect.left}`);
  }, []);

  return (
    <>
      <div
        ref={boxRef}
        style={{
          width: 200,
          height: 100,
          marginTop: 300,
          marginLeft: 500,
          border: "2px solid red"
        }}
      >
      </div>
      <div
        style={{
          position: "fixed",
          top: lineStyle.top,
          width: lineStyle.width,
          borderTop: "2px solid blue"
        }}
      >        
      </div>
    </>
  );
}
