import styled from "styled-components";
export const Wrapper =  styled.div`
    font-family: Figtree;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 30px;
`;
export const TopOptionsContainer = styled.div`
height: 1px;
border-bottom-width: 2px;
border-bottom-color: rgb(156 163 175);
`;
export const TopOptions = styled.div`
background-color: #fff;
border-bottom-width: 1px;
padding: 0.5rem;
font-weight: 500;
font-size: large;
border-color: rgb(156 163 175);
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
padding-left: 10px;
padding-right: 10px;
font-size: large;
span{
    font-weight: normal;
    font-size: small;
    a{
        cursor: pointer; 
        color: blue;
    }
}
`;
export const FormContainer = styled.div`

    background-color: rgb(248 250 252);
    padding: 1rem; /* 16px */
    margin-bottom: 15px;
    border-radius: 0.25rem; /* 4px */
    
    width: 20rem; /* 320px */
    form{
        label{
            font-size: medium;
        }
        input{
            font-size: small;
            width: 100%;
            border-radius: 0.25rem; /* 4px */
            padding: 0.5rem; /* 8px */
            margin-bottom: 0.75rem; /* 16px */
            border-width: 1px;
            background-color: rgb(226 232 240);
        }
    }

`;
