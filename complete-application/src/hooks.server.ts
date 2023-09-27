import { SvelteKitAuth } from "@auth/sveltekit"
import FusionAuth from "@auth/core/providers/fusionauth"
import { FUSIONAUTH_ISSUER, FUSIONAUTH_CLIENT_ID, FUSIONAUTH_CLIENT_SECRET, FUSIONAUTH_URL, FUSIONAUTH_TENANT_ID } from "$env/static/private"

export const handle = SvelteKitAuth({
  providers: [
    FusionAuth({
      issuer: FUSIONAUTH_ISSUER,
      clientId: FUSIONAUTH_CLIENT_ID,
      clientSecret: FUSIONAUTH_CLIENT_SECRET,
      wellKnown: `${FUSIONAUTH_URL}/.well-known/openid-configuration/${FUSIONAUTH_TENANT_ID}`,
      tenantId: FUSIONAUTH_TENANT_ID, // Only required if you're using multi-tenancy
    }),
  ],
})
