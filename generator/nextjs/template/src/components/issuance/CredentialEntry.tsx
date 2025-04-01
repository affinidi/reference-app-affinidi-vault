import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "../core/Select";
import DynamicForm from "./DynamicForm";
import { CredentialSupportedObject } from "@affinidi-tdk/credential-issuance-client";
import { Trash } from "lucide-react";
import { CredentialEntryData } from "src/pages/credential-issuance";

interface CredentialEntryProps {
  index: number;
  credentialTypes: CredentialSupportedObject[];
  onRemove: () => void;
  onUpdate: (data: CredentialEntryData) => void;
  disabled: boolean;
}

const fetchCredentialSchema = async (jsonSchemaUrl: string) => {
  const response = await fetch(jsonSchemaUrl, {
    method: "GET",
  });
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
  const [typeId, setTypeId] = useState("");
  const [formData, setFormData] = useState<any>(null);

  const credentialType = credentialTypes.find(
    (c) => c.credentialTypeId === typeId
  );
  const schemaQuery = useQuery({
    queryKey: ["schema", typeId],
    queryFn: () => fetchCredentialSchema(credentialType?.jsonSchemaUrl!),
    enabled: !!credentialType,
  });

  const handleTypeChange = (value: string) => {
    setTypeId(value);
    setFormData(null);
    onUpdate({
      credentialTypeId: value,
      credentialData: {},
    } as CredentialEntryData);
  };

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    onUpdate({
      credentialTypeId: typeId,
      credentialData: data,
    } as CredentialEntryData);
  };

  return (
    <div className="mb-8 bg-white">
      <div className="flex justify-between items-center mb-4">
        {/* TODO: use schema title here */}
        <h2 className="text-xl font-semibold">Credential {index + 1}</h2>
        <button
          onClick={onRemove}
          type="button"
          className="text-black-500 hover:text-red-500"
        >
          <Trash className="w-5 h-5 " />
        </button>
      </div>

      <div className="mb-6">
        <Select
          id={`credential-type-${index}`}
          label="Credential Type (schema)"
          options={credentialTypes.map((type) => ({
            label: type.credentialTypeId,
            value: type.credentialTypeId,
          }))}
          value={typeId}
          onChange={(value) => handleTypeChange(value as string)}
          disabled={disabled}
        />
      </div>

      {schemaQuery.isFetching && (
        <p className="text-gray-500">Loading schema...</p>
      )}

      {schemaQuery.isSuccess &&
        schemaQuery.data?.properties?.credentialSubject && (
          <div>
            <p className="text-lg mb-4">Credential data</p>
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
