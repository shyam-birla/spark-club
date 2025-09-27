// src/app/api/auth/[...nextauth]/route.js (Updated with custom page)

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

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
  }
  // --- END OF CHANGE ---
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };