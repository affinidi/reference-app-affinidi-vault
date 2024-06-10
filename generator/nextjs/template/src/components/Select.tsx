import React from "react";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
};

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      {label && <label className="block mb-1 ">{label}</label>}
      <select
        value={value}
        onChange={handleChange}
        className={`border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
