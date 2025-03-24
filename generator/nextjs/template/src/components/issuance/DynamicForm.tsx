import React, { useState } from "react";
import Button from "../core/Button";
import Input from "../core/Input";

interface SchemaProperty {
  title: string;
  type: string;
  description: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
}

export interface FormSchema {
  type: string;
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (formData: any) => void;
  disabled?: boolean;
  hideSubmitButton?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  onSubmit,
  disabled,
  hideSubmitButton = true,
}) => {
  const initializeFormData = (schema: FormSchema): any => {
    const initialState: any = {};
    Object.keys(schema.properties).forEach((key) => {
      const field = schema.properties[key];
      if (field.type === "object" && field.properties) {
        initialState[key] = initializeFormData({
          type: "object",
          properties: field.properties,
          required: field.required,
        });
      } else {
        initialState[key] = "";
      }
    });
    return initialState;
  };

  const [formData, setFormData] = useState<any>(() =>
    initializeFormData(schema)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? parseFloat(value) : value;
    setFormData((prevState: any) => {
      const updatedState = { ...prevState };
      const keys = path.split(".");
      let current = updatedState;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = newValue;
        } else {
          current = current[key];
        }
      });
      return updatedState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = removeEmptyFields(formData);
    onSubmit(cleanedData);
  };

  const renderFields = (schema: FormSchema, parentPath = ""): JSX.Element[] => {
    return Object.keys(schema.properties).map((key) => {
      const field = schema.properties[key];
      const fieldPath = parentPath ? `${parentPath}.${key}` : key;
      const isRequired = schema.required?.includes(key) || false;

      if (field.type === "object" && field.properties) {
        return (
          <fieldset
            key={field.title}
            className="pl-4 pr-4 py-4 border rounded-md mb-2"
          >
            <p className="font-semibold text-lg pb-2">
              {field.description ? field.description : key}
            </p>
            {renderFields(
              {
                type: "object",
                properties: field.properties,
                required: field.required,
              },
              fieldPath
            )}
          </fieldset>
        );
      } else {
        return (
          <div key={fieldPath}>
            <Input
              type={field.type}
              label={field.description ? field.description : key}
              id={fieldPath}
              value={getValue(formData, fieldPath)}
              onChange={(e) => handleChange(e, fieldPath)}
              required={isRequired}
              disabled={disabled}
            />
          </div>
        );
      }
    });
  };

  const getValue = (data: any, path: string): any => {
    const keys = path.split(".");
    return keys.reduce((acc, key) => acc[key], data);
  };

  const removeEmptyFields = (data: any): any => {
    if (typeof data !== "object" || data === null) {
      return data;
    }

    const newData: any = Array.isArray(data) ? [] : {};

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (typeof value === "object" && value !== null) {
        const cleanedValue = removeEmptyFields(value);
        if (Object.keys(cleanedValue).length > 0) {
          newData[key] = cleanedValue;
        }
      } else if (value !== "") {
        newData[key] = value;
      }
    });

    return newData;
  };

  return (
    <form id="dynamicForm" onSubmit={handleSubmit}>
      {renderFields(schema)}
      {!hideSubmitButton && (
        <Button
          id="dynamicFormSubmit"
          disabled={disabled}
          type="submit"
          className="mt-4"
        >
          Submit
        </Button>
      )}
    </form>
  );
};

export default DynamicForm;
