import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Global/PageNotFound.css"; // Make sure to create this CSS file

const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <div className="art-composition">
        {/* Abstract Shapes Layer */}
        <div className="shape yellow-blob">
          <svg viewBox="0 0 200 200" fill="#EDF228">
            <path
              d="M45.7,-51.3C59.9,-42.7,72.4,-30.2,76.3,-15.3C80.2,-0.4,75.5,16.9,66.1,31.8C56.7,46.7,42.6,59.2,26.7,66.7C10.8,74.2,-6.9,76.7,-23.2,72.4C-39.5,68.1,-54.4,57,-63.8,43.2C-73.2,29.4,-77.1,12.9,-74.3,-2.2C-71.5,-17.3,-62,-31,-50.4,-40.4C-38.8,-49.8,-25.1,-54.9,-10.6,-54.3C3.9,-53.7,18.4,-47.4,31.5,-59.9"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="shape pink-moon">
          <svg viewBox="0 0 100 100" fill="#EA5FE6">
            <path d="M50,0 A50,50 0 1,0 50,100 L50,70 A20,20 0 1,1 50,30 Z" />
          </svg>
        </div>

        <div className="shape blue-heart">
          <svg viewBox="0 0 24 24" fill="#3B82F6">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div className="shape green-star">
          <svg viewBox="0 0 24 24" fill="#10B981">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        <div className="shape orange-dot"></div>

        {/* Text Content Layer */}
        <div className="content-layer">
          <h1 className="error-text">
            PAGE <span className="boxed-text">NOT</span> FOUND
            <span className="small-tag">HEALTH BY HABIT</span>
          </h1>

          {/* The Link acts as the "Back Home" button */}
          <Link to="/" className="starburst-btn">
            BACK HOME &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
