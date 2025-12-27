import React from "react";
import { Slide, Box } from "@mui/material";
import BMICalculator from "./BMICalculator";
import IdealWeight from "./IdealWeight";
import AgeCalculator from "./AgeCalculator";
import "../../assets/css/Patient/SidePanel.css";

const SlidePanel = ({ showForm, toggleForm, closeForm, activePanel }) => {
  const handleClose = () => closeForm(); 

  return (
    <>
      {/* Custom backdrop (click closes panel) */}
      {showForm && (
        <div className="slide-panel-backdrop" onClick={handleClose}></div>
      )}

      <Slide direction="left" in={showForm} mountOnEnter unmountOnExit>
        <Box
          className="slide-panel"
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            width: { xs: "100%", sm: "80%", md: "480px" },
            height: "100vh",
            background: "#f8fbfe",
            zIndex: 10000,
            boxShadow: "-4px 0 18px rgba(0,0,0,0.15)",
            borderLeft: "1px solid #e2e8f0",
            overflowY: "auto",
          }}
        >
          <div className="panel-wrapper">
            {activePanel === "BMI" && (
              <BMICalculator toggleForm={handleClose} />
            )}
            {activePanel === "IdealWeight" && (
              <IdealWeight toggleForm={handleClose} />
            )}
            {activePanel === "Age" && (
              <AgeCalculator toggleForm={handleClose} />
            )}
          </div>
        </Box>
      </Slide>
    </>
  );
};

export default SlidePanel;
