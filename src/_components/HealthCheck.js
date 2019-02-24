import React from "react";
import './HealthCheck.css';

export default ({
  isUp,
  text,
    upImg = "/images/green-circle.png",
    downImg = "/images/red-circle.png",
  className = "HealthCheck",
}) =>
    <div className={`col-4 ${className}`}>
      <img className="health-image"
           src={isUp ? upImg : downImg} />
        <h5 className="text-left"> {text} </h5>
    </div>;
