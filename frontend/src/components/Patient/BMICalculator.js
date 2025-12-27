import React, { useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { calculateBMI, getClassificationFromBMI } from "../Validations";
import "../../assets/css/Patient/PanelGlobal.css";

const BMICalculator = ({ toggleForm }) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState("");
  const heightRef = useRef(null);
  const weightRef = useRef(null);

  const table = [
    { range: "< 16", classification: "Severe Thinness" },
    { range: "16 - 17", classification: "Moderate Thinness" },
    { range: "17 - 18.5", classification: "Mild Thinness" },
    { range: "18.5 - 25", classification: "Normal" },
    { range: "25 - 30", classification: "Overweight" },
    { range: "30 - 35", classification: "Obese Class I" },
    { range: "35 - 40", classification: "Obese Class II" },
    { range: "> 40", classification: "Obese Class III" },
  ];

  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      // Allow only numbers or decimal
      setter(value);
      setError(""); // Remove error while typing valid input
    }
  };

  const handleCalculate = () => {
    let h = parseFloat(height.trim());
    let w = parseFloat(weight.trim());

    if (isNaN(h)) {
      setError("Please enter a valid height.");
      heightRef.current.focus();
      return;
    }
    if (isNaN(w)) {
      setError("Please enter a valid weight.");
      weightRef.current.focus();
      return;
    }

    if (h < 50 || h > 300) {
      setError("Height must be between 50cm and 300cm.");
      heightRef.current.focus();
      return;
    }

    if (w < 2 || w > 500) {
      setError("Weight must be between 2kg and 500kg.");
      weightRef.current.focus();
      return;
    }

    setBmi(calculateBMI(h, w));
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setError("");
  };

  const classification = getClassificationFromBMI(bmi, table);

  return (
    <div className={`panel-container ${error ? "shake" : ""}`}>
      {/* HEADER */}
      <div className="panel-header">
        <h2>BMI Calculator</h2>
        <CloseIcon className="panel-close" onClick={toggleForm} />
      </div>

      {/* FORM */}
      <div className="panel-form">
        <label className="panel-label">Height (cm)</label>
        <input
          ref={heightRef}
          type="number"
          min="50"
          max="300"
          className={`panel-input ${
            error.includes("Height") ? "input-error" : ""
          }`}
          placeholder="Enter height in cm"
          value={height}
          onChange={(e) => handleInputChange(e, setHeight)}
        />

        <label className="panel-label mt-2">Weight (kg)</label>
        <input
          ref={weightRef}
          type="number"
          min="2"
          max="500"
          className={`panel-input ${
            error.includes("Weight") ? "input-error" : ""
          }`}
          placeholder="Enter weight in kg"
          value={weight}
          onChange={(e) => handleInputChange(e, setWeight)}
        />

        {error && <p className="panel-error-text">{error}</p>}

        <div className="panel-btn-group">
          <button className="panel-btn-primary" onClick={handleCalculate}>
            Calculate BMI
          </button>
          <button className="panel-btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {bmi !== null && <div className="panel-divider"></div>}

      {/* RESULT */}
      {bmi !== null && (
        <div className="panel-result">
          <h4>Your BMI</h4>
          <p className="bmi-value">
            <strong>{bmi}</strong>
          </p>

          <h5>Category</h5>
          <p>
            <strong>{classification}</strong>
          </p>

          <table className="bmi-table">
            <thead>
              <tr>
                <th>Range</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              {table.map((item) => (
                <tr
                  key={item.classification}
                  className={
                    classification === item.classification
                      ? "highlight-row"
                      : ""
                  }
                >
                  <td>{item.range}</td>
                  <td>{item.classification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
