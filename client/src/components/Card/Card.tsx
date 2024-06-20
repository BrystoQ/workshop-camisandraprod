import React from "react";
import "./card.css";

interface CardProps {
  width: number;
  height: number;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ width, height, children }) => {
  return (
    <div
      className="card"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
