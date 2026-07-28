// Shared helpers for the Iota share flows (websocket + redirect).
//
// TODO: Move `AFFINIDI_VAULT_WEBHOOK_URL` and `buildShareLinkForWebhook` into
// @affinidi-tdk/common once `VaultUtils.buildShareLink` supports custom vault
// base URLs (e.g. a TDK Vault deep link like "tdkref://login").

// Affinidi Vault webhook/login URL, used to detect the "Affinidi Vault" case.
export const AFFINIDI_VAULT_WEBHOOK_URL = "https://vault.affinidi.com/login";

// Builds a share link for a custom vault webhook. `webhookUrl` already includes
// the share path (".../login").
export function buildShareLinkForWebhook(
  webhookUrl: string,
  request: string,
  clientId: string
): string {
  const params = new URLSearchParams();
  params.append("request", request);
  params.append("client_id", clientId);
  return `${webhookUrl}?${params.toString()}`;
}

// Returns the credentials shared in a parsed `vp_token`, supporting both
// response shapes:
// - PEX: a single Verifiable Presentation object.
// - DCQL (OID4VP 1.0 §8.1): an object keyed by credential-query id whose values
//   are the presentation(s) that satisfy each query.
export function getSharedCredentials(vp: any): any[] {
  if (!vp || typeof vp !== "object") return [];
  const presentations =
    "proof" in vp || "holder" in vp || "verifiableCredential" in vp
      ? [vp]
      : Object.values(vp).flatMap((value: any) =>
          Array.isArray(value) ? value : [value]
        );
  return presentations.flatMap((presentation: any) => {
    const credentials = presentation?.verifiableCredential;
    if (Array.isArray(credentials)) return credentials;
    if (credentials) return [credentials];
    return [];
  });
}
