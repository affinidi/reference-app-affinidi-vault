import styled from "styled-components";
export const Wrapper =  styled.div`
font-family: Figtree;
`;
export const ProfileBar = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 0.40rem;
    padding-right: 40px;
    margin-top: 0.5rem;
    font-size: 13px;
    div{
        display: flex;
        flex-direction: column;
        padding-left: 8px;
        line-height: 1.25;
        font-size: 15px;
        a{
            font-weight: bold;
            font-size: 15px;
            cursor: pointer; 
        }
        span{
            font-weight: bold;
            font-size: 15px;
            padding-right: 8px;
        }
    }
    input{
        border-radius: 0.25rem; /* 4px */
        background-color: rgb(255 255 255);
        padding: 0.5rem; /* 8px */
        padding-left: 2rem; /* 32px */
        padding-right: 2.25rem; /* 36px */
        width: 24rem; /* 384px */
    }
`;

export const ProfileTopContainer = styled.div`
display: flex;
flex-direction: column;
border-radius: 0.25rem; /* 4px */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
font-weight: bold;
font-size: 24px;
padding: 20px;
a{
    cursor: pointer; 
    color: blue;
    font-weight: normal;
    font-size: 15px;
}
div{
    display: flex;
    flex-direction: row;
    a{
        cursor: pointer; 
        color: gray;
        font-weight: normal;
        font-size: 11px;
    }
}
span{
    font-weight: normal;
    font-size: 16px;
    color: gray;
    padding-top: 12px;
}
`;

export const ProfileContainer = styled.div`

display: flex;
flex-direction: column;
font-weight: bold;
font-size: 22px;
padding: 20px;
   `;

export const CardInformation = styled.div`
display: flex;
flex-direction: column;
border-radius: 0.25rem; /* 4px */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
font-weight: bold;
font-size: 18px;
padding: 20px;
div{
    display: flex;
    flex-direction: row;
    font-weight: normal;
    font-size: 16px;
    padding-top: 12px;
    a{
        cursor: pointer; 
        color: blue;
    }
}
`;