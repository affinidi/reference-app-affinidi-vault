import { useContext, useEffect, useRef } from "react";
import {
  ConsumerContext,
  ConsumerInfoProps,
} from "src/lib/context/ConsumerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faGlobe,
  faPhone,
  faVenusMars,
  faMapMarkerAlt,
  faBuilding,
  faMapPin,
  faCertificate,
  faCalendar,
  faStar,
  faCakeCandles,
} from "@fortawesome/free-solid-svg-icons";
import * as S from "./index.styled";
import { iotaConfigId, addressIota } from "src/lib/variables";
import useIotaQuery from "src/lib/hooks/useIotaQuery";

const Profile = () => {
  const [consumer, storeConsumerInfo] = useContext(ConsumerContext);

  const {
    isInitializing,
    statusMessage,
    handleInitiate,
    errorMessage: errorMessage,
    data: iotaRequestData,
  } = useIotaQuery({ configurationId: iotaConfigId });

  useEffect(() => {
    if (!iotaRequestData) return;
    //data for address query
    const addressData = iotaRequestData[addressIota];
    if (addressData) {
      updateData({
        address:
          addressData.formatted ||
          addressData.streetAddress ||
          addressData.person?.addresses[0].streetAddress,
        postalCode:
          addressData.postalCode || addressData.person?.addresses[0].postalCode,
        country:
          addressData.country ||
          addressData.person?.addresses[0].addressCountry,
        city:
          addressData.locality ||
          addressData.person?.addresses[0].addressRegion,
      });
    }
  }, [iotaRequestData]);

  const handleAddressClick = () => {
    handleInitiate(addressIota);
  };

  const updateData = (data: any) => {
    const obj = "" + localStorage.getItem("consumerCurrentState");
    let userUpd: ConsumerInfoProps = JSON.parse(obj);
    const usernew = { ...userUpd?.user, ...data };
    storeConsumerInfo((prev) => ({
      ...prev,
      userId: prev.userId,
      user: usernew,
    }));
  };

  return (
    <S.Wrapper>
      <div>
        <S.ProfileContainer className="container mx-auto w-1/2">
          Manage your profile
        </S.ProfileContainer>
        {consumer.user?.givenName && (
          <>
            <S.ProfileTopContainer className="container mx-auto w-1/2">
              <div>
                <div className="mt-2 ">
                  {consumer.user?.givenName} {consumer.user?.middleName}
                  {consumer.user?.familyName}
                </div>
              </div>
              <span> Account Holder </span>
            </S.ProfileTopContainer>
          </>
        )}

        <S.CardInformation className="container mx-auto w-1/2">
          Profile Information
          <div className="p-1">
            <FontAwesomeIcon icon={faStar} className=" p-1" />
            &nbsp;&nbsp;DID: {consumer.userId}
          </div>
          {consumer.user?.email && (
            <div className="p-1">
              <FontAwesomeIcon icon={faEnvelope} className=" p-1" /> &nbsp;
              Email: {consumer.user?.email}
            </div>
          )}
          {consumer.user?.gender && (
            <div className="p-1">
              <FontAwesomeIcon icon={faVenusMars} className=" p-1" />
              &nbsp;&nbsp;Gender: {consumer.user?.gender}
            </div>
          )}
          {consumer.user?.birthdate && (
            <div className="p-1">
              <FontAwesomeIcon icon={faCakeCandles} className=" p-1" />
              &nbsp;&nbsp;Birthdate: {consumer.user?.birthdate}
            </div>
          )}
        </S.CardInformation>

        <S.CardInformation className="container mx-auto w-1/2">
          Contact Information
          {!consumer.user?.country && (
            <div className="p-1">
              <FontAwesomeIcon icon={faMapMarkerAlt} className=" p-1" />
              <a onClick={() => handleAddressClick()}>
                &nbsp;&nbsp; Update your location
              </a>
            </div>
          )}
          {consumer.user?.country && (
            <div className="p-1">
              <FontAwesomeIcon icon={faGlobe} className=" p-1" /> &nbsp;Country:
              {consumer.user?.country}
            </div>
          )}
          {consumer.user?.city && (
            <div className="p-1">
              <FontAwesomeIcon icon={faBuilding} className=" p-1" />
              &nbsp;&nbsp;City: {consumer.user?.city}
            </div>
          )}
          {consumer.user?.address && (
            <div className="p-1">
              <FontAwesomeIcon icon={faMapMarkerAlt} className=" p-1" />
              &nbsp;&nbsp;Address: {consumer.user?.address}
            </div>
          )}
          {consumer.user?.postalCode && (
            <div className="p-1">
              <FontAwesomeIcon icon={faMapPin} className=" p-1" />
              &nbsp;&nbsp;Postal Code: {consumer.user?.postalCode}
            </div>
          )}
        </S.CardInformation>
      </div>
    </S.Wrapper>
  );
};

export default Profile;
