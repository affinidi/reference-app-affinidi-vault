import { IssuanceConfigDtoCredentialSupportedInner } from "@affinidi-tdk/credential-issuance-client";
import { SelectOption } from "src/components/core/Select";

export const fetchCredentialSchema = async (jsonSchemaUrl: string) => {
  const response = await fetch(jsonSchemaUrl, {
    method: "GET",
  });
  const schema = await response.json();
  return schema;
};

export const fetchCredentialTypes = (
  issuanceConfigurationId: string
): Promise<void | IssuanceConfigDtoCredentialSupportedInner[]> =>
  fetch(
    "/api/issuance/credential-types?" +
      new URLSearchParams({ issuanceConfigurationId }),
    { method: "GET" }
  ).then((res) => res.json());

export const fetchIssuanceConfigurations = (): Promise<void | SelectOption[]> =>
  fetch("/api/issuance/configuration-options", { method: "GET" }).then((res) =>
    res.json()
  );
