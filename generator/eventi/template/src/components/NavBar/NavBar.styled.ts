import styled from "styled-components";


export const TopContainer = styled.div`
background-color:  #1C58FC;
padding-left: 3rem; /* 16px */
padding-right: 3rem; /* 16px */
color: white;
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
position: relative;
display: flex;
justify-content: center;
font-family: Figtree;
padding-bottom: 0.5rem;
`;

export const Spacer = styled.div`
padding: 0.25rem; /* 4px */
padding-left: 1rem; /* 16px */
padding-right: 1rem; /* 16px */
margin-right: auto; 
margin-left: auto;
`;

export const SearchBar = styled.div`
cursor: pointer; 
padding: 0.75rem; /* 12px */
    input{
        border-radius: 25px; /* 4px */
        border: 1px Solid transparent;
        background-color: rgb(255 255 255);
        color: #000;
        padding: 0.40rem; /* 8px */
        padding-left: 2rem; /* 32px */
        padding-right: 2.25rem; /* 36px */
        width: 24rem; /* 384px */
    }
`;
export const DeliveryBar = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 0.60rem;
    padding-right: 20px;
    margin-top: 0.5rem;
    font-size: 13px;
`;
export const DeliveryBarItem =  styled.div`
display: flex;
flex-direction: column;
padding-left: 8px;
line-height: 1.25;
`;
export const DeliveryBarItemLink =  styled.a`
font-weight: bold;
font-size: 15px;
cursor: pointer; 
`;
export const DeliveryBarItemSpan =  styled.span`
font-weight: bold;
font-size: 15px;
`;

export const LoginButton = styled.button`
order: 0;
    width: 175px;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    object-fit: contain;
    border-radius: 48px;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none"><path d="M3.22 20.281A11.966 11.966 0 0 0 11.904 24c3.415 0 6.498-1.428 8.683-3.719H3.219h.001zM20.588 6.762H1.106A11.933 11.933 0 0 0 0 10.48h20.588V6.762zM20.586 3.719A11.966 11.966 0 0 0 11.902 0 11.966 11.966 0 0 0 3.22 3.719h17.367zM20.588 13.521H0c.167 1.319.548 2.57 1.106 3.719h19.482v-3.718zM22.703 6.762c.558 1.148.94 2.4 1.106 3.718h4.78V6.762h-5.886z" fill="%23040822"/><path d="M28.586 20.281h-8V24h8V20.28zM22.703 17.24h5.886v-3.718h-4.78a11.93 11.93 0 0 1-1.106 3.718zM28.586 0h-8v3.719h8V0z" fill="%23040822"/><path d="M23.807 10.48A11.931 11.931 0 0 0 22.7 6.76a12.012 12.012 0 0 0-2.115-3.041v16.563A12.045 12.045 0 0 0 22.7 17.24 11.932 11.932 0 0 0 23.9 12c0-.516-.031-1.023-.094-1.522v.001z" fill="%231D58FC"/></svg>') no-repeat 20px center;
    background-color: #ffffff;
    color: #000;
    padding-left: 60px;

    flex-grow: 0;
    font-family: Figtree;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: 0.6px;
`;

export const ProfileContainer = styled.div`
order: 0;
    width: 100;
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    gap: 12px;
    padding: 12px 10px;
    object-fit: contain;
    border-radius: 48px;
    
    background-color: #ffffff;
    color: #000;
    padding-left: 20px;

    flex-grow: 0;
    font-family: Figtree;
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: 0.6px;
`;


export const LogOutContainer = styled.link`
justify-content: center;
align-items: center;
display: flex;
flex-direction: column;
position: fixed;
top: 0px;
left: 0px;
width: 100%;
height: 100%;
background-color: #1a202c;
margin-top: 0.25rem;
div{
    display: flex;
    flex-direction: row;
    font-size: 1.5rem; 
    color: #fff;
    font-weight: bold;
}

`;
export const SignupButton = styled.button`
order: 0;
    width: 90px;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    gap: 1px;
    padding: 10px 12px;
    object-fit: contain;
    border-radius: 48px;
    background-color: #ffffff;
    color: #000;
    flex-grow: 0;
    font-family: Figtree;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: 0.6px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    text-align: center;
`;
export const CartContainer = styled.button`
    display: flex;
    flex-direction: row;
    padding: 0.75rem;
    padding-right: 3rem;
    padding-left: 0.25rem;
    margin-right: -2rem;
    div{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1rem; 
        height: 1rem; 
        border-radius: 9999px;
        left: 0.5rem; /* 8px */
        top: -4px; /* 16px */
        background-color: #FF0000;
        p{
            color: rgb(255 255 255);
            font-size: 0.75rem; /* 12px */
            line-height: 1rem; /* 16px */
        }
    }
`;

export const Title = styled.a`
cursor: pointer; 
margin-top: -0.25rem;
// margin-left: 1rem;
// padding-left: 0.5rem; /* 48px */
padding-right: 1.75rem; /* 48px */
padding-top: 0.75rem; /* 12px */
align-items: left;
font-size: 1.30rem; /* 36px */
line-height: 2.5rem; /* 40px */
font-weight: bold;
`;
export const ProfileBar = styled.div`
display: flex;
flex-direction: row;
padding-top: 0.40rem;
padding-right: 40px;
margin-top: 0.5rem;
font-size: 13px;
margin-right: -2rem;
`;
export const ProfileBarItem = styled.div`
padding-left: 12px;
line-height: 1.75;
font-size: 15px;
`;
export const ProfileBarItemLink = styled.a`
font-weight: bold;
font-size: 11px;
cursor: pointer; 
`;
export const ProfileBarItemDiv = styled.div`
font-size: 18px;
padding-right: 0.5rem;
letter-spacing: 1px;
margin-left: 1rem;
`;

export const DropDownBar = styled.div`
position: absolute;
left: -80px;
padding-top: 0.5rem; /* 8px */
top: 2.2rem; /* 40px */
margin-top: 0.25rem; /* 4px */
padding-left: 8px;
z-index: 10;
align-items: left;
border-color: rgb(229 231 235);
background-color: rgb(255 255 255);
border-radius: 0.25rem; /* 4px */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
color: rgb(31 41 55);
width: 14rem; /* 144px */
display: flex;
flex-direction: column;
`;

export const DropDownItemCustom = styled.a`
cursor: pointer; 
line-height: 1.5rem; /* 16px */ 
color: black;
padding-left: 10px; /* 16px */
padding-right: 1rem; /* 16px */
padding-bottom: 0.5rem; /* 8px */
margin-top: 0.5rem;
font-size: 13px;
letter-spacing: 1px;
`;
export const LocationBar = styled.div`
display: flex;
flex-direction: row;
padding-top: 0.40rem;
padding-right: 24px;
margin-top: 0.5rem;
font-size: 13px;
`;
export const LocationDropDownBar = styled.div`
position: absolute;
left: -20px;
padding-top: 0.5rem; /* 8px */
padding-left: 8px;
top: 2.5rem; /* 40px */
margin-top: 0.25rem; /* 4px */
z-index: 5;
align-items: left;
border-color: rgb(229 231 235);
background-color: rgb(255 255 255);
border-radius: 0.25rem; /* 4px */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
width: 12rem; /* 144px */
display: flex;
flex-direction: column;
font-size: 12px;
color: black;
font-weight: 600;
line-height: 1.5rem; /* 16px */ 
`;

export const LocationDropDownItemCustom = styled.a`
cursor: pointer; 
font-size: 0.20rem; /* 12px */
line-height: 1.0rem; /* 16px */ 
color: blue;
padding-left: 3rem; /* 16px */
padding-bottom: 0.5rem; /* 8px */
margin-top: 0.5rem;
font-size: 10px;

`;

export const NavTabs = styled.div`
  color: #10375c;
  width: max-content;
  font-weight: 700;
  cursor: pointer;
  font-size: 16px;
  color: white;
  z-index: 100;
`