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

      <div
        className={`slide-panel-drawer ${showForm ? "open" : ""}`}
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
      </div>
    </>
  );
};

export default SlidePanel;
