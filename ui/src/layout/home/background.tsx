export default function Background() {
  return (
    <div
      style={{ zIndex: -1, position: "absolute", inset: 0, display: "flex" }}
    >
      <div style={{ width: "50%", backgroundColor: "white", height: "100%" }} />
      <div
        style={{
          width: "50%",
          backgroundColor: "rgba(167,24,178,0.2)",
          height: "100%",
        }}
      />
    </div>
  );
}
