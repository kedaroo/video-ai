export default function Background() {
  return (
    <div
      style={{ zIndex: -1, position: "absolute", inset: 0, display: "flex" }}
    >
      <div style={{ width: "50%", backgroundColor: "white", height: "100%" }} />
      <div
        style={{
          width: "50%",
          backgroundColor: "rgba(23,65,34,0.1)",
          height: "100%",
        }}
      />
    </div>
  );
}
