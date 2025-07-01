export default function ControlPanel({ onExplore }) {
  const handleClick = async (type) => {
    if (type === "explore") {
      onExplore();
    } else if (type === "compare") {
      alert("Tính năng so sánh sẽ sớm ra mắt!");
    } else if (type === "download") {
      window.open("/brochures/sample.pdf", "_blank");
    }
  };

  const containerStyle = {
    position: "absolute",
    top: "70%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    padding: "24px 32px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    textAlign: "center",
    maxWidth: "320px",
    minWidth: "280px"
  };

  const headingStyle = {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    background: "linear-gradient(135deg, #007BFF, #0056b3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const taglineStyle = {
    margin: "0 0 8px",
    fontSize: "16px",
    color: "#666",
    fontWeight: "400"
  };

  const buttonBaseStyle = {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "250px",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden"
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    background: "linear-gradient(135deg, #007BFF, #0056b3)",
    color: "white",
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)"
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    background: "rgba(0, 123, 255, 0.1)",
    color: "#007BFF",
    border: "1px solid rgba(0, 123, 255, 0.3)"
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 20px rgba(0, 123, 255, 0.4)";
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = e.target.className === "primary" 
      ? "0 4px 15px rgba(0, 123, 255, 0.3)"
      : "none";
  };

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <h2 style={headingStyle}>AirSmart</h2>
        <p style={taglineStyle}>Smarter Comfort Starts Here</p>
        <div style={{
          width: "40px",
          height: "3px",
          background: "linear-gradient(135deg, #007BFF, #0056b3)",
          borderRadius: "2px",
          margin: "8px auto"
        }}></div>
      </div>

      <button 
        className="primary"
        style={primaryButtonStyle}
        onClick={() => handleClick("explore")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        🚀 Khám phá hệ thống
      </button>
      
      <button 
        style={secondaryButtonStyle}
        onClick={() => handleClick("compare")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        📊 So sánh với hệ thống cũ
      </button>
      
      <button 
        style={secondaryButtonStyle}
        onClick={() => handleClick("download")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        📁 Tải brochure
      </button>

      <div style={{
        fontSize: "12px",
        color: "#999",
        marginTop: "8px",
        textAlign: "center"
      }}>
        💡 Cuộn chuột để điều hướng trong tour
      </div>
    </div>
  );
}