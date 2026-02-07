import GitHub from "@auth/core/providers/github";
import GitLab from "@auth/core/providers/gitlab";
import Google from "@auth/core/providers/google";
import AzureAD from "@auth/core/providers/azure-ad";
import Email from "@auth/core/providers/email";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { StartAuthJSConfig } from "start-authjs";
import { serverEnv } from "~/env/server";
import { db } from "./db";

export const authConfig: StartAuthJSConfig = {
  secret: serverEnv.AUTH_SECRET,
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: serverEnv.GITHUB_ID,
      clientSecret: serverEnv.GITHUB_SECRET,
    }),
    GitLab({
      clientId: serverEnv.GITLAB_ID,
      clientSecret: serverEnv.GITLAB_SECRET,
    }),
    Google({
      clientId: serverEnv.GOOGLE_ID,
      clientSecret: serverEnv.GOOGLE_SECRET,
    }),
    AzureAD({
      clientId: serverEnv.MICROSOFT_ID,
      clientSecret: serverEnv.MICROSOFT_SECRET,
    }),
    Email({
      server: serverEnv.EMAIL_SERVER,
      from: serverEnv.EMAIL_FROM,
    }),
  ],
  debug: false,
  basePath: new URL(serverEnv.AUTH_URL!).pathname,
};
