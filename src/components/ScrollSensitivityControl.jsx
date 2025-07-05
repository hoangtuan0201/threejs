import React, { useState } from "react";
import { createPortal } from "react-dom";

const styles = {
  container: {
    position: "fixed",
    top: "100px",
    right: "24px",
    zIndex: 1000,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  button: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(71, 85, 105, 0.9)",
    backdropFilter: "blur(10px)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow: "0 4px 20px rgba(71, 85, 105, 0.3)",
    transition: "all 0.3s ease",
  },
  panel: {
    marginTop: "8px",
    padding: "20px",
    minWidth: "250px",
    background: "linear-gradient(135deg, rgba(71, 85, 105, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    color: "white",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.95)",
  },
  sliderContainer: {
    marginBottom: "16px",
  },
  sliderLabel: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "8px",
  },
  slider: {
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    background: "rgba(255, 255, 255, 0.2)",
    outline: "none",
    cursor: "pointer",
  },
  presetContainer: {
    display: "flex",
    gap: "8px",
    justifyContent: "space-between",
  },
  presetButton: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.9)",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "12px",
    transition: "all 0.2s ease",
  },
  presetButtonActive: {
    background: "rgba(59, 130, 246, 0.3)",
    border: "1px solid rgba(59, 130, 246, 0.5)",
    fontWeight: "600",
  },
  helpText: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: "16px",
    textAlign: "center",
    lineHeight: 1.4,
  },
};

export default function ScrollSensitivityControl({
  sensitivity = 1,
  onSensitivityChange,
  isVisible = true
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const handleSliderChange = (e) => {
    onSensitivityChange(parseFloat(e.target.value));
  };

  const presets = [
    { label: "Slow", value: 0.5 },
    { label: "Normal", value: 1.0 },
    { label: "Fast", value: 2.0 },
  ];

  return createPortal(
    <div style={styles.container}>
      {/* Settings Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          ...styles.button,
          transform: isExpanded ? "scale(1.05)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(51, 65, 85, 0.95)";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(71, 85, 105, 0.9)";
          e.target.style.transform = isExpanded ? "scale(1.05)" : "scale(1)";
        }}
      >
        {isExpanded ? "✕" : "⚙"}
      </button>

      {/* Control Panel */}
      {isExpanded && (
        <div style={styles.panel}>
          {/* Title */}
          <div style={styles.title}>
            Scroll Sensitivity
          </div>

          {/* Sensitivity Slider */}
          <div style={styles.sliderContainer}>
            <div style={styles.sliderLabel}>
              Speed: {sensitivity.toFixed(1)}x
            </div>

            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={sensitivity}
              onChange={handleSliderChange}
              style={{
                ...styles.slider,
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((sensitivity - 0.1) / 2.9) * 100}%, rgba(255, 255, 255, 0.2) ${((sensitivity - 0.1) / 2.9) * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
              }}
            />
          </div>

          {/* Preset Buttons */}
          <div style={styles.presetContainer}>
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onSensitivityChange(preset.value)}
                style={{
                  ...styles.presetButton,
                  ...(sensitivity === preset.value ? styles.presetButtonActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (sensitivity !== preset.value) {
                    e.target.style.background = "rgba(255, 255, 255, 0.15)";
                    e.target.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (sensitivity !== preset.value) {
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Help Text */}
          <div style={styles.helpText}>
            Adjust scroll speed for 3D navigation
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
