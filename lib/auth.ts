import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin } from "better-auth/plugins";

// Create a separate pool for auth to avoid prepared statement issues
const authPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 5,
});

export const auth = betterAuth({
    database: authPool,
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
