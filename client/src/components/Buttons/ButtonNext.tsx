import React from "react";
import "./button.css";
import Arrow from "../../assets/arrow.svg";

type ButtonProps = {
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className="button__next" onClick={onClick}>
      <img src={Arrow} alt="Next" />
    </button>
  );
};

export default Button;
