import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN || "", // Use the token from the environment variable
});
