export function Timeline({ start, end }) {
    const ticks = [];
    for (let i = start; i <= end; i += 2) {
      ticks.push(i);
    }
  
    return (
      <div
        style={{
          width: "60px",          // fixed width for scale
          background: "#f9f9f9",
          borderRight: "2px solid #000",
          position: "relative"
        }}
      >

      {/* Vertical axis label */}
      <span
        style={{
          position: "absolute",
          left: "-45px",  // shift left of the timeline
          top: "50%",
          transform: "rotate(-90deg) translateY(-50%)",
          transformOrigin: "center",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333"
        }}
      >
        Time (s)
      </span>

        {ticks.map((t, i) => {
          const percent = (i / (ticks.length - 1)) * 100;
          return (
            <div
              key={t}
              style={{
                position: "absolute",
                top: `${percent}%`,
                right: 0,
                display: "flex",
                alignItems: "center",
                transform: "translateY(-50%)"
              }}
            >
              <span style={{ marginRight: "6px", fontSize: "15px" }}>{t}s</span>
              <div
                style={{
                  width: "8px",
                  height: "1px",
                  background: "#000",
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }