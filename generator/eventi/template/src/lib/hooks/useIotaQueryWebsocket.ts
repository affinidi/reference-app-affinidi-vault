import { OpenMode, Session } from "@affinidi-tdk/iota-browser";
import { IotaCredentials } from "@affinidi-tdk/iota-core";
import { useEffect, useState } from "react";
import { IotaDataRequest, IotaRequestType } from "src/types/types";


async function getIotaCredentials(configurationId: string) {
  const response = await fetch(
    "/api/iota/start-websocket-flow?" +
    new URLSearchParams({
      iotaConfigurationId: configurationId,
    }),
    {
      method: "GET",
    }
  );
  return (await response.json()) as IotaCredentials;
}

export default function useIotaQueryWebsocket({ configurationId, openMode = OpenMode.Popup }: IotaRequestType) {

  const [isInitializing, setIsInitializing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>();
  const [isRequestPrepared, setRequestPrepared] = useState(false);
  const [isWaitingForResponse, setWaitingForResponse] = useState(false);
  const [iotaSession, setIotaSession] = useState<Session>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [dataRequest, setDataRequest] = useState<IotaDataRequest>(); // Data requests and responses
  const [data, setData] = useState<any>();

  const createIotaSession = async () => {
    try {
      if (iotaSession) {
        console.log("Iota session already exists");
        return iotaSession;
      }
      console.log("Creating Iota Session for configuration id ------- " + configurationId)
      const credentialResponse = await getIotaCredentials(configurationId);
      console.log("Received credentialResponse", credentialResponse);
      const session = new Session({ credentials: credentialResponse });
      await session.initialize();
      setIotaSession(session);
      return session;
    } catch (error) {
      setIotaSession(undefined);
      console.error("Error initializing Iota Session:", error);
    }
  };

  const handleInitiate = async (queryId: string) => {
    try {
      if (!queryId) {
        setErrorMessage('queryId is required to initiate Iota request');
        return;
      }

      setErrorMessage(undefined);
      setIsInitializing(true);
      setWaitingForResponse(true);
      setRequestPrepared(false);

      setStatusMessage("Fetching data from your vault. Please wait ! ")

      //1. Create Session
      const session = await createIotaSession();
      if (!session) {
        console.log("Could not create Iota Session")
        return;
      }

      //2. Creating Query 
      const request = await session.prepareRequest({ queryId });
      console.log('session.prepareRequest', request);
      setDataRequest((prevRequests) => ({
        ...prevRequests,
        request,
      }));
      setRequestPrepared(true);

      //3. Open User Vault and get Response
      request.openVault({ mode: openMode });

      const response = await request.getResponse();
      console.log('request.getResponse', response);

      if (!response) {
        setErrorMessage("IotaSession response error")
        return;
      }
      const allCrdentialSubjectArray = response.verifiablePresentation?.verifiableCredential?.map((vc) => vc.credentialSubject) || [];
      console.log(allCrdentialSubjectArray)
      const allCredentailSubject = Object.assign({}, ...allCrdentialSubjectArray);
      console.log(allCredentailSubject)
      setDataRequest((prevRequests) => ({
        ...prevRequests,
        response,
      }) as IotaDataRequest);
      const data = { [queryId]: allCredentailSubject };
      setData(data);

      setWaitingForResponse(false);
      setIsInitializing(false);

    } catch (error: any) {
      console.error("Error initializing Iota Session:", error);
      setErrorMessage("IotaSession response error: " + error.message)
      setStatusMessage("Iota Error")
    } finally {
      setIsInitializing(false);
      setWaitingForResponse(false);
      setRequestPrepared(false);
    }
  }

  useEffect(() => {
    console.log('configurationId', configurationId)
    if (!configurationId) {
      setErrorMessage("ConfigurationID missing")
      return;
    }
    //createIotaSession();
  }, [configurationId]);

  return {
    isInitializing,
    handleInitiate,
    errorMessage,
    dataRequest,
    data
  };
}
