import { useState } from "react";
import SlidePanel from "./SlidePanel";
import "../../assets/css/Patient/HealthCalculator.css";

export default function HealthCalculator() {
  const [showForm, setShowForm] = useState(false);
  const [activePanel, setActivePanel] = useState(null);


  const toggleForm = (panel) => () => {
    setShowForm(true);
    setActivePanel(panel);
  };


  const closeForm = () => {
    setShowForm(false);
    setActivePanel(null);
  };

  const cards = [
    { title: "Age Calculator", img: "img/age.jpg", panel: "Age" },
    { title: "BMI Calculator", img: "img/bmi.jpg", panel: "BMI" },
    { title: "Ideal Weight", img: "img/idealWeight.jpg", panel: "IdealWeight" },
  ];

  return (
    <div className="hc-wrapper">
      {/* DARK BACKDROP BEHIND PANEL */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-3 z-40"
          onClick={closeForm}
        />
      )}

      <SlidePanel
        showForm={showForm}
        toggleForm={toggleForm}
        closeForm={closeForm} // <-- added
        activePanel={activePanel}
      />

      <h2 className="hc-title">Health & Fitness Tools</h2>

      <div className="hc-grid">
        {cards.map((c, i) => (
          <div key={i} className="hc-card">
            <img src={c.img} alt={c.title} className="hc-img" />
            <div className="hc-overlay">
              <h4>{c.title}</h4>
              <button onClick={toggleForm(c.panel)} className="hc-btn">
                Calculate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
