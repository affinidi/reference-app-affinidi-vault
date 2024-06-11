import {
  IssuanceConfigDto,
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
import {
  getConfigurationById,
  getConfigurations,
} from "src/lib/api/credential-issuance";
import { MessagePayload, OfferPayload } from "src/types/types";

export const getServerSideProps = (async () => {
  const configs = await getConfigurations();
  if (!configs.configurations.length) {
    return { props: { configDetails: undefined } };
  }
  const configDetails = await getConfigurationById(
    configs.configurations[0].id
  );
  return { props: { configDetails } };
}) satisfies GetServerSideProps<{
  configDetails: IssuanceConfigDto | undefined;
}>;

const claimModeOptions = [
  {
    value: StartIssuanceInputClaimModeEnum.Normal,
  },
  {
    value: StartIssuanceInputClaimModeEnum.TxCode,
  },
];

export default function CredentialIssuance({
  configDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Map available credential types
  let credentialTypeOptions: SelectOption[] = [];
  if (configDetails && configDetails.credentialSupported) {
    credentialTypeOptions = configDetails?.credentialSupported?.map(
      (credentialType) => ({
        label: credentialType.credentialTypeId,
        value: credentialType.credentialTypeId,
      })
    );
  }

  const [holderDid, setHolderDid] = useState<string>("");
  const [formProperties, setFormProperties] = useState<FormSchema>();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [offer, setOffer] = useState<OfferPayload>();
  const [credentialTypeId, setCredentialTypeId] = useState<string>("");
  const [message, setMessage] = useState<MessagePayload>();
  const [claimMode, setClaimMode] = useState<string>(
    StartIssuanceInputClaimModeEnum.TxCode
  );

  // Prefill did from session
  const { data: session } = useSession();
  useEffect(() => {
    if (!session || !session.user) return;
    setHolderDid(session.userId);
  }, [session]);

  const handleSubmit = async (credentialData: any) => {
    console.log(credentialData);
    if (!credentialTypeId) {
      setMessage({
        message: "Holder's DID and Credential Type ID are required",
        type: "error",
      });
      return;
    }
    console.log("credentialData:", credentialData);
    setIsFormDisabled(true);
    const response = await fetch("/api/issuance-start", {
      method: "POST",
      body: JSON.stringify({
        credentialData,
        credentialTypeId,
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
    setCredentialTypeId("");
  }

  async function handleCredentialTypeChange(value: string) {
    clearIssuance();
    setCredentialTypeId(value);
    if (!value) {
      return;
    }
    const credentialType = configDetails?.credentialSupported?.find(
      (type) => type.credentialTypeId === value
    );
    if (!credentialType) {
      setMessage({
        message: "Unable to fetch credential schema to build the form",
        type: "error",
      });
      return;
    }

    const response = await fetch(
      "/api/schema?" +
        new URLSearchParams({
          jsonSchemaUrl: credentialType.jsonSchemaUrl,
        }),
      {
        method: "GET",
      }
    );
    const schema = await response.json();
    console.log(schema);
    setFormProperties(schema.properties.credentialSubject);
    console.log(formProperties);
  }
  function handleClaimModeChange(value: string) {
    setClaimMode(value);
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Issue Credentials</h1>
      {!holderDid && (
        <div>
          You must be logged in to issue credentials to your Affinidi Vault
        </div>
      )}
      {holderDid && offer && (
        <div>
          <Offer offer={offer}></Offer>
          <Button id="newIssuance" onClick={clearIssuance}>
            New issuance
          </Button>
        </div>
      )}
      {holderDid && !offer && (
        <div>
          <div className="pb-4">
            <p className="font-semibold">
              Verified holder's did (From Affinidi Login)
            </p>
            <p>{holderDid}</p>
          </div>
          <Select
            id="credentialTypeId"
            label="Credential Type ID"
            options={credentialTypeOptions}
            value={credentialTypeId}
            disabled={isFormDisabled}
            onChange={handleCredentialTypeChange}
          />
          <Select
            id="claimMode"
            label="Claim Mode"
            options={claimModeOptions}
            value={claimMode}
            disabled={isFormDisabled}
            onChange={handleClaimModeChange}
          />
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
  );
}
