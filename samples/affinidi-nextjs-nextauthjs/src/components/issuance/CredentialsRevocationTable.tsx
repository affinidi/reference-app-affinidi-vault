import {
  ChangeCredentialStatusInputChangeReasonEnum,
  FlowData,
  ListIssuanceRecordResponse,
} from '@affinidi-tdk/credential-issuance-client';
import React, { useState } from 'react';
import Button from '../core/Button';
import { UseQueryResult } from '@tanstack/react-query';

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
    ChangeCredentialStatusInputChangeReasonEnum | ''
  >('');
  const [selectedFlowDataRecord, setSelectedFlowDataRecord] =
    useState<FlowData>();

  const userFriendlyFormat = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      weekday: 'long', // e.g., "Wednesday"
      year: 'numeric', // e.g., "2024"
      month: 'long', // e.g., "December"
      day: 'numeric', // e.g., "18"
      hour: 'numeric', // e.g., "11 AM"
      minute: '2-digit', // e.g., "23"
    });
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
          'selectedFlowDataRecord.id',
          selectedReason,
          flowDataRecordsQuery
        );
        setIsModalOpen(false); // Close modal after submitting
        setSelectedReason(''); // Clear the input
      } catch (error) {
        console.error('Error revoking:', error);
        setHasError((error as any).message);
      } finally {
        if (hasError?.length === 0) setIsLoading(false); // Stop loading
        setSelectedReason('');
      }
    }
  };

  const renderModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
          <h2 className="text-xl mb-4">Select a reason for revocation</h2>
          {isLoading ? (
            hasError ? (
              <div className="flex items-center justify-center text-center text-red-500">
                <span>Error: {hasError}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-blue-500 border-t-transparent mr-2"></div>
                <span>Revoking...</span>
              </div>
            )
          ) : (
            <select
              className="border border-gray-300 p-2 w-full mb-4"
              value={selectedReason}
              onChange={(e) =>
                setSelectedReason(
                  e.target.value as ChangeCredentialStatusInputChangeReasonEnum
                )
              }
            >
              <option value="">Select Reason</option>
              {Object.values(ChangeCredentialStatusInputChangeReasonEnum).map(
                (reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                )
              )}
            </select>
          )}
          <div className="flex justify-between">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => {
                setIsModalOpen(false);
                setHasError(undefined);
                setIsLoading(false);
              }}
              disabled={isLoading && !hasError}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Revoke
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-center">Credential Type</th>
            <th className="border px-4 py-2 text-center">Issuance Date</th>
            <th className="border px-4 py-2 text-center">Actions</th>
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
      {isModalOpen && renderModal()}
    </>
  );
};

export default CredentialsRevocationTable;
