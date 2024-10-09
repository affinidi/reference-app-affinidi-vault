import { useState, useEffect } from "react";
import * as S from "./index.styled";
import { iotaConfigId, eventTicketQuery } from "src/lib/variables";
import useIotaQuery from "src/lib/hooks/useIotaQuery";
import { OpenMode } from "@affinidi-tdk/iota-browser";

const Verification = () => {
  const [eventTicketData, setEventTicketData] = useState();

  //React Custom Hook

  //Event Handler
  const handleShareTicket = () => {
    
      //Initiate Affinidi Iota request

  };

  return (
    <>
      <S.Wrapper>
        <S.TickerooTitle>🎟️ Tickeroo</S.TickerooTitle>
        <S.TickerooSubtitle>Ticket Verification Service</S.TickerooSubtitle>
        <S.Wrapper>
          {isInitializing && <>Loading....</>}
          {errorMessage && <>{errorMessage}</>}
        </S.Wrapper>
      </S.Wrapper>
      <S.BodyWrapper>
        {!eventTicketData && (
          <>
            <S.VerifyButton onClick={() => handleShareTicket()}>
              Start Ticket Verification
            </S.VerifyButton>
          </>
        )}
        {eventTicketData && (
          <>
            <S.TicketWrapper>
              <S.Ticket>
                <S.TicketInfo>
                  <S.TicketDate>
                    {
                      new Date(eventTicketData.event?.startDate)
                        .toISOString()
                        .split("T")[0]
                    }
                  </S.TicketDate>
                  <S.TicketTitle>{eventTicketData.event?.name}</S.TicketTitle>
                  <hr />
                  <S.AttendeeName>
                    {eventTicketData.attendeeAtrributes?.firstName}{" "}
                    {eventTicketData.attendeeAtrributes?.lastName}
                  </S.AttendeeName>
                  <S.TicketData>
                    1 x {eventTicketData.ticket?.seat}
                  </S.TicketData>
                </S.TicketInfo>
                <S.TicketStatus>✅ Verified</S.TicketStatus>
              </S.Ticket>
              <S.TicketRaw>
                {JSON.stringify(
                  dataRequest?.response?.verifiablePresentation,
                  null,
                  2
                )}
              </S.TicketRaw>
            </S.TicketWrapper>
            <S.ResetButton onClick={() => setEventTicketData(undefined)}>
              Reset
            </S.ResetButton>
          </>
        )}
      </S.BodyWrapper>
    </>
  );
};
export default Verification;
