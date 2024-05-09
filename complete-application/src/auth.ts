import { SvelteKitAuth } from "@auth/sveltekit"
import FusionAuth from "@auth/core/providers/fusionauth"
import { FUSIONAUTH_ISSUER, FUSIONAUTH_CLIENT_ID, FUSIONAUTH_CLIENT_SECRET, FUSIONAUTH_URL, FUSIONAUTH_TENANT_ID } from "$env/static/private"

const fusionAuth =     FusionAuth({
  issuer: FUSIONAUTH_ISSUER,
  clientId: FUSIONAUTH_CLIENT_ID,
  clientSecret: FUSIONAUTH_CLIENT_SECRET,
  // wellKnown: `${FUSIONAUTH_URL}/.well-known/openid-configuration/${FUSIONAUTH_TENANT_ID}`,
  tenantId: FUSIONAUTH_TENANT_ID, // Only required if you're using multi-tenancy
  authorization: {
    params: {
      scope: "offline_access email openid",
      tenantId: FUSIONAUTH_TENANT_ID,
    },
  },
  userinfo: `${FUSIONAUTH_URL}/oauth2/userinfo`,
  // This is due to a known processing issue
  // TODO: https://github.com/nextauthjs/next-auth/issues/8745#issuecomment-1907799026
  token: {
    url: `${FUSIONAUTH_URL}/oauth2/token`,
    conform: async (response: Response) => {
      if (response.status === 401) return response;

      const newHeaders = Array.from(response.headers.entries())
        .filter(([key]) => key.toLowerCase() !== "www-authenticate")
        .reduce((headers, [key, value]) => (headers.append(key, value), headers), new Headers());

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    },
  },
})

// reset to oidc provider
fusionAuth.type = 'oidc';

export const { handle } = SvelteKitAuth({
  providers: [
    fusionAuth
  ],
})
