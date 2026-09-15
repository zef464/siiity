import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export default {
  trustHost: true,  
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
        const isLoggedIn = !!auth?.user;
        const pathname = request.nextUrl.pathname;
        const isAuthRoute = pathname.startsWith("/api/auth");
        const isOnLogin = pathname.startsWith("/login");

        if (isAuthRoute || isOnLogin) return true;
        return isLoggedIn;
    },
    session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    },
} satisfies NextAuthConfig;