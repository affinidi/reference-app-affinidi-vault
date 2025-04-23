import { VaultUtils } from "@affinidi-tdk/common";
import QRCode from "qrcode.react";
import { FC } from "react";
import { OfferPayload } from "src/types/types";

function buildClaimLinkInternal(vaultUrl: string, credentialOfferUri: string): string {
  const params = new URLSearchParams()
  params.append('credential_offer_uri', credentialOfferUri)
  const queryString = params.toString()
  return `${vaultUrl}/claim?${queryString}`
}

function getClaimLink(credentialOfferUri: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    const vaultUrl = window.localStorage.getItem('affinidiVaultUrl')
    if (vaultUrl) {
      return buildClaimLinkInternal(
        vaultUrl,
        credentialOfferUri
      )
    }
  }
  return VaultUtils.buildClaimLink(credentialOfferUri)
}

const Offer: FC<{ offer: OfferPayload }> = ({ offer }) => {
  const vaultLink = getClaimLink(offer.credentialOfferUri)

  return (
    <div>
      <p className="text-lg pb-6">
        Your credential offer is ready. Claim it by following the link or
        scanning the QR code and pasting the transaction code.
      </p>
      <a
        id="credentialOfferUri"
        className="text-blue-500"
        href={vaultLink}
        target="_blank"
      >
        {vaultLink}
      </a>
      <div className="flex justify-center">
        <QRCode className="my-6" value={vaultLink} size={256} />
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
