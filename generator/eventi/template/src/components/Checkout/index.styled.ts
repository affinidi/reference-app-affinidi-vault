import styled from "styled-components";
export const Wrapper =  styled.div`
    font-family: Figtree;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 30px;
    font-weight: 800;
    font-size: large;
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
font-size: medium;
border-color: rgb(156 163 175);
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
padding-left: 10px;
padding-right: 10px;
span{
    font-weight: normal;
    font-size: small;
    a{
        cursor: pointer; 
        color: blue;
    }
}
`;

export const PaymentContainerItem = styled.div`
font-size: small;
margin-left : 10px;
margin-right: 80px;
font-weight: 600;
line-height: 2;

`;
export const PaymentDetails = styled.div`
    background-color: rgb(248 250 252);
    padding: 1rem; /* 16px */
    margin-bottom: 15px;
    border-radius: 0.25rem; /* 4px */
    // width: 32rem; /* 320px */

`;
export const CaptchaContainer = styled.div`
border-color: rgb(212 212 216);
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
background-color: rgb(244 244 245);
border-width: 1px;
border-radius: 0.25rem; /* 4px */
padding-left: 8px;
padding-top: 6px;
padding-bottom: 6px;
padding-right: 6px;
margin-top: 10px;
margin-left: 8px;
width: 90%

`;

export const FormContainer = styled.div`

    background-color: rgb(248 250 252);
    padding: 1rem; /* 16px */
    margin-bottom: 15px;
    border-radius: 0.25rem; /* 4px */
    
    // width: 32rem; /* 320px */
    form{
        width: 32rem; /* 320px */
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
        span{
            font-size: large;
        }
        
    }
    label{
        font-size: medium;
    }
    input{
        font-size: small;
        border-radius: 0.25rem; /* 4px */
        padding: 0.5rem; /* 8px */
        margin-bottom: 0.75rem; /* 16px */
        border-width: 1px;
        background-color: rgb(226 232 240);
    }

`;

export const CardInformationTool = styled.span`
font-weight: normal;
font-size: 13px;
color: red;
padding-bottom: 12px;
a{
    cursor: pointer; 
    color: blue;
}
`;
export const CardInformationLink = styled.a`
font-weight: bold;
font-size: 16px;
color: black;
cursor: pointer; 
color: blue;

`;
export const CartContainer = styled.div`
display: flex;
flex-direction: column;
box-sizing: border-box;
align-items: center;
margin-right: auto; 
margin-left: auto;

`;
export const ItemContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
width: 50%;
`;
export const Title = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
margin-right: auto; 
margin-left: auto;
width: 100%;
padding-top: 5rem;
padding-left: 15rem;
`;

export const FormContainerCustom = styled.div`

    background-color: rgb(248 250 252);
    
    margin-bottom: 15px;
    border-radius: 0.25rem; /* 4px */
    
    width: 28rem; /* 320px */
    display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
    

`;

export const TopOptionsCustom = styled.div`
background-color: #fff;
font-weight: 500;
font-size: 14px;
padding-left: 10px;
padding-right: 10px;
span{
    font-weight: normal;
    font-size: small;
    a{
        cursor: pointer; 
        color: blue;
    }
}
`;

export const AffinidiVaultClaimButtonContainer = styled.div`
    margin-top: 20px;
`

export const AffinidiVaultClaimButton = styled.a`
border: 0;
    width: 228px;
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    object-fit: contain;
    border-radius: 48px;
    background: url('data:image/svg+xml,<svg aria-hidden="true" width="24px" color="white" focusable="false" data-prefix="fas" data-icon="icons" class="svg-inline--fa fa-icons text-[35px] mt-5 px-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M500.3 7.3C507.7 13.3 512 22.4 512 32V176c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V71L352 90.2V208c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V64c0-15.3 10.8-28.4 25.7-31.4l160-32c9.4-1.9 19.1 .6 26.6 6.6zM74.7 304l11.8-17.8c5.9-8.9 15.9-14.2 26.6-14.2h61.7c10.7 0 20.7 5.3 26.6 14.2L213.3 304H240c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V352c0-26.5 21.5-48 48-48H74.7zM192 408a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM478.7 278.3L440.3 368H496c6.7 0 12.6 4.1 15 10.4s.6 13.3-4.4 17.7l-128 112c-5.6 4.9-13.9 5.3-19.9 .9s-8.2-12.4-5.3-19.2L391.7 400H336c-6.7 0-12.6-4.1-15-10.4s-.6-13.3 4.4-17.7l128-112c5.6-4.9 13.9-5.3 19.9-.9s8.2 12.4 5.3 19.2zm-339-59.2c-6.5 6.5-17 6.5-23 0L19.9 119.2c-28-29-26.5-76.9 5-103.9c27-23.5 68.4-19 93.4 6.5l10 10.5 9.5-10.5c25-25.5 65.9-30 93.9-6.5c31 27 32.5 74.9 4.5 103.9l-96.4 99.9z"></path></svg>') no-repeat 20px center;
    background-color: #1F276F;
    color: #ffffff;
    padding-left: 40px;
    flex-grow: 0;
    font-family: Figtree;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: 0.6px;
`

export const ImgContainer = styled.img`
   display: inline-block;
   margin: 0 auto;
`;

export const CardInformation = styled.div`
display: flex;
flex-direction: column;
font-weight: bold;
font-size: 18px;
div{
    display: flex;
    flex-direction: row;
    font-weight: normal;
    font-size: 16px;
    margin-bottom: 20px;
    a{
        cursor: pointer; 
        color: blue;
    }
}
`;