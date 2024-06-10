import { IssuanceConfigDto } from "@affinidi-tdk/credential-issuance-client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "src/components/Button";
import DynamicForm, { FormSchema } from "src/components/DynamicForm";
import Input from "src/components/Input";
import Message from "src/components/Message";
import Offer from "src/components/Offer";
import Select, { SelectOption } from "src/components/Select";
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

  const [formProperties, setFormProperties] = useState<FormSchema>();
  const [holderDid, setHolderDid] = useState<string>("");
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [offer, setOffer] = useState<OfferPayload>();
  const [credentialTypeId, setCredentialTypeId] = useState<string>("");
  const [message, setMessage] = useState<MessagePayload>();

  //Prefill did from session, if user is logged-in
  const { data: session } = useSession();
  useEffect(() => {
    if (!session || !session.user) return;
    setHolderDid(session.userId);
  }, [session]);

  const handleSubmit = async (credentialData: any) => {
    console.log(credentialData);
    if (!holderDid || !credentialTypeId) {
      setMessage({
        message: "Holder's DID and Credential Type ID are required",
        type: "error",
      });
      return;
    }
    console.log("credentialData:", credentialData);
    setIsFormDisabled(true);
    const response = await fetch("/api/credentials/issuance-start", {
      method: "POST",
      body: JSON.stringify({
        credentialData,
        credentialTypeId,
        holderDid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let dataResponse = await response.json();
    console.log("dataResponse", dataResponse);

    if (typeof dataResponse == "string") {
      dataResponse = JSON.parse(dataResponse);
    }

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

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Issue Credentials</h1>
      {offer && (
        <div>
          <Offer offer={offer}></Offer>
          <Button onClick={clearIssuance}>New issuance</Button>
        </div>
      )}
      {!offer && (
        <div>
          <Input
            label="Holder's DID (From Affinidi Login)"
            value={holderDid}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHolderDid(() => e.target.value)
            }
          />
          <Select
            label="Credential Type ID"
            options={credentialTypeOptions}
            value={credentialTypeId}
            onChange={handleCredentialTypeChange}
          />
          {message && (
            <div className="pt-4">
              <Message payload={message} />
            </div>
          )}

          {formProperties && (
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
