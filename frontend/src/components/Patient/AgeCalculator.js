import React, { useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getAgeCalculator } from "../Validations";
import "../../assets/css/PanelGlobal.css";

const AgeCalculator = ({ toggleForm }) => {
  const [dob, setDob] = useState("");
  const [compareDate, setCompareDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [age, setAge] = useState(null);
  const [error, setError] = useState("");

  // Refs for focusing
  const dobRef = useRef(null);
  const compareRef = useRef(null);

  const handleClose = () => {
    toggleForm();
  };

  const calculateAge = () => {
    setError("");
    setAge(null);

    if (!dob) {
      setError("Please select Date of Birth.");
      dobRef.current.focus();
      return;
    }

    if (!compareDate) {
      setError("Please select Age as on Date.");
      compareRef.current.focus();
      return;
    }

    const birth = new Date(dob);
    const compare = new Date(compareDate);

    if (birth > compare) {
      setError("Age as on Date must be later than Date of Birth.");
      compareRef.current.focus();
      return;
    }

    // Call validation
    getAgeCalculator(birth, compare, setAge);
  };

  const handleReset = () => {
    setDob("");
    setCompareDate(new Date().toISOString().split("T")[0]);
    setAge(null);
    setError("");
  };

  return (
    <div className={`panel-container ${error ? "shake" : ""}`}>
      {/* HEADER */}
      <div className="panel-header">
        <h2>Age Calculator</h2>
        <button className="panel-close-btn" onClick={handleClose}>
          <CloseIcon className="panel-close" />
        </button>
      </div>

      {/* FORM */}
      <div className="panel-form">
        <label className="panel-label">Date of Birth</label>
        <input
          ref={dobRef}
          type="date"
          className={`panel-input ${
            error.includes("Birth") ? "input-error" : ""
          }`}
          value={dob}
          max={compareDate}
          onChange={(e) => setDob(e.target.value)}
        />

        <label className="panel-label">Age as on Date</label>
        <input
          ref={compareRef}
          type="date"
          className={`panel-input ${
            error.includes("later") ? "input-error" : ""
          }`}
          value={compareDate}
          min={dob || "1900-01-01"}
          onChange={(e) => setCompareDate(e.target.value)}
        />

        {/* Error Message */}
        {error && <p className="panel-error-text">{error}</p>}

        <div className="panel-btn-group">
          <button className="panel-btn-primary" onClick={calculateAge}>
            Calculate
          </button>
          <button className="panel-btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* DIVIDER */}
      {age && <div className="panel-divider"></div>}

      {/* RESULT */}
      {age && (
        <div className="panel-result fadeInUp">
          <h4>Result</h4>
          <p>
            <strong>{age.years}</strong> years <strong>{age.months}</strong>{" "}
            months <strong>{age.days}</strong> days
          </p>

          <p>
            <strong>{age.years * 12 + age.months}</strong> months {age.days}{" "}
            days
          </p>

          <p>
            <strong>
              {Math.floor(
                (age.years * 365 + age.months * 30.44 + age.days) / 7
              )}
            </strong>{" "}
            weeks {age.days} days
          </p>

          <p>
            <strong>
              {Math.round(age.years * 365 + age.months * 30.44 + age.days)}
            </strong>{" "}
            days
          </p>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
