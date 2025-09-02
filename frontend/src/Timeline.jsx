export function Timeline({ start, end }) {
  const duration = end - start;
  const useMs = duration < 1;

  // pick a "nice" step size
  function niceStep(range, targetSteps) {
    const roughStep = range / targetSteps;
    const pow10 = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const multiples = [1, 2, 5, 10];
    let step = pow10;
    for (let m of multiples) {
      if (roughStep <= m * pow10) {
        step = m * pow10;
        break;
      }
    }
    return step;
  }

  const range = useMs ? duration * 1000 : duration;
  const step = niceStep(range, 10); // aim ~10 ticks
  const ticks = [];
  for (let t = 0; t <= range + 0.0001; t += step) {
    ticks.push(t);
  }

  const format = (v) =>
    useMs ? `${Math.round(v)}ms` : `${(v).toFixed(1)}s`;

  return (
    <div
      style={{
        width: "70px",
        background: "#fff",
        borderRight: "2px solid #000",
        position: "relative",
      }}
    >
      {/* Vertical axis label */}
      <span
        style={{
          position: "absolute",
          left: "-15px",
          top: "50%",
          transform: "rotate(-90deg) translateY(-50%)",
          transformOrigin: "center",
          fontSize: "15px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Time {useMs ? "(ms)" : "(s)"}
      </span>

      {ticks.map((t, i) => {
        const percent = (t / range) * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${percent}%`,
              right: 0,
              display: "flex",
              alignItems: "center",
              transform: "translateY(-50%)",
            }}
          >
            <span style={{ marginRight: "6px", fontSize: "12px" }}>
              {format(t)}
            </span>
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
