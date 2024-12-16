import styled from "styled-components";



export const CartContainer = styled.div`
    justify-content: center;
    width: 100%
    padding: 3px;
`;

export const DescriptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding-left: 2px;
    padding-bottom: 2px; 
    padding-top : 2px;
    font-size: 0.75rem; /* 12px */
    line-height: 1rem; /* 16px */
    div{
        display: flex;
        flex-direction: row;
        font-size: 0.75rem; /* 12px */
        line-height: 1rem; /* 16px */
        color: rgb(55 65 81);
        width: 50%;
        span{
            font-size: 0.75rem; /* 12px */
            line-height: 1rem; /* 16px */
            color: blue;
            padding-top: 2px;
        }
    }
`;



