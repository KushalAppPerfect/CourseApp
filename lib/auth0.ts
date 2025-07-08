import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  session: {
    rolling: false,
    absoluteDuration: 30, // 30 seconds
  },
});