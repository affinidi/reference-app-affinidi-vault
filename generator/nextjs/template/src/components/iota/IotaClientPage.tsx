import { IotaRequest, IotaResponse, Session } from "@affinidi-tdk/iota-browser";
import { IotaCredentials } from "@affinidi-tdk/iota-utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "../core/Button";

export default function IotaSessionMultipleRequestsPage() {
  const [holderDid, setHolderDid] = useState<string>("");
  const [iotaResponses, setIotaResponses] = useState<IotaResponse[]>([]);
  const [iotaSession, setIotaSession] = useState<Session>();
  const [iotaIsInitializing, setIotaIsInitializing] = useState(true);
  const [iotaRequests, setIotaRequests] = useState<IotaRequest[]>([]);

  // Prefill did from session
  const { data: session } = useSession();
  useEffect(() => {
    if (!session || !session.user) return;
    setHolderDid(session.userId);
  }, [session]);

  useEffect(() => {
    const initIota = async () => {
      try {
        const response = await fetch(`/api/iota-start`, {
          method: "GET",
        });
        const credentials = (await response.json()) as IotaCredentials;
        const iotaSession = new Session({ credentials });
        await iotaSession.initialize();
        setIotaSession(iotaSession);
      } catch (error) {
        console.error("Error initializing IotaChannelProvider:", error);
      } finally {
        setIotaIsInitializing(false);
      }
    };
    initIota();
  }, []);

  async function handleTDKShare(queryId: string) {
    if (!iotaSession) {
      throw new Error("IotaSession not initialized");
    }

    const request = await iotaSession.prepareRequest({ queryId });
    setIotaRequests((prevArray) => [...prevArray, request]);
    request.openVault();
    const response = await request.getResponse();
    setIotaResponses((prevArray) => [...prevArray, response]);
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Receive Credentials</h1>
      {!holderDid && (
        <div>
          You must be logged in to share credentials from your Affinidi Vault
        </div>
      )}
      {holderDid && (
        <div>
          <div className="pb-4">
            <p className="font-semibold">
              Verified holder's did (From Affinidi Login)
            </p>
            <p>{holderDid}</p>
          </div>
          {iotaSession && (
            <Button
              onClick={() => handleTDKShare(process.env.NEXT_PUBLIC_QUERY_ID!)}
            >
              Share
            </Button>
          )}
          {iotaIsInitializing && (
            <div>Initializing channel with Affinidi Iota Framework...</div>
          )}
          {!iotaIsInitializing && !iotaSession && (
            <div>Failed to initialize Iota</div>
          )}
          {iotaRequests.length > 0 && (
            <div>
              <p style={{ fontWeight: "bold" }}>Requests:</p>
              {iotaRequests.map((request) => (
                <p key={request.correlationId}>{request.correlationId}</p>
              ))}
            </div>
          )}
          {iotaResponses.length > 0 && (
            <div>
              <p style={{ fontWeight: "bold" }}>Responses:</p>
              {iotaResponses.map((response) => (
                <p key={response.correlationId}>
                  {response.correlationId}:{" "}
                  {JSON.stringify(
                    response.vpToken.verifiableCredential[0].credentialSubject
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
