import { ExpressAuth } from "@auth/express";
import Credentials from "@auth/express/providers/credentials";
import bcrypt from "bcryptjs";
import { query } from "./db.js";

export const authConfig = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const result = await query("SELECT * FROM users WHERE email = $1", [credentials.email]);
                    const user = result.rows[0];

                    if (!user) return null;

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password_hash
                    );

                    if (!isPasswordValid) return null;

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.email.split('@')[0], // Fallback name
                    };
                } catch (error) {
                    console.error("Auth authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/admin", // Redirect to our custom login page
    },
    trustHost: true,
    secret: process.env.AUTH_SECRET || "at-least-32-character-secret-key-12345",
};
