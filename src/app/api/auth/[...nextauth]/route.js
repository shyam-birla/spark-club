// src/app/api/auth/[...nextauth]/route.js (Updated with custom page)

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import { client, serverWriteClient } from '../../../../../sanity/lib/client';

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
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // No email or password provided
        }

        const userProfile = await client.fetch(
          `*[_type == "profile" && userEmail == $email][0]`,
          { email: credentials.email }
        );

        if (!userProfile || !userProfile.hashedPassword) {
          return null; // User not found or no password set (e.g., OAuth user)
        }

        const isValidPassword = await bcrypt.compare(credentials.password, userProfile.hashedPassword);

        if (isValidPassword) {
          // Return user object (NextAuth expects at least id, email, name)
          return { id: userProfile._id, email: userProfile.userEmail, name: userProfile.userName };
        } else {
          return null; // Invalid password
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  // --- YEH NAYA ADD HUA HAI ---
  pages: {
    signIn: '/login', // Hum NextAuth ko bata rahe hain ki login ke liye is URL ka page dikhao
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist the OAuth access_token and the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      // Add user role to the token
      if (user) {
        let userProfile = await client.fetch(
          `*[_type == "profile" && userEmail == $email][0]`,
          { email: user.email }
        );

        if (!userProfile) {
          // Create a new profile for the user
          const newUser = {
            _type: 'profile',
            userEmail: user.email,
            userName: user.name,
            role: 'member', // Default role
            uniqueProfileId: Math.floor(100000000 + Math.random() * 900000000),
          };
          userProfile = await serverWriteClient.create(newUser);
        }

        token.role = userProfile?.role || 'member';
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.role = token.role; // Add role from token to session
      return session;
    },
  },
  debug: true, // Enable debug messages in the console
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };