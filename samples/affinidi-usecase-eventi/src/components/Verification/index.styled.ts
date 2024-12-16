import styled from "styled-components";
export const Wrapper =  styled.div`
    font-family: "Bodoni Poster";
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 1rem;
`;

export const BodyWrapper = styled(Wrapper)`
    background-color: #FF7C8B;
    padding: 6rem;
`;

export const TickerooTitle = styled.h1`
    font-weight: 800;
    font-size: 64px;
    margin-top: 2rem;
`;

export const TickerooSubtitle = styled.h2`
    font-size: 28px;
    margin-bottom: 2rem;
    font-weight: bold;
`;

export const VerifyButton = styled.button`
    font-family: "Trebuchet MS";
    padding: 1rem 2rem;
    background-color: #FFD5DA;
    border-radius: .5rem;
    border: 1px solid #DC5666;
    box-shadow: 1px 1px 1px #ccc;
    text-shadow: 1px 1px 1px #ccc;
`;

export const ResetButton = styled.button`
    font-family: "Trebuchet MS";
    padding: .25rem 1rem;
    background-color: #FFD5DA;
    border-radius: .5rem;
    border: 1px solid #aaa;
    box-shadow: 1px 1px 1px #ccc;
    text-shadow: 1px 1px 1px #ccc;
`;

export const TicketWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const TicketRaw = styled.pre`
    padding: 1rem;
    margin: 1rem;
    width: 500px;
    height: 581px;
    overflow: scroll;
    background-color: #FF909D;
    border: 1px dashed #DC5666;
`;

export const Ticket = styled.div`
    margin: 0 auto;
    align-items: center;
    padding-top: 2rem;
    width: 400px;
    height: 581px;
    background-color: transparent;
    background-image: url('/images/ticket.svg');
    background-size: 100%;
    background-repeat: no-repeat;
`;

export const TicketInfo = styled.div`
    height: 350px;    
    padding: 1rem;
    margin: 1rem;
    // border: 1px dashed #ccc;
`;


export const TicketStatus = styled.div`
    height: 100px;    
    padding: 1rem;
    margin: 1rem;
    margin-top: 4rem;
    // border: 1px dashed #ccc;

    font-size: 2.8rem;
    text-align: center;
    font-family: "Trebuchet MS";
`;

export const TicketData = styled.p`
    font-family: "Trebuchet MS";
`;

export const TicketDate = styled(TicketData)`
    font-weight: bold;
`;

export const TicketTitle = styled(TicketData)`
    font-weight: bold;
    font-size: 2rem;
    margin: 1.5rem 0;
`;

export const AttendeeName = styled(TicketData)`
    font-size: 1.5rem;
    margin: .5rem 0;
`;