import { jwtDecode } from "jwt-decode";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        email: { label: "email", placeholder: "enter Your Email", type: "email" },
        password: { label: "password", placeholder: "Enter Your password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: {
            "content-type": "application/json",
          },
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();

        const userData = jwtDecode<{ id: string }>(data.token);
        console.log("data", userData);

        return {
          id: userData.id,
          name: data.user?.name,
          email: data.user?.email,
          accessToken: data.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }

      console.log("token", token, "user", user);
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
