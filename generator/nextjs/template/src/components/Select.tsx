import React from "react";

export type SelectOption = {
  label?: string;
  value: string;
};

type SelectProps = {
  id: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
};

const Select: React.FC<SelectProps> = ({
  id,
  options,
  value,
  onChange,
  label,
  error,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      {label && <label className="block mb-1 ">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ? option.label : option.value}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
