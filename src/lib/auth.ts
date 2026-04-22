import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (!resend) {
          console.warn("No RESEND_API_KEY found, magic link to:", url);
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
