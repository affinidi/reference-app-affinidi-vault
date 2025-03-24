import { useQuery } from "@tanstack/react-query";
import { CredentialSupportedObject } from "@affinidi-tdk/credential-issuance-client";
import { useEffect, useState } from "react";
import DynamicForm from "./DynamicForm";
import Select from "../core/Select";
import { NeutralIcon } from "../core/icons/NeutralIcon";
// import { Trash2 } from "react-feather";

interface CredentialEntryProps {
  index: number;
  credentialTypes: CredentialSupportedObject[];
  onRemove: () => void;
  onUpdate: (data: { typeId: string; formData: any }) => void;
  disabled: boolean;
}

const fetchCredentialSchema = async (jsonSchemaUrl: string) => {
  const response = await fetch(jsonSchemaUrl);
  const schema = await response.json();
  return schema;
};

export default function CredentialEntry({
  index,
  credentialTypes,
  onRemove,
  onUpdate,
  disabled,
}: CredentialEntryProps) {
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");

  const selectedCredentialType = credentialTypes.find(
    (type) => type.credentialTypeId === selectedTypeId
  );

  const schemaQuery = useQuery({
    queryKey: ["schema", selectedTypeId],
    queryFn: () =>
      selectedCredentialType
        ? fetchCredentialSchema(selectedCredentialType.jsonSchemaUrl)
        : Promise.resolve(undefined),
    enabled: !!selectedTypeId,
  });

  const handleFormSubmit = (formData: any) => {
    onUpdate({ typeId: selectedTypeId, formData });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Credential {index + 1}</h2>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="text-gray-500 hover:text-red-600"
        >
          <NeutralIcon />
        </button>
      </div>

      <Select
        id={`credentialType-${index}`}
        label="Credential Type (Schema)"
        options={credentialTypes.map((type) => ({
          label: type.credentialTypeId,
          value: type.credentialTypeId,
        }))}
        value={selectedTypeId}
        disabled={disabled}
        onChange={(val) => setSelectedTypeId(val as string)}
      />

      {selectedTypeId && schemaQuery.data?.properties?.credentialSubject && (
        <div className="pt-4">
          <p className="text-lg font-medium mb-2">Credential data</p>
          <DynamicForm
            schema={schemaQuery.data.properties.credentialSubject}
            onSubmit={handleFormSubmit}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
