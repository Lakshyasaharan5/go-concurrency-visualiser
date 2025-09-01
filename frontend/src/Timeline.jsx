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
              <span style={{ marginRight: "6px" }}>{t}</span>
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