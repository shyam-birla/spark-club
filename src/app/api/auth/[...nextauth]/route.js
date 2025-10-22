// src/app/api/auth/[...nextauth]/route.js (Updated with custom page)

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { client } from '../../../../../sanity/lib/client';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  // --- YEH NAYA ADD HUA HAI ---
  pages: {
    signIn: '/login', // Hum NextAuth ko bata rahe hain ki login ke liye is URL ka page dikhao
  },
  callbacks: {
    async session({ session, token }) {
      // Fetch user's role from Sanity
      const userProfile = await client.fetch(
        `*[_type == "profile" && userEmail == $email][0]`,
        { email: session.user.email }
      );
      session.user.role = userProfile?.role || 'member';
      return session;
    },
  },
  // --- END OF CHANGE ---
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };