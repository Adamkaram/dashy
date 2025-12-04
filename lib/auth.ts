import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true in production
    },
    plugins: [
        admin({
            defaultRole: "user",
            adminRoles: ["admin", "super-admin"],
        }),
    ],
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false,
            },
        },
    },
    trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ],
});

export type Session = typeof auth.$Infer.Session;
