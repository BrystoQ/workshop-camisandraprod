import React from "react";
import "./button.css";

type ButtonProps = {
  text: string;
  selected?: boolean;
  onClick?: () => void;
  width?: number;
};

const Button: React.FC<ButtonProps> = ({
  text,
  selected = false,
  onClick,
  width,
}) => {
  return (
    <button
      style={{ width: width ? `${width}px` : "120px" }}
      className={`button ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
