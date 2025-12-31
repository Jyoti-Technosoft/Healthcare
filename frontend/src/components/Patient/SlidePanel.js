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
        className={`fixed top-0 right-0 h-screen bg-blue-50 z-50 shadow-lg border-l border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out ${
          showForm ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-4/5 md:w-[480px]`}
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
