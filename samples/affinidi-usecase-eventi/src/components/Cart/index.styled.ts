import styled from "styled-components";

export const Wrapper =  styled.div`
font-family: Figtree;
`;

export const CartContainer = styled.div`
display: flex;
flex-direction: column;
box-sizing: border-box;
align-items: center;
margin-right: auto; 
margin-left: auto;

`;
export const Title = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
margin-right: auto; 
margin-left: auto;
width: 100%;
padding-top: 1.5rem;
padding-left: 15rem;
`;
export const ItemContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
width: 50%;
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
border-bottom-color: rgb(243 244 246);
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
padding-left: 5px;
padding-right: 5px;
ol{
  display: flex;
  flex-wrap: wrap;
  li { 
    cursor: pointer; 
    font-weight: 400;
    font-size:  15px;
  }
}
`;

export const BannerDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
export const ProductDisplay = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
box-sizing: border-box;
align-items: center;
margin-right: auto; 
margin-left: auto;
padding: 5rem;
font-weight: bold;
color: #f56565;
`;