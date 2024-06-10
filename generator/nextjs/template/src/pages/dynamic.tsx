import React, { useState } from "react";
import Button from "src/components/Button";
import Input from "src/components/Input";

interface FieldProperties {
  title: string;
  description: string;
  type: "text" | "email" | "number" | "object";
  properties?: FieldProperties[]; // For nested fields
}

interface DynamicFormProps {
  properties: FieldProperties[];
  onSubmit: (formData: any) => void;
}

const App: React.FC = () => {
  const formSchema: FieldProperties[] = [
    { title: "firstName", description: "First Name", type: "text" },
    { title: "lastName", description: "Last Name", type: "text" },
    { title: "email", description: "Email", type: "email" },
    { title: "age", description: "Age", type: "number" },
    {
      title: "address",
      description: "Address",
      type: "object",
      properties: [
        { title: "street", description: "Street", type: "text" },
        { title: "city", description: "City", type: "text" },
        { title: "zip", description: "Zip", type: "text" },
      ],
    },
  ];

  const handleSubmit = (formData: any) => {
    console.log("Form submitted:", formData);
  };

  return (
    <div>
      <h1>Dynamic Form</h1>
      <DynamicForm properties={formSchema} onSubmit={handleSubmit} />
    </div>
  );
};

const DynamicForm: React.FC<DynamicFormProps> = ({ properties, onSubmit }) => {
  const initializeFormData = (schema: FieldProperties[]): any => {
    const initialState: any = {};
    schema.forEach((field) => {
      if (field.type === "object") {
        initialState[field.title] = initializeFormData(field.properties!);
      } else {
        initialState[field.title] = "";
      }
    });
    return initialState;
  };

  const [formData, setFormData] = useState<any>(() =>
    initializeFormData(properties)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string
  ) => {
    const { title, value } = e.target;
    setFormData((prevState: any) => {
      const updatedState = { ...prevState };
      const keys = path.split(".");
      let current = updatedState;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      });
      return updatedState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderFields = (
    schema: FieldProperties[],
    parentPath = ""
  ): JSX.Element[] => {
    return schema.map((field) => {
      const fieldPath = parentPath
        ? `${parentPath}.${field.title}`
        : field.title;
      if (field.type === "object") {
        return (
          <fieldset key={field.title} className="pl-8">
            <legend className="font-semibold py-4">{field.description}</legend>
            {renderFields(field.properties!, fieldPath)}
          </fieldset>
        );
      } else {
        return (
          <div key={fieldPath}>
            <Input
              id={fieldPath}
              type={field.type}
              label={field.description ?? field.title}
              value={getValue(formData, fieldPath)}
              onChange={(e) => handleChange(e, fieldPath)}
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

  return (
    <form onSubmit={handleSubmit}>
      {renderFields(properties)}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default App;
