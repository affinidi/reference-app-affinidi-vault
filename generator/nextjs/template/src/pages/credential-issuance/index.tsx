import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import Button from "src/components/Button";
import Input from "src/components/Input";
import Message from "src/components/Message";
import Offer from "src/components/Offer";
import { MessagePayload, OfferPayload } from "src/types/types";

type CredentialData = {
  email?: string;
  name?: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  credentialTypeId?: string;
};

const CredentialIssuance: FC = () => {
  const [holderDid, setHolderDid] = useState<string>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [offer, setOffer] = useState<OfferPayload>();
  const [credentialData, setCredentialData] = useState<CredentialData>();
  const [credentialTypeId, setCredentialTypeId] = useState<string>(
    "InsuranceRegistration"
  );
  const [message, setMessage] = useState<MessagePayload>();

  //Prefill did from session, if user is logged-in
  const { data: session } = useSession();
  useEffect(() => {
    console.log("session", session);
    if (!session || !session.user) return;
    setHolderDid(session.userId);
    setCredentialData((state) => ({
      ...state,
      email: session.user?.email,
    }));
  }, [session]);

  const handleSubmit = async () => {
    if (!holderDid || !credentialTypeId) {
      setMessage({
        message: "Holder's DID and Credential Type ID are required",
        type: "error",
      });
      return;
    }
    console.log("credentialData:", credentialData);
    console.log("Starting issuance");
    setIsButtonDisabled(true);
    const response = await fetch(`/api/credentials/issuance-start`, {
      method: "POST",
      body: JSON.stringify({
        credentialData,
        credentialTypeId,
        holderDid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let dataResponse = await response.json();
    console.log("dataResponse", dataResponse);

    if (typeof dataResponse == "string") {
      dataResponse = JSON.parse(dataResponse);
    }

    if (dataResponse.credentialOfferUri) {
      setOffer(dataResponse);
    }
    console.log("offer", offer);
  };

  const clearIssuance = () => {
    setOffer(undefined);
    setIsButtonDisabled(false);
    setCredentialData((state) => ({}));
    setMessage(undefined);
    if (session) {
      setCredentialData((state) => ({
        ...state,
        email: session.user?.email,
      }));
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Issue Credentials</h1>
      {offer && (
        <div>
          <Offer offer={offer}></Offer>
          <Button onClick={clearIssuance}>New issuance</Button>
        </div>
      )}
      {!offer && (
        <div>
          <Input
            label="Holder's DID (From Affinidi Login)"
            value={holderDid}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHolderDid(() => e.target.value)
            }
          />
          <Input
            label="Credential Type ID"
            value={credentialTypeId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialTypeId(() => e.target.value)
            }
          />
          <h1 className="text-xl font-semibold pb-6 pt-4">Credential data:</h1>

          <Input
            label="Email"
            value={credentialData?.email}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, email: e.target.value }))
            }
          />

          <Input
            label="Full Name"
            value={credentialData?.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, name: e.target.value }))
            }
          />

          <Input
            label="Phone Number"
            value={credentialData?.phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, phoneNumber: e.target.value }))
            }
          />

          <Input
            label="Date of Birth"
            value={credentialData?.dob}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, dob: e.target.value }))
            }
          />

          <Input
            label="Gender"
            value={credentialData?.gender}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, gender: e.target.value }))
            }
          />

          <Input
            label="Address"
            value={credentialData?.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, address: e.target.value }))
            }
          />

          <Input
            label="Post Code"
            value={credentialData?.postcode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, postcode: e.target.value }))
            }
          />

          <Input
            label="City"
            value={credentialData?.city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, city: e.target.value }))
            }
          />

          <Input
            label="Country"
            value={credentialData?.country}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCredentialData((p) => ({ ...p, country: e.target.value }))
            }
          />

          <Button
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className="mt-4"
          >
            Submit
          </Button>
          {message && (
            <div className="pt-4">
              <Message payload={message} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CredentialIssuance;
