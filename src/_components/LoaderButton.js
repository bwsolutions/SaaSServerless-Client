import React from "react";
import { Button, Glyphicon } from "react-bootstrap/lib";
import './LoaderButton.css';

export default ({
  isLoading,
  text,
  loadingText,
  className = "styles.LoaderButton",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className} btn`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <i className="fas fa-refresh spinning"></i> }
    {!isLoading ? text : loadingText}
  </Button>;
