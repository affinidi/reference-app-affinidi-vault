import {
  ChangeCredentialStatusInputChangeReasonEnum,
  FlowData,
  ListIssuanceRecordResponse,
} from "@affinidi-tdk/credential-issuance-client";
import React, { useState } from "react";
import ChangeReasonModal from "./ChangeReasonModal";
import { UseQueryResult } from "@tanstack/react-query";
import Button from "../core/Button";

interface PaginatedCredentialsTableProps {
  handleRevoke: (
    issuanceConfigurationId: string,
    issuanceRecordId: string,
    changeReason: string,
    flowDataRecordsQuery: UseQueryResult<ListIssuanceRecordResponse, Error>
  ) => Promise<FlowData>;
  flowDataRecordsQuery: UseQueryResult<ListIssuanceRecordResponse, Error>;
}

const CredentialsRevocationTable: React.FC<PaginatedCredentialsTableProps> = ({
  handleRevoke,
  flowDataRecordsQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string>();
  const [selectedReason, setSelectedReason] = useState<
    ChangeCredentialStatusInputChangeReasonEnum | ""
  >("");
  const [selectedFlowDataRecord, setSelectedFlowDataRecord] =
    useState<FlowData>();

  const userFriendlyFormat = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toISOString();
  };

  const handleRevokeClick = (flowDataRecord: FlowData) => {
    setSelectedFlowDataRecord(flowDataRecord);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (selectedFlowDataRecord && selectedReason) {
      setIsLoading(true);
      try {
        await handleRevoke(
          selectedFlowDataRecord.configurationId!,
          selectedFlowDataRecord.id,
          selectedReason,
          flowDataRecordsQuery
        );
        setIsModalOpen(false); // Close modal after submitting
        setSelectedReason(""); // Clear the input
      } catch (error) {
        console.error("Error revoking:", error);
        setHasError((error as any).message);
      } finally {
        if (hasError?.length === 0) setIsLoading(false); // Stop loading
        setSelectedReason("");
      }
    }
  };

  return (
    <>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-center">Credential Type</th>
            <th className="border px-4 py-2 text-center">Issuance Date</th>
            <th className="border px-4 py-2 text-center">Actions/Status</th>
          </tr>
        </thead>
        <tbody>
          {flowDataRecordsQuery.data?.flowData?.map(
            (flowDataRecord: FlowData) => (
              <tr key={flowDataRecord.id}>
                <td className="border px-4 py-2 text-center">
                  {flowDataRecord.credentialTypeId}
                </td>
                <td className="border px-4 py-2 text-center">
                  {userFriendlyFormat(flowDataRecord.createdAt)}
                </td>
                <td className="border px-4 py-2 text-center">
                  {!flowDataRecord.statusListsDetails?.[0]?.isActive &&
                  flowDataRecord.statusListsDetails ? (
                    <Button
                      onClick={() => {
                        return handleRevokeClick(flowDataRecord);
                      }}
                    >
                      Revoke
                    </Button>
                  ) : !flowDataRecord.statusListsDetails?.[0]?.isActive ? (
                    <p>Credential is not Revocable</p>
                  ) : (
                    <p>Revoked credential</p>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <ChangeReasonModal
          isLoading={isLoading}
          hasError={hasError}
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setHasError(undefined);
            setIsLoading(false);
          }}
        />
      )}
    </>
  );
};

export default CredentialsRevocationTable;
