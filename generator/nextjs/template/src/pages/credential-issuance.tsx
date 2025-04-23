import {
  CredentialSupportedObject,
  StartIssuanceInputClaimModeEnum,
} from "@affinidi-tdk/credential-issuance-client";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState, useLayoutEffect } from "react";
import Message from "src/components/Message";
import Button from "src/components/core/Button";
import Input from "src/components/core/Input";
import Select, { SelectOption } from "src/components/core/Select";
import Offer from "src/components/issuance/Offer";
import { personalAccessTokenConfigured } from "src/lib/env";
import { MessagePayload, OfferPayload } from "src/types/types";
import { Alert, AlertTitle } from "src/components/core/inlinemessages";
import CredentialEntry from "src/components/issuance/CredentialEntry";
import { useRef } from "react";
import { Plus } from "lucide-react";
import dayjs from "dayjs";

export type CredentialEntryData = {
  credentialTypeId: string;
  credentialData: { [key: string]: any };
  schema?: any;
  statusListDetails?: [
    {
      purpose: string;
      standard: string;
    }
  ];
  metaData?: {
    expirationDate: string;
  };
};
const claimModeOptions = [
  { value: StartIssuanceInputClaimModeEnum.FixedHolder },
  { value: StartIssuanceInputClaimModeEnum.TxCode },
];

const fetchCredentialTypes = async (
  issuanceConfigurationId: string
): Promise<CredentialSupportedObject[]> => {
  const response = await fetch(
    "/api/issuance/credential-types?" +
      new URLSearchParams({ issuanceConfigurationId }),
    { method: "GET" }
  );
  return await response.json();
};

const fetchIssuanceConfigurations = (): Promise<SelectOption[]> =>
  fetch("/api/issuance/configuration-options", { method: "GET" }).then((res) =>
    res.json()
  );

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export function addMinutesFromNow(minutes: number): string {
  return dayjs().add(minutes, "minute").toISOString();
}
function isCredentialDataComplete(credentialData: any, schema: any): boolean {
  if (!schema || !schema.required || !credentialData) return false;
  return schema.required.every((field: string) => {
    const value = credentialData[field];
    return value !== undefined && value !== null && value !== "";
  });
}
export default function CredentialIssuance({
  featureAvailable,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [formData, setFormData] = useState<{
    selectedConfigId: string;
    selectedTypeId: string;
  }>({ selectedConfigId: "", selectedTypeId: "" });
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [holderDid, setHolderDid] = useState<string>("");
  const [offer, setOffer] = useState<OfferPayload>();
  const [message, setMessage] = useState<MessagePayload>();
  const [claimMode, setClaimMode] = useState<string>(
    StartIssuanceInputClaimModeEnum.FixedHolder
  );
  const [isRevocable, setRevocable] = useState(false);
  const [expirationInMinutes, setExpirationInMinutes] = useState(30);
  const [credentials, setCredentials] = useState<CredentialEntryData[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  // Prefill did from session
  const { data: session } = useSession();
  useEffect(() => {
    async function setUsersHolderDid() {
      if (session) {
        setHolderDid(session.userId);
      }
    }
    setUsersHolderDid();
  }, [session]);

  const { selectedConfigId, selectedTypeId } = formData;
  useEffect(() => {
    if (selectedConfigId && credentials.length === 0) {
      addCredential();
      setShouldScroll(true);
    }
  }, [selectedConfigId]);

  const configurationsQuery = useQuery({
    queryKey: ["issuanceConfigurations"],
    queryFn: fetchIssuanceConfigurations,
    enabled: !!featureAvailable,
  });
  const credentialTypesQuery = useQuery({
    queryKey: ["types", selectedConfigId],
    queryFn: ({ queryKey }) => fetchCredentialTypes(queryKey[1]),
    enabled: !!selectedConfigId,
  });
  useEffect(() => {
    if (shouldScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false);
    }
  }, [credentials, shouldScroll]);

  const addCredential = () => {
    if (credentials.length < 10) {
      setCredentials([
        ...credentials,
        { credentialTypeId: "", credentialData: {} },
      ]);
      setShouldScroll(true);
    }
  };
  const removeCredential = (index: number) => {
    const updated = [...credentials];
    updated.splice(index, 1);
    setCredentials(updated);
  };
  const updateCredential = (index: number, data: CredentialEntryData) => {
    const updated = [...credentials];
    updated[index] = data;
    setCredentials(updated);
  };
  const isAllCredentialsValid =
    credentials.length > 0 &&
    credentials.every(
      (cred) =>
        cred.credentialTypeId &&
        cred.credentialData &&
        isCredentialDataComplete(cred.credentialData, cred.schema)
    );
  const handleSubmit = async () => {
    if (
      !holderDid &&
      claimMode == StartIssuanceInputClaimModeEnum.FixedHolder
    ) {
      setMessage({
        message: "Holder DID is required in FIXED_DID claim mode",
        type: "error",
      });
      return;
    }
    const filled = credentials.filter(
      (c) => c.credentialTypeId && c.credentialData
    );

    if (credentials.length === 0 || filled.length !== credentials.length) {
      setMessage({
        message: "Please complete all credential entries before submitting.",
        type: "error",
      });
      return;
    }

    setIsFormDisabled(true);

    const response = await fetch("/api/issuance/start", {
      method: "POST",
      body: JSON.stringify({
        holderDid,
        claimMode,
        credentials: credentials.map(({ credentialData, credentialTypeId }) => {
          return {
            credentialTypeId,
            credentialData,
            metaData: {
              expirationDate: addMinutesFromNow(expirationInMinutes),
            },
            ...(isRevocable && {
              statusListDetails: [
                {
                  purpose: "REVOCABLE",
                  standard: "RevocationList2020",
                },
              ],
            }),
          };
        }),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      clearIssuance();
      setMessage({
        message: "Error in creating offer",
        type: "error",
      });
      return;
    }
    let dataResponse = await response.json();

    if (dataResponse.credentialOfferUri) {
      setOffer(dataResponse);
    }
  };

  function clearIssuance() {
    setOffer(undefined);
    setIsFormDisabled(false);
    setMessage(undefined);
    setFormData({
      ...formData,
      selectedConfigId: "",
      selectedTypeId: "",
    });
    setRevocable(false);
    setClaimMode(StartIssuanceInputClaimModeEnum.FixedHolder);
    setHolderDid(session?.userId || "");
    setCredentials([]);
    setExpirationInMinutes(30);
  }

  const hasErrors = !featureAvailable || !session || !session.userId;
  const renderErrors = () => {
    if (!featureAvailable) {
      return (
        <div>
          Feature not available. Please set your Personal Access Token in your
          environment secrets.
        </div>
      );
    }

    if (!session || !session.userId) {
      return (
        <div>
          You must be logged in to issue credentials to your Affinidi Vault
        </div>
      );
    }
  };

  const renderOffer = (offerTorender: OfferPayload) => {
    return (
      <div>
        <Offer offer={offerTorender}></Offer>
        <Button
          id="newIssuance"
          onClick={clearIssuance}
          type="button"
          className="button-quaternary_outlined"
        >
          New issuance
        </Button>
      </div>
    );
  };

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Issue Credentials</h1>
      {renderErrors()}
      {!hasErrors && (
        <div>
          {offer ? (
            renderOffer(offer)
          ) : (
            <div>
              <Select
                id="claimMode"
                label="Claim Mode"
                options={claimModeOptions}
                value={claimMode}
                disabled={isFormDisabled}
                onChange={(val) => setClaimMode(val as string)}
              />
              <Input
                id="did"
                label={
                  session
                    ? "Holder DID (Prefiled from Affinidi Login)"
                    : "Holder DID"
                }
                value={holderDid}
                required={
                  claimMode == StartIssuanceInputClaimModeEnum.FixedHolder
                }
                onChange={(e) => setHolderDid(e.target.value)}
              />
              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                    type="checkbox"
                    checked={isRevocable}
                    onChange={(e) => setRevocable(!isRevocable)}
                  />
                  <p> Make credential revocable (non-revocable by default)</p>
                </label>
              </div>
              {configurationsQuery.isPending && (
                <div className="py-3">Loading configurations...</div>
              )}
              {configurationsQuery.isSuccess &&
                configurationsQuery.data.length === 0 && (
                  <div className="py-3">
                    You don&apos;t have any configurations. Go to the{" "}
                    <a
                      className="text-blue-500"
                      href="https://portal.affinidi.com"
                    >
                      Affinidi Portal
                    </a>{" "}
                    to create one.
                  </div>
                )}
              {configurationsQuery.isSuccess &&
                configurationsQuery.data.length > 0 && (
                  <Select
                    id="configurationIdSelect"
                    label="Configuration"
                    options={configurationsQuery.data || []}
                    value={selectedConfigId}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        selectedConfigId: value as string,
                      })
                    }
                  />
                )}
              {credentialTypesQuery.isFetching && (
                <div className="pb-3">Loading credential types...</div>
              )}
              {credentialTypesQuery.isSuccess &&
                !credentialTypesQuery.isFetching &&
                credentialTypesQuery.data.length === 0 && (
                  <div className="py-3">
                    You don&apos;t have any credential types. Go to the{" "}
                    <a
                      className="text-blue-500"
                      href="https://portal.affinidi.com"
                    >
                      Affinidi Portal
                    </a>{" "}
                    to create one.
                  </div>
                )}
              <hr className="my-10 border-t border-gray-300" />
              <Alert state="neutral" className="mb-6">
                <AlertTitle>
                  Please note that you can issue up to 10 credentials at one
                  time.
                </AlertTitle>
              </Alert>
              {message && (
                <Alert state={message.type} className="mb-6">
                  <AlertTitle>{message.message}</AlertTitle>
                </Alert>
              )}
              {credentialTypesQuery.isSuccess &&
                !credentialTypesQuery.isFetching && (
                  <>
                    {credentials.map((cred, idx) => (
                      <CredentialEntry
                        key={idx}
                        index={idx}
                        credentialTypes={credentialTypesQuery.data}
                        onRemove={() => removeCredential(idx)}
                        onUpdate={(data) => updateCredential(idx, data)}
                        disabled={isFormDisabled}
                      />
                    ))}
                    <div ref={bottomRef} />
                    <div className="flex justify-start gap-4 items-center mt-6 mb-4 ">
                      <Button
                        onClick={addCredential}
                        disabled={credentials.length >= 10}
                        type="button"
                        className="button-quaternary_outlined"
                      >
                        <Plus /> Add new credential
                      </Button>
                    </div>
                    <div className="flex justify-start gap-4 items-center mt-6 mb-4 ">
                      <Button
                        onClick={handleSubmit}
                        disabled={isFormDisabled || !isAllCredentialsValid}
                        className="button-primary_outlined"
                      >
                        Submit
                      </Button>
                    </div>
                  </>
                )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
