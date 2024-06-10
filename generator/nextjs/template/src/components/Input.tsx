import React, { useState } from "react";

type InputProps = {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputClassName = `border ${
    error ? "border-red-500" : isFocused ? "border-blue-500" : "border-gray-300"
  } rounded-md py-2 px-3 w-full`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={inputClassName}
        required={required}
        disabled={disabled}
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
