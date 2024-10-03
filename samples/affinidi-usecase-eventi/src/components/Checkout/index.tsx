import { useState, useContext, useEffect, useRef } from "react";
import {
  ConsumerContext,
  ConsumerInfoProps,
} from "src/lib/context/ConsumerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faMoneyBill,
  faTicket,
  faQrcode,
  faX,
  faShieldHeart,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../atoms/ConfirmationModal";
import * as S from "./index.styled";
import { useCartContext } from "src/lib/context/CartContext";
import { StartIssuanceInputClaimModeEnum } from "@affinidi-tdk/credential-issuance-client";
import { VaultUtils } from "@affinidi-tdk/common";
import { useRouter } from "next/router";
import { GeoContext } from "src/lib/context/GeoContext";
import { getGeoSpecificPrice } from "src/lib/utils/shop-utils";

type handleResponse = {
  credentialOfferUri: string;
  expiresIn: number;
  issuanceId: string;
  txCode: string;
};

const Checkout = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeliveryAddress, setShowDeliveryAddress] = useState(false);
  const [checkDeliveryAddress, setCheckDeliveryAddress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [consumer, storeConsumerInfo] = useContext(ConsumerContext);
  const router = useRouter();
  const { items, removeItem } = useCartContext();
  const [geo] = useContext(GeoContext);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [issuanceResponse, setIssuanceResponse] = useState<handleResponse>();
  const [vaultLink, setVaultLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  const getUndiscountedPrice = () => {
    const sumTotal = items.reduce((sum, item) => {
      let itemPrice = Number(
        getGeoSpecificPrice(item.product.price, geo.currencyRate, false)
      );
      itemPrice = itemPrice * item.quantity;
      sum = sum + itemPrice;
      return sum;
    }, 0);

    return Number(sumTotal.toFixed(2));
  };

  const getTotalDiscount = () => {
    if (!consumer.user?.verified) {
      return Number(0).toFixed(2);
    }
    return Number(getUndiscountedPrice() - getTotalPrice()).toFixed(2);
  };

  const getTotalPrice = () => {
    const sumTotal = items.reduce((sum, item) => {
      let itemPrice = Number(
        getGeoSpecificPrice(
          item.product.price,
          geo.currencyRate,
          consumer.user?.verified
        )
      );
      itemPrice = itemPrice * item.quantity;
      sum = sum + itemPrice;
      return sum;
    }, 0);

    return Number(sumTotal.toFixed(2));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowDeliveryAddress(true);
  };

  const handlePaymentMethodChange = (e: any) => {
    if (e.target.value == "cash") {
      if (!consumer.user?.verified) {
        setPaymentMethod("");
      } else {
        setPaymentMethod(e.target.value);
      }
    } else {
      setPaymentMethod(e.target.value);
    }
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    router.push("/");
  };

  const handleCheck = () => {
    if (checkDeliveryAddress) {
      setDeliveryAddress("");
      setCheckDeliveryAddress(false);
    } else {
      if (consumer.user?.address) {
        setDeliveryAddress(
          consumer.user?.address +
            ", " +
            consumer.user?.city +
            ", " +
            consumer.user?.country +
            ", " +
            consumer.user?.postalCode
        );
      }
      setCheckDeliveryAddress(true);
    }
  };

  const handlePay = () => {
    console.log("check" + consumer.user?.verified);
    date.setDate(date.getDate() + 3);
    setShowOrderConfirmation(true);
    IssueDigitalInvoice();
  };

  // Issue a Event Verifiable Credentail by calling Application Backend API
  const IssueDigitalInvoice = async () => {
    setIsLoading(true);

    const orderCrendentialData = {
      event: items.map((item: any) => {
        return {
          eventId: item.product.itemid?.toString(),
          name: item.product.name,
          location: item.product.location,
          startDate: item.product.startDate,
          endDate: item.product.endDate,
        };
      })[0],
      ticket: items.map((item: any) => {
        return {
          ticketId: item.product.itemid?.toString(),
          ticketType: item.product.name,
          seat: item.product.description,
        };
      })[0],
      createdAt: date,
      attendeeAtrributes: {
        email: consumer.user.email,
        firstName: consumer.user.givenName,
        lastName: consumer.user.familyName,
        dateOfBirth: consumer.user.birthdate,
      },
      secrete: date,
    };

    const response = await fetch("/api/issuance/start", {
      method: "POST",
      body: JSON.stringify({
        credentialData: orderCrendentialData,
        credentialTypeId: "EventTicketVC",
        claimMode: StartIssuanceInputClaimModeEnum.FixedHolder,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log("Error in issuing credential");
      return;
    }

    let dataResponse = await response.json();
    console.log("dataResponse", dataResponse);

    setIsLoading(false);
    if (dataResponse.credentialOfferUri) {
      const vaultLink = VaultUtils.buildClaimLink(
        dataResponse.credentialOfferUri
      );
      setVaultLink(vaultLink);
      setIssuanceResponse(dataResponse);
    }
    console.log("issuanceResponse", issuanceResponse);
  };

  return (
    <>
      {!showOrderConfirmation && (
        <S.Wrapper>
          Checkout
          <S.TopOptions>
            <div className="relative mx-auto" style={{ width: "80%" }}>
              <S.FormContainer>
                <form onSubmit={handleSubmit}>
                  <label htmlFor="firstName"> Your Contact </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={
                      consumer.user?.givenName +
                      " " +
                      consumer.user?.familyName +
                      " ( " +
                      consumer.user?.email +
                      ")"
                    }
                    placeholder="First and Last Name"
                  />
                </form>
              </S.FormContainer>

              <div style={{ padding: "1rem" }}>
                <FontAwesomeIcon icon={faTicket} className=" text-[12px] " />
                &nbsp;&nbsp;
                <label htmlFor="firstName"> Tickets </label> <br />
                <br />
                {items.map((item, index) => (
                  <S.ItemContainer
                    key={index}
                    style={{
                      display: "block",
                      width: "100%",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div
                      className={`m-1 shadow-md px-2 items-center justify-between`}
                    >
                      <div className="flex flex-row">
                        <div className="container w-2/4 text-left leading-10">
                          <p>
                            <img
                              className="p-1  w-10 h-10 mt-1 rounded-full"
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              style={{ display: "inline-block" }}
                            />
                            {item.product.name}
                          </p>
                        </div>
                        <div className="container w-1/4 text-right leading-10">
                          <p>Qty&nbsp;{item.quantity}</p>
                        </div>
                        <div className="container w-1/4 text-right leading-10">
                          <p>
                            <span className="text-blue-600 ">
                              {geo.currencySymbol}
                              {Number(
                                getGeoSpecificPrice(
                                  item.product.price,
                                  geo.currencyRate,
                                  consumer.user && consumer.user.verified
                                ) || false
                              ) * item.quantity}
                              &nbsp;{geo.currency}
                            </span>
                            <FontAwesomeIcon
                              onClick={() => removeItem(item.product.itemid)}
                              icon={faTrash}
                              className="w-1/8 text-blue-500 ml-6 mr-1 xse:ml-1 hover:cursor-pointer text-sm"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </S.ItemContainer>
                ))}
              </div>
              <S.FormContainer>
                <FontAwesomeIcon icon={faReceipt} className=" text-[12px] " />
                &nbsp;&nbsp;
                <label htmlFor="firstName"> Order Summary </label> <br />
                <br />
                <div className="flex flex-wrap px-30 mb-2">
                  <div className="container w-1/2">
                    <p>Tickets</p>
                  </div>
                  <div className="container w-1/2 text-right">
                    <p>
                      <span className="text-blue-600 ">
                        {geo.currencySymbol} {getUndiscountedPrice()}
                        {geo.currency}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap px-30 mb-2">
                  <div className="container w-1/2">
                    <p>Discount</p>
                  </div>
                  <div className="container w-1/2 text-right">
                    <p>
                      <span className="text-red-600 ">
                        &nbsp; - {geo.currencySymbol} {getTotalDiscount()}
                        {geo.currency}
                      </span>
                    </p>
                  </div>
                </div>
                <hr />
                <div className="flex flex-wrap px-30 mt-5">
                  <div className="container w-1/2">
                    <p>Total</p>
                  </div>
                  <div className="container w-1/2 text-right">
                    <p>
                      {geo.currencySymbol} {getTotalPrice()} {geo.currency}
                    </p>
                  </div>
                </div>
              </S.FormContainer>

              <S.PaymentDetails>
                <FontAwesomeIcon icon={faMoneyBill} className=" text-[12px] " />
                &nbsp;&nbsp;
                <label htmlFor="firstName"> Payment Method </label> <br />
                <br />
                <input
                  type="radio"
                  id="payCard"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={handlePaymentMethodChange}
                  className="mr-2 cursor-pointer text-xs"
                />
                <label htmlFor="payCard" className="cursor-pointer  text-sm">
                  Card
                </label>
                <input
                  type="radio"
                  id="payBankTransfer"
                  name="paymentMethod"
                  value="banktransfer"
                  checked={paymentMethod === "banktransfer"}
                  onChange={handlePaymentMethodChange}
                  className="mr-2 ml-12 cursor-pointer text-xs"
                />
                <label
                  htmlFor="payBankTransfer"
                  className="cursor-pointer  text-sm"
                >
                  Bank Transfer
                </label>
                {paymentMethod != "" && (
                  <div style={{ textAlign: "center" }}>
                    <button
                      onClick={handlePay}
                      className={`rounded text-white py-2 mt-8 w-1/2`}
                      style={{ backgroundColor: "#1F276F" }}
                    >
                      Pay {geo.currencySymbol} {getTotalPrice()} {geo.currency}
                    </button>
                  </div>
                )}
              </S.PaymentDetails>
              {/* </>} */}
            </div>
            <div className="relative mx-auto" style={{ width: "80%" }}>
              <div className="flex flex-wrap px-30 pt-5">
                <S.CardInformation className="container mx-auto">
                  <div className="p-1">
                    <FontAwesomeIcon icon={faQrcode} className=" p-1" /> &nbsp;
                    <p>
                      <strong>Tickets stored in Affinidi Vault</strong> <br />
                      Please log in to your Affinidi Vault to view and present
                      your tickets.
                    </p>
                  </div>
                </S.CardInformation>
                <S.CardInformation className="container mx-auto">
                  <div className="p-1">
                    <FontAwesomeIcon icon={faX} className=" p-1" /> &nbsp;
                    <p>
                      <strong>Non-Refundable</strong>
                    </p>
                  </div>
                </S.CardInformation>
                <S.CardInformation className="container mx-auto">
                  <div className="p-1">
                    <FontAwesomeIcon icon={faShieldHeart} className=" p-1" />
                    &nbsp;
                    <p>
                      <strong>Buyer Guarantee Protected</strong> <br />
                      Every ticket is protected. If your event gets cancelled,
                      we’ll make it right.
                    </p>
                  </div>
                </S.CardInformation>
              </div>
            </div>
          </S.TopOptions>
          {showConfirmationModal && (
            <ConfirmationModal closeModal={closeConfirmationModal} />
          )}
        </S.Wrapper>
      )}

      {showOrderConfirmation && (
        <S.Wrapper>
          <div className="flex flex-wrap px-30">
            <div className="container w-1/2 relative">
              <div className="relative mx-auto" style={{ width: "80%" }}>
                <S.TopOptionsCustom className="mt-4">
                  <img src="/images/checkmark.png" />
                  <h2
                    style={{
                      fontSize: "32px",
                      marginTop: "60px",
                      marginBottom: "30px",
                    }}
                  >
                    Thank you for your order!
                  </h2>
                  <p style={{ fontSize: "14px", marginBottom: "30px" }}>
                    We will send an email confirmation to {consumer.user.email}.
                    Your credential offer is ready, You can claim your event
                    ticket credentails in your Affinidi Vault.
                  </p>

                  {!issuanceResponse && (
                    <>
                      Generating your ticket
                      {isLoading && (
                        <span>
                          <img
                            src="/images/yourcart/wait.gif"
                            className="h-8 w-8"
                          />
                        </span>
                      )}
                    </>
                  )}
                  {issuanceResponse && (
                    <>
                      <p style={{ fontSize: "14px" }}>
                        Offer URL:
                        <a style={{ color: "blue" }} href={vaultLink}>
                          {vaultLink}
                        </a>
                      </p>
                      <S.AffinidiVaultClaimButtonContainer>
                        <S.AffinidiVaultClaimButton
                          href={vaultLink}
                          target="_blank"
                        >
                          Redeem My Ticket
                        </S.AffinidiVaultClaimButton>
                      </S.AffinidiVaultClaimButtonContainer>
                    </>
                  )}
                </S.TopOptionsCustom>
              </div>
            </div>
            <div className="container w-1/2 relative pr-5 pl-5">
              <S.TopOptionsCustom className="mt-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="relative mx-auto"
                    style={{ width: "80%" }}
                  >
                    <S.ImgContainer src={item.product.imageUrl} />

                    <h2 className="mb-5 mt-5" style={{ fontSize: "32px" }}>
                      {item.product.name}
                    </h2>
                    <p className="mb-5" style={{ fontSize: "24px" }}>
                      {item.product.date}
                    </p>
                    <div className="flex flex-wrap px-30">
                      <div className="container w-1/2">
                        <p>Tickets</p>
                      </div>
                      <div className="container w-1/2 text-right">
                        <p>
                          $ {item.product.price} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap px-30">
                      <div className="container w-1/2">
                        <p>Fees</p>
                      </div>
                      <div className="container w-1/2 text-right">
                        <p>$14.00 x 1</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap px-30 pt-5">
                      <div className="container w-1/2">
                        <p>Total</p>
                      </div>
                      <div className="container w-1/2 text-right">
                        <p>$ {item.product.price * item.quantity}</p>
                      </div>
                    </div>
                    <hr className="mt-5" />
                    <div className="flex flex-wrap px-30 pt-5">
                      {
                        items.map((item, index) => (
                          <S.CardInformation
                            key={index}
                            className="container mx-auto"
                          >
                            <div className="p-1">
                              <FontAwesomeIcon
                                icon={faTicket}
                                className=" p-1"
                              />
                              &nbsp;
                              <p>
                                <strong>{item.product.description}</strong>
                              </p>
                            </div>
                          </S.CardInformation>
                        ))[0]
                      }
                      <S.CardInformation className="container mx-auto">
                        <div className="p-1">
                          <FontAwesomeIcon icon={faQrcode} className=" p-1" />
                          &nbsp;
                          <p>
                            <strong>Tickets stored in Affinidi Vault</strong>
                            <br />
                            Please log in to your Affinidi Vault to view and
                            present your tickets.
                          </p>
                        </div>
                      </S.CardInformation>
                      <S.CardInformation className="container mx-auto">
                        <div className="p-1">
                          <FontAwesomeIcon icon={faX} className=" p-1" /> &nbsp;
                          <p>
                            <strong>Non-Refundable</strong>
                          </p>
                        </div>
                      </S.CardInformation>
                      <S.CardInformation className="container mx-auto">
                        <div className="p-1">
                          <FontAwesomeIcon
                            icon={faShieldHeart}
                            className=" p-1"
                          />
                          &nbsp;
                          <p>
                            <strong>Buyer Guarantee Protected</strong> <br />
                            Every ticket is protected. If your event gets
                            cancelled, we’ll make it right.
                          </p>
                        </div>
                      </S.CardInformation>
                    </div>
                  </div>
                ))}
              </S.TopOptionsCustom>
            </div>
          </div>
        </S.Wrapper>
      )}
    </>
  );
};
export default Checkout;
