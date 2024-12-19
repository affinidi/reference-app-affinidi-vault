import {
  FlowData,
  ListIssuanceRecordResponse,
} from "@affinidi-tdk/credential-issuance-client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { SelectOption } from "src/components/core/Select";
import CredentialsRevocationTable from "src/components/issuance/CredentialsRevocationTable";
import { personalAccessTokenConfigured } from "src/lib/env";

const fetchIssuanceDataRecords = async (
  issuanceConfigurationId: string,
  exclusiveStartKey?: string
): Promise<ListIssuanceRecordResponse> => {
  const response = await fetch(
    "/api/issuance/list-issuance-data-records?" +
      new URLSearchParams({
        issuanceConfigurationId,
        exclusiveStartKey: exclusiveStartKey!,
      }).toString(),
    { method: "GET" }
  );
  return await response.json();
};

const changeCredentialStatus = async (
  issuanceConfigurationId: string,
  issuanceRecordId: string,
  changeReason: string,
  flowDataRecordsQuery: UseQueryResult<ListIssuanceRecordResponse, Error>
): Promise<FlowData> => {
  const response = await fetch(
    "/api/issuance/change-credential-status?" +
      new URLSearchParams({ issuanceConfigurationId }),
    {
      method: "POST",
      body: JSON.stringify({ issuanceRecordId, changeReason }),
    }
  );

  if (response.status === 200) {
    const res = await response.json();
    flowDataRecordsQuery.refetch();
    return res;
  } else {
    throw Error(await response.text());
  }
};

const fetchIssuanceConfigurations = (): Promise<SelectOption[]> =>
  fetch("/api/issuance/configuration-options", { method: "GET" }).then((res) =>
    res.json()
  );

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export default function CredentialRevocation({
  featureAvailable,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [nextToken, setNextToken] = useState<string>();
  const [tokenStack, setTokenStack] = useState<string[]>([]);
  const { data: session } = useSession();

  const configurationsQuery = useQuery({
    queryKey: ["issuanceConfigurations"],
    queryFn: fetchIssuanceConfigurations,
    enabled: !!featureAvailable,
  });

  const configurationId = configurationsQuery.data?.[0]?.value as string;

  const flowDataRecordsQuery = useQuery({
    queryKey: ["flowDataRecords", configurationId, nextToken],
    queryFn: ({ queryKey }) => {
      const [, issuanceConfigurationId, exclusiveStartKey] = queryKey;
      return fetchIssuanceDataRecords(
        issuanceConfigurationId as string,
        exclusiveStartKey as string
      );
    },
    enabled: !!featureAvailable && !!configurationId,
  });

  const handleNextClick = async () => {
    if (flowDataRecordsQuery.data?.lastEvaluatedKey) {
      setNextToken(flowDataRecordsQuery.data?.lastEvaluatedKey);
      setTokenStack((prevStack) => [
        ...prevStack,
        flowDataRecordsQuery.data?.lastEvaluatedKey as string,
      ]);
    }
  };

  const handlePreviousClick = async () => {
    if (tokenStack.length > 1) {
      const previousToken = tokenStack[tokenStack.length - 2];
      setTokenStack((prevStack) => prevStack.slice(0, -1)); // Remove the last token
      setNextToken(previousToken);
    } else {
      setTokenStack((prevStack) => prevStack.slice(0, -1));
      setNextToken(undefined);
    }
  };
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

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Revoke Credentials</h1>
      {renderErrors()}
      {!hasErrors && (
        <div className="p-4">
          <h1 className="text-lg font-bold mb-4">Credentials</h1>
          {flowDataRecordsQuery.isPending && <p>Loading Credentials...</p>}
          {flowDataRecordsQuery.isSuccess &&
            flowDataRecordsQuery.data &&
            flowDataRecordsQuery.data.flowData && (
              <CredentialsRevocationTable
                handleRevoke={changeCredentialStatus}
                flowDataRecordsQuery={flowDataRecordsQuery}
              ></CredentialsRevocationTable>
            )}
          {
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePreviousClick}
                disabled={tokenStack.length < 1}
                className={`px-4 py-2 rounded ${
                  tokenStack.length < 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                disabled={!flowDataRecordsQuery.data?.lastEvaluatedKey}
                className={`px-4 py-2 rounded ${
                  !flowDataRecordsQuery.data?.lastEvaluatedKey
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          }
        </div>
      )}
    </>
  );
}
