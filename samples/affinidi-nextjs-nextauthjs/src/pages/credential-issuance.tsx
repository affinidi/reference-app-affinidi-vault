import {
  IssuanceConfigDtoCredentialSupportedInner,
  StartIssuanceInputClaimModeEnum,
} from "@affinidi-tdk/credential-issuance-client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Message from "src/components/Message";
import Button from "src/components/core/Button";
import Select, { SelectOption } from "src/components/core/Select";
import DynamicForm, { FormSchema } from "src/components/issuance/DynamicForm";
import Offer from "src/components/issuance/Offer";
import { personalAccessTokenConfigured } from "src/lib/env";
import { MessagePayload, OfferPayload } from "src/types/types";

const claimModeOptions = [
  {
    value: StartIssuanceInputClaimModeEnum.Normal,
  },
  {
    value: StartIssuanceInputClaimModeEnum.TxCode,
  },
];

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export default function CredentialIssuance({
  featureAvailable,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [holderDid, setHolderDid] = useState<string>("");
  const [configOptions, setConfigOptions] = useState<SelectOption[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [types, setTypes] = useState<
    IssuanceConfigDtoCredentialSupportedInner[]
  >([]);
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [formProperties, setFormProperties] = useState<FormSchema>();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [offer, setOffer] = useState<OfferPayload>();
  const [message, setMessage] = useState<MessagePayload>();
  const [claimMode, setClaimMode] = useState<string>(
    StartIssuanceInputClaimModeEnum.TxCode,
  );

  // Prefill did from session
  const { data: session } = useSession();
  useEffect(() => {
    if (!session || !session.user) return;
    setHolderDid(session.userId);
  }, [session]);

  useEffect(() => {
    const initConfigurations = async () => {
      try {
        const response = await fetch("/api/issuance/configuration-options", {
          method: "GET",
        });
        const configurations = await response.json();
        console.log(configurations);
        setConfigOptions(configurations);
        if (configurations.length > 0) {
          handleConfigurationChange(configurations[0].value);
        }
      } catch (error) {
        console.error("Error getting issuance configurations:", error);
      }
    };
    if (featureAvailable) {
      initConfigurations();
    }
  }, []);

  async function handleConfigurationChange(value: string | number) {
    const configId = value as string;
    clearIssuance();
    setTypeOptions([]);
    setTypes([]);
    setSelectedConfig(configId);
    if (!configId) {
      return;
    }
    const response = await fetch(
      "/api/issuance/credential-types?" +
        new URLSearchParams({ issuanceConfigurationId: configId }),
      {
        method: "GET",
      },
    );
    const credentialTypes = await response.json();
    console.log(credentialTypes);
    const credentialTypeOptions = credentialTypes.map(
      (type: IssuanceConfigDtoCredentialSupportedInner) => ({
        label: type.credentialTypeId,
        value: type.credentialTypeId,
      }),
    );
    setTypes(credentialTypes);
    setTypeOptions(credentialTypeOptions);
  }

  async function handleCredentialTypeChange(value: string | number) {
    clearIssuance();
    setSelectedType(value as string);
    if (!value) {
      return;
    }
    const credentialType = types.find(
      (type) => type.credentialTypeId === value,
    );
    if (!credentialType) {
      setMessage({
        message: "Unable to fetch credential schema to build the form",
        type: "error",
      });
      return;
    }

    const response = await fetch(credentialType.jsonSchemaUrl, {
      method: "GET",
    });
    const schema = await response.json();
    console.log(schema);
    setFormProperties(schema.properties.credentialSubject);
    console.log(formProperties);
  }

  function handleClaimModeChange(value: string | number) {
    setClaimMode(value as string);
  }

  const handleSubmit = async (credentialData: any) => {
    console.log(credentialData);
    if (!selectedType) {
      setMessage({
        message: "Holder's DID and Credential Type ID are required",
        type: "error",
      });
      return;
    }
    console.log("credentialData:", credentialData);
    setIsFormDisabled(true);
    const response = await fetch("/api/issuance/start", {
      method: "POST",
      body: JSON.stringify({
        credentialData,
        credentialTypeId: selectedType,
        holderDid,
        claimMode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      clearIssuance();
      setMessage({
        message: "Error creating offer",
        type: "error",
      });
      return;
    }
    let dataResponse = await response.json();

    if (dataResponse.credentialOfferUri) {
      setOffer(dataResponse);
    }
    console.log("Offer", offer);
  };

  function clearIssuance() {
    setOffer(undefined);
    setIsFormDisabled(false);
    setMessage(undefined);
    setFormProperties(undefined);
    setSelectedType("");
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Issue Credentials</h1>

      {!featureAvailable && (
        <div>
          Feature not available. Please set your Personal Access Token in your
          environment secrets.
        </div>
      )}

      {featureAvailable && !holderDid && (
        <div>
          You must be logged in to issue credentials to your Affinidi Vault
        </div>
      )}

      {featureAvailable && holderDid && (
        <>
          <div className="pb-4">
            <p className="font-semibold">
              Verified holder did (From Affinidi Login)
            </p>
            <p>{holderDid}</p>
          </div>

          {offer && (
            <div>
              <Offer offer={offer}></Offer>
              <Button id="newIssuance" onClick={clearIssuance}>
                New issuance
              </Button>
            </div>
          )}

          {!offer && configOptions.length === 0 && (
            <div className="py-3">Loading configurations...</div>
          )}

          {!offer && configOptions.length > 0 && (
            <Select
              id="configurationIdSelect"
              label="Configuration"
              options={configOptions}
              value={selectedConfig}
              onChange={handleConfigurationChange}
            />
          )}

          {!offer && selectedConfig && (
            <div>
              <Select
                id="claimMode"
                label="Claim Mode"
                options={claimModeOptions}
                value={claimMode}
                disabled={isFormDisabled}
                onChange={handleClaimModeChange}
              />
              {typeOptions.length === 0 && (
                <div className="py-3">Loading credential types...</div>
              )}
              {typeOptions.length > 0 && (
                <Select
                  id="credentialTypeId"
                  label="Credential Type (Schema)"
                  options={typeOptions}
                  value={selectedType}
                  disabled={isFormDisabled}
                  onChange={handleCredentialTypeChange}
                />
              )}
              {message && (
                <div className="pt-4">
                  <Message payload={message} />
                </div>
              )}
              {formProperties && claimMode && (
                <div>
                  <h1 className="text-xl font-semibold pb-6 pt-4">
                    Credential data
                  </h1>
                  <DynamicForm
                    schema={formProperties}
                    onSubmit={handleSubmit}
                    disabled={isFormDisabled}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
