import React from "react";
import "./button.css";

type ButtonProps = {
  onClick?: () => void;
  link: string;
};

const Button: React.FC<ButtonProps> = ({ onClick, link }) => {
  return (
    <button className="button__next" onClick={onClick}>
      {link}
    </button>
  );
};

export default Button;
