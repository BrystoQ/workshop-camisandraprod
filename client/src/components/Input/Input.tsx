import React, { ChangeEvent } from "react";
import "./input.css";

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  width?: number;
}

const InputComponent: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  width,
}) => {
  return (
    <div className="input__wrapper">
      <input
        width={width ? width : 300}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputComponent;
