import { ChangeCredentialStatusInputChangeReasonEnum } from "@affinidi-tdk/credential-issuance-client";

interface RevocationModalProps {
  isLoading: boolean;
  hasError?: string;
  selectedReason: ChangeCredentialStatusInputChangeReasonEnum | "";
  setSelectedReason: (
    reason: ChangeCredentialStatusInputChangeReasonEnum | ""
  ) => void;
  onClose: () => void;
  onSubmit: () => void;
}
const ChangeReasonModal: React.FC<RevocationModalProps> = ({
  isLoading,
  hasError,
  selectedReason,
  setSelectedReason,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        {!isLoading && (
          <h2 className="text-xl mb-4">Select a reason for revocation</h2>
        )}
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
        {(!isLoading || hasError) && (
          <div
            className={`${
              hasError ? "flex justify-center" : "flex justify-between"
            }`}
          >
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            {!hasError && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={onSubmit}
                disabled={hasError ? true : false}
              >
                Revoke
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default ChangeReasonModal;
