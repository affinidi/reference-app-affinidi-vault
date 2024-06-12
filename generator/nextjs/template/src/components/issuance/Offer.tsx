import QRCode from "qrcode.react";
import { FC } from "react";
import { vaultUrl } from "src/lib/variables";
import { OfferPayload } from "src/types/types";

const Offer: FC<{ offer: OfferPayload }> = ({ offer }) => {
  const getVaultLink = (vaultUrl: string, credentialOfferUri: string) => {
    const params = new URLSearchParams();
    params.append("credential_offer_uri", credentialOfferUri);
    const queryString = params.toString();
    return `${vaultUrl}?${queryString}`;
  };

  return (
    <div>
      <p className="text-lg pb-6">
        Your credential offer is ready. Claim it by following the link or
        scanning the QR code and pasting the transaction code.
      </p>
      <a
        id="credentialOfferUri"
        className="text-blue-500"
        href={getVaultLink(vaultUrl, offer.credentialOfferUri)}
        target="_blank"
      >{`${getVaultLink(vaultUrl, offer.credentialOfferUri)}`}</a>
      <div className="flex justify-center">
        <QRCode
          className="my-6"
          value={getVaultLink(vaultUrl, offer.credentialOfferUri)}
          size={256}
        />
      </div>
      {offer.txCode && (
        <p className="text-lg pb-4">
          Transaction code:
          <span id="txCode" className="font-semibold ml-4">
            {offer.txCode}
          </span>
        </p>
      )}
      <p className="text-lg pb-8">
        Offer expires in{" "}
        <span id="expiresIn" className="font-semibold">
          {offer.expiresIn}
        </span>{" "}
        seconds
      </p>
    </div>
  );
};

export default Offer;
