import React, { useState, useRef } from "react";
import "../../assets/css/Patient/PanelGlobal.css"; // Ensure path is correct

const IdealWeightCalculator = ({ toggleForm }) => {
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male"); // Default to male
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const heightRef = useRef(null);

  // Robinson Formula
  const calculateIdealWeight = () => {
    const h = parseFloat(height);

    if (!h || isNaN(h) || h < 50 || h > 300) {
      setError("Please enter a valid height (50cm - 300cm).");
      heightRef.current.focus();
      return;
    }

    setError("");

    // Conversion: cm to inches
    const inches = h / 2.54;
    const over60 = inches - 60;

    let ideal;

    if (over60 < 0) {
      // Basic fallback for very short height
      ideal = gender === "male" ? 52 : 49;
    } else {
      if (gender === "male") {
        // 52kg + 1.9kg per inch over 5ft
        ideal = 52 + 1.9 * over60;
      } else {
        // 49kg + 1.7kg per inch over 5ft
        ideal = 49 + 1.7 * over60;
      }
    }

    setResult(ideal.toFixed(1));
  };

  const handleReset = () => {
    setHeight("");
    setResult(null);
    setError("");
    setGender("male");
  };

  return (
    <div className={`panel-container ${error ? "shake" : ""}`}>
      {/* HEADER */}
      <div className="panel-header">
        <h2>Ideal Weight</h2>
        <button className="panel-close-btn" onClick={toggleForm}>
          <span className="text-gray-500 hover:text-gray-700 text-xl leading-none" style={{ fontSize: 24 }}>×</span>
        </button>
      </div>

      {/* FORM */}
      <div className="panel-form">
 

        {/* HEIGHT INPUT (Aligned Left) */}
        <label className="panel-label">Height (cm)</label>
        <input
          ref={heightRef}
          type="number"
          className={`panel-input ${error ? "input-error" : ""}`}
          placeholder="Enter height in cm"
          value={height}
          onChange={(e) => {
            setHeight(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && calculateIdealWeight()}
        />

        {error && <p className="panel-error-text">{error}</p>}

        <div className="panel-btn-group">
          <button className="panel-btn-primary" onClick={calculateIdealWeight}>
            Calculate
          </button>
          <button className="panel-btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <>
          <div className="panel-divider"></div>
          <div className="panel-result">
            <h4>Estimated Ideal Weight</h4>
            <p>
              Based on the Robinson formula, your ideal weight is approximately:
            </p>
            <span className="result-highlight">{result} kg</span>
          </div>
        </>
      )}
    </div>
  );
};

export default IdealWeightCalculator;
