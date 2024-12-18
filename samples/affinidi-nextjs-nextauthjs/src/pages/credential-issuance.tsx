import {
  CredentialSupportedObject,
  StartIssuanceInputClaimModeEnum,
} from '@affinidi-tdk/credential-issuance-client';
import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Message from 'src/components/Message';
import Button from 'src/components/core/Button';
import Input from 'src/components/core/Input';
import Select, { SelectOption } from 'src/components/core/Select';
import DynamicForm from 'src/components/issuance/DynamicForm';
import Offer from 'src/components/issuance/Offer';
import { personalAccessTokenConfigured } from 'src/lib/env';
import { MessagePayload, OfferPayload } from 'src/types/types';

const claimModeOptions = [
  { value: StartIssuanceInputClaimModeEnum.FixedHolder },
  { value: StartIssuanceInputClaimModeEnum.TxCode },
];

const fetchCredentialSchema = async (jsonSchemaUrl: string) => {
  const response = await fetch(jsonSchemaUrl, {
    method: 'GET',
  });
  const schema = await response.json();
  return schema;
};

const fetchCredentialTypes = async (
  issuanceConfigurationId: string
): Promise<CredentialSupportedObject[]> => {
  const response = await fetch(
    '/api/issuance/credential-types?' +
      new URLSearchParams({ issuanceConfigurationId }),
    { method: 'GET' }
  );
  return await response.json();
};

const fetchIssuanceConfigurations = (): Promise<SelectOption[]> =>
  fetch('/api/issuance/configuration-options', { method: 'GET' }).then((res) =>
    res.json()
  );

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export default function CredentialIssuance({
  featureAvailable,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [formData, setFormData] = useState<{
    selectedConfigId: string;
    selectedTypeId: string;
  }>({ selectedConfigId: '', selectedTypeId: '' });
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [holderDid, setHolderDid] = useState<string>();
  const [offer, setOffer] = useState<OfferPayload>();
  const [message, setMessage] = useState<MessagePayload>();
  const [claimMode, setClaimMode] = useState<string>(
    StartIssuanceInputClaimModeEnum.FixedHolder
  );
  const [isRevocable, setRevocable] = useState(false);

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

  const configurationsQuery = useQuery({
    queryKey: ['issuanceConfigurations'],
    queryFn: fetchIssuanceConfigurations,
    enabled: !!featureAvailable,
  });

  const credentialTypesQuery = useQuery({
    queryKey: ['types', selectedConfigId],
    queryFn: ({ queryKey }) => fetchCredentialTypes(queryKey[1]),
    enabled: !!selectedConfigId,
  });

  const schemaQuery = useQuery({
    queryKey: ['schema', selectedTypeId],
    queryFn: () => {
      const credentialType = credentialTypesQuery.data?.find(
        (type) => type.credentialTypeId === selectedTypeId
      );
      if (!credentialType) {
        setMessage({
          message: 'Unable to fetch credential schema to build the form',
          type: 'error',
        });
        return;
      }

      return fetchCredentialSchema(credentialType.jsonSchemaUrl);
    },
    enabled: !!selectedTypeId,
  });

  const handleSubmit = async (credentialData: any) => {
    console.log('credentialData:', credentialData);
    if (
      !holderDid &&
      claimMode == StartIssuanceInputClaimModeEnum.FixedHolder
    ) {
      setMessage({
        message: 'Holder DID is required in FIXED_DID claim mode',
        type: 'error',
      });
      return;
    }
    setIsFormDisabled(true);
    const response = await fetch('/api/issuance/start', {
      method: 'POST',
      body: JSON.stringify({
        holderDid,
        credentialData,
        credentialTypeId: selectedTypeId,
        claimMode,
        isRevocable,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      clearIssuance();
      setMessage({
        message: 'Error creating offer',
        type: 'error',
      });
      return;
    }
    let dataResponse = await response.json();

    if (dataResponse.credentialOfferUri) {
      setOffer(dataResponse);
    }
    console.log('Offer', offer);
  };

  function clearIssuance() {
    setOffer(undefined);
    setIsFormDisabled(false);
    setMessage(undefined);
    setFormData({
      ...formData,
      selectedConfigId: '',
      selectedTypeId: '',
    });
    setRevocable(false);
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
        <Button id="newIssuance" onClick={clearIssuance}>
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
                    ? 'Holder DID (Prefiled from Affinidi Login)'
                    : 'Holder DID'
                }
                value={holderDid}
                required={
                  claimMode == StartIssuanceInputClaimModeEnum.FixedHolder
                }
                onChange={(e) => setHolderDid(e.target.value)}
              />
              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <p>
                    {' '}
                    Check box to make credential revocable (non-revocable by
                    default)
                  </p>
                  <input
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                    type="checkbox"
                    checked={isRevocable}
                    onChange={(e) => setRevocable(!isRevocable)}
                  />
                </label>
              </div>
              {configurationsQuery.isPending && (
                <div className="py-3">Loading configurations...</div>
              )}
              {configurationsQuery.isSuccess &&
                configurationsQuery.data.length === 0 && (
                  <div className="py-3">
                    You don&apos;t have any configurations. Go to the{' '}
                    <a
                      className="text-blue-500"
                      href="https://portal.affinidi.com"
                    >
                      Affinidi Portal
                    </a>{' '}
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
                    You don&apos;t have any credential types. Go to the{' '}
                    <a
                      className="text-blue-500"
                      href="https://portal.affinidi.com"
                    >
                      Affinidi Portal
                    </a>{' '}
                    to create one.
                  </div>
                )}
              {credentialTypesQuery.isSuccess &&
                !credentialTypesQuery.isFetching && (
                  <Select
                    id="credentialTypeId"
                    label="Credential Type (Schema)"
                    options={
                      credentialTypesQuery.data?.map(
                        (type: CredentialSupportedObject) => ({
                          label: type.credentialTypeId,
                          value: type.credentialTypeId,
                        })
                      ) || []
                    }
                    value={selectedTypeId}
                    disabled={isFormDisabled}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        selectedTypeId: value as string,
                      })
                    }
                  />
                )}
              {message && (
                <div className="pt-4">
                  <Message payload={message} />
                </div>
              )}
              {selectedConfigId &&
                schemaQuery.data?.properties.credentialSubject && (
                  <div>
                    <h1 className="text-xl font-semibold pb-6 pt-4">
                      Credential data
                    </h1>
                    <DynamicForm
                      schema={schemaQuery.data?.properties.credentialSubject}
                      onSubmit={handleSubmit}
                      disabled={
                        !selectedConfigId || !selectedTypeId || isFormDisabled
                      }
                    />
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
