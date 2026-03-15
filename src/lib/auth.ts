import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (!process.env.RESEND_API_KEY) {
          console.warn("No RESEND_API_KEY found, magic link to:", url);
          // In development we could log the URL here
          return;
        }
        await resend.emails.send({
          from: "noreply@quantum-aurora.com",
          to: email,
          subject: "Your Client Portal Access Link",
          html: `<p>Click here to login: <a href="${url}">${url}</a></p>`,
        });
      },
    }),
  ],
});
