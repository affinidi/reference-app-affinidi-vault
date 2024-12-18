import { FlowData } from '@affinidi-tdk/credential-issuance-client';
import React, { useState, useEffect } from 'react';
import Button from '../core/Button';

interface PaginatedCredentialsTableProps {
  flowDataRecords: FlowData[];
  handleRevoke: (
    issuanceConfigurationId: string,
    issuanceFlowDataId: string,
    changeReason: string
  ) => void;
}

const PaginatedCredentialsTable: React.FC<PaginatedCredentialsTableProps> = ({
  flowDataRecords,
  handleRevoke,
}) => {
  // Track previous tokens for navigation

  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border px-4 py-2">Credential Type</th>
          <th className="border px-4 py-2">Issuance Date</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {flowDataRecords.map((flowDataRecord) => (
          <tr key={flowDataRecord.id}>
            <td className="border px-4 py-2">
              {flowDataRecord.credentialTypeId}
            </td>
            <td className="border px-4 py-2">{flowDataRecord.createdAt}</td>
            <td className="border px-4 py-2">
              <Button
                onClick={() => {
                  console.log(
                    `Handle Revoke: ${flowDataRecord.configurationId}, ${flowDataRecord.id}`
                  );
                  return handleRevoke(
                    flowDataRecord.configurationId!,
                    flowDataRecord.id,
                    'changeReason'
                  );
                }}
              >
                Revoke
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PaginatedCredentialsTable;
