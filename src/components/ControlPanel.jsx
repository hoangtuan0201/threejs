export default function ControlPanel({ onExplore }) {
  const handleClick = async (type) => {
    if (type === "explore") {
      onExplore();
    } else if (type === "compare") {
      alert("Compare coming soon!");
    } else if (type === "download") {
      window.open("/brochures/sample.pdf", "_blank");
    }
  };

  const containerStyle = {
    position: "absolute",
    top: "50%",
    left: "80%",
    transform: "translateX(-50%)",
    zIndex: 10,
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    padding: "20px 30px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    textAlign: "center",
    maxWidth: "90vw",
  };

  const headingStyle = {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1a1a1a",
  };

  const taglineStyle = {
    margin: "4px 0 12px",
    fontSize: "14px",
    color: "#555",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "14px",
    background: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "250px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>AirSmart</h2>
      <p style={taglineStyle}>Smarter Comfort Starts Here</p>
      <button style={buttonStyle} onClick={() => handleClick("explore")}>
        Explore the System
      </button>
      <button style={buttonStyle} onClick={() => handleClick("compare")}>
        Compare with Traditional
      </button>
      <button style={buttonStyle} onClick={() => handleClick("download")}>
        Download Brochure
      </button>
    </div>
  );
}
