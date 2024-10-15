import styled from "styled-components";

export const Wrapper =  styled.div`
font-family: Figtree;
`;

export const TopOptionsContainer = styled.div`

display: flex;
flex-direction: row;
font-size: 13px;
align-items: center;
justify-content: center;
background-color: rgb(226, 67, 40);
color: white;
letter-spacing: 2px;
margin-top:2px;
padding: 8px;
border-bottom-width: 0px;
border-bottom-color: rgb(156 163 175);
cursor:pointer;
`;
export const TopOptionsContainerLink = styled.div`
cursor: pointer; 
color: blue;
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
letter-spacing: 1px;
ol{
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
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
  flex-direction: row;
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

export const LoginButton = styled.button`
    border: 0;
    width: 188px;
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 30 24" fill="none"><path d="M3.927 20.281A11.966 11.966 0 0 0 12.61 24c3.416 0 6.499-1.428 8.684-3.719H3.926h.001zM21.295 6.762H1.813A11.933 11.933 0 0 0 .707 10.48h20.588V6.762zM21.293 3.719A11.967 11.967 0 0 0 12.609 0a11.966 11.966 0 0 0-8.683 3.719h17.367zM21.295 13.521H.707c.167 1.319.548 2.57 1.106 3.719h19.482v-3.718zM23.41 6.762c.558 1.148.94 2.4 1.106 3.718h4.78V6.762H23.41z" fill="%23fff"/><path d="M29.293 20.281h-8V24h8V20.28zM23.41 17.24h5.886v-3.718h-4.78a11.933 11.933 0 0 1-1.106 3.718zM29.293 0h-8v3.719h8V0z" fill="%23fff"/><path d="M24.514 10.48a11.934 11.934 0 0 0-1.106-3.72 12.017 12.017 0 0 0-2.115-3.041v16.563a12.05 12.05 0 0 0 2.115-3.042 11.935 11.935 0 0 0 1.2-5.24c0-.516-.031-1.023-.094-1.522v.001z" fill="%23040822"/></svg>') no-repeat 20px center;
    background-color: #1d58fc;
    color: #ffffff;
    padding-left: 60px;

    flex-grow: 0;
    font-family: Figtree;
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: 0.6px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 20px;
`;

export const HomeBanner = styled.div`

display: flex;
flex-direction: column;
font-weight: bold;
font-size: 32px;
text-align: left;
margin-top: 50%;
   `;

export const BannerContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-40%, -50%);
  width: 80%;
`

export const BannerImgContainer = styled.img`
   display: inline-block;
`;

export const BannerRecoWrapper = styled.div`
  background-image: url("/images/banner-reco.png");
  height: 646px;
  background-position: top center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
`

export const AffinidiIotaButtonContainer = styled.div`
    margin-top: 20px;
`

export const AffinidiIotaButton = styled.button`
border: 0;
    width: auto;
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
    padding-left: 60px;
    flex-grow: 0;
    font-family: Figtree;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: 0.6px;
`

export const recommendedTag = styled.span`
  text-transform: uppercase;
  font-size: 8px;
  background-color: #279AF1;
  padding: 4px 10px;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 500;
`