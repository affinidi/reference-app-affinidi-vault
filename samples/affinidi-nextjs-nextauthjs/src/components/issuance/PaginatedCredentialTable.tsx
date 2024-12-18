import {
  FlowData,
  ListIssuanceRecordResponse,
} from '@affinidi-tdk/credential-issuance-client';
import React, { useState } from 'react';
import Button from '../core/Button';
import { UseQueryResult } from '@tanstack/react-query';

enum ChangeReasonEnum {
  INVALID_CREDENTIAL = 'INVALID_CREDENTIAL',
  COMPROMISED_ISSUER = 'COMPROMISED_ISSUER',
}

interface PaginatedCredentialsTableProps {
  handleRevoke: (
    issuanceConfigurationId: string,
    issuanceFlowDataId: string,
    changeReason: string,
    flowDataRecordsQuery: UseQueryResult<ListIssuanceRecordResponse, Error>
  ) => void;
  flowDataRecordsQuery: UseQueryResult<ListIssuanceRecordResponse, Error>;
}

const PaginatedCredentialsTable: React.FC<PaginatedCredentialsTableProps> = ({
  handleRevoke,
  flowDataRecordsQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedReason, setSelectedReason] = useState<ChangeReasonEnum | ''>(
    ''
  );
  const [selectedFlowDataRecord, setSelectedFlowDataRecord] =
    useState<FlowData>();
  const handleRevokeClick = (flowDataRecord: FlowData) => {
    setSelectedFlowDataRecord(flowDataRecord);
    setIsModalOpen(true);
  };
  const handleSubmit = () => {
    if (selectedFlowDataRecord && selectedReason) {
      handleRevoke(
        selectedFlowDataRecord.configurationId!,
        selectedFlowDataRecord.id,
        selectedReason,
        flowDataRecordsQuery
      );
      setIsModalOpen(false); // Close modal after submitting
      setSelectedReason(''); // Clear the input
    }
  };

  const renderModal = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
          <h2 className="text-xl mb-4">Select a reason for revocation</h2>
          <select
            className="border border-gray-300 p-2 w-full mb-4"
            value={selectedReason}
            onChange={(e) =>
              setSelectedReason(e.target.value as ChangeReasonEnum)
            }
          >
            <option value="">Select Reason</option>
            {Object.values(ChangeReasonEnum).map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          <div className="flex justify-between">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setIsModalOpen(false)} // Close modal
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSubmit} // Submit the reason
            >
              Submit
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
                <td className="border px-4 py-2">
                  {flowDataRecord.credentialTypeId}
                </td>
                <td className="border px-4 py-2">{flowDataRecord.createdAt}</td>
                <td className="border px-4 py-2">
                  {!flowDataRecord.statusListsDetails?.[0]?.isActive &&
                  flowDataRecord.statusListsDetails ? (
                    <Button
                      onClick={() => {
                        return handleRevokeClick(flowDataRecord);
                      }}
                    >
                      Revoke
                    </Button>
                  ) : (
                    <p>Credential is not Revocable</p>
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

export default PaginatedCredentialsTable;
