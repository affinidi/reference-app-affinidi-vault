import { useState, useEffect } from "react";
import * as S from "../Checkout/index.styled";
import { iotaConfigId, eventTicketQuery } from "src/lib/variables";
import useIotaQuery from "src/lib/hooks/useIotaQuery";

const Verification = () => {
  const [eventTicketData, setEventTicketData] = useState();

  // const {
  //   isInitializing,
  //   statusMessage,
  //   handleInitiate,
  //   errorMessage,
  //   dataRequest,
  //   data: iotaRequestData,
  // } = useIotaQuery({ configurationId: iotaConfigId });

  // useEffect(() => {
  //   if (!iotaRequestData) return;
  //   //data for event ticket query
  //   const eventTicketData = iotaRequestData[eventTicketQuery];
  //   if (eventTicketData) {
  //     setEventTicketData(eventTicketData);
  //   }
  // }, [iotaRequestData]);

  const handleShareTicket = () => {
    //handleInitiate(eventTicketQuery);
  };

  return (
    <>
      {!eventTicketData && (
        <>
          <S.Wrapper style={{ fontSize: 42, marginTop: "2rem" }}>
            <button
              onClick={() => handleShareTicket()}
              className={`rounded text-white py-1  w-1/3`}
              style={{ backgroundColor: "#1F276F" }}
            >
              Click to Share Ticket Credential
            </button>
          </S.Wrapper>
        </>
      )}

      {eventTicketData && (
        <>
          <S.Wrapper
            style={{ color: "green", fontSize: 42, marginTop: "2rem" }}
          >
            Ticket is valid, Congrats!
            <button
              onClick={() => setEventTicketData(undefined)}
              className={`bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-black text-sm`}
            >
              Reset
            </button>
          </S.Wrapper>

          <div style={{ width: "50%", margin: "auto", marginTop: "1rem" }}>
            Below is your Ticket Details
            <pre>
              {JSON.stringify(
                dataRequest?.response?.verifiablePresentation,
                null,
                2
              )}
            </pre>
          </div>
        </>
      )}
    </>
  );
};
export default Verification;
