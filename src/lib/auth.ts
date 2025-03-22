import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

// Beta testing mode - set to true to enable credentials for friends & family testing
const BETA_TESTING = true;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // For development and beta testing, use the credentials provider
    ...(BETA_TESTING || process.env.NODE_ENV !== 'production'
      ? [
          CredentialsProvider({
            name: 'Beta Testing',
            credentials: {
              email: { label: 'Email', type: 'email' },
              name: { label: 'Name', type: 'text' },
            },
            async authorize(credentials) {
              if (!credentials?.email) {
                return null;
              }

              // For beta testing, create or find a user based on the provided email
              const user = await prisma.user.upsert({
                where: { email: credentials.email },
                update: { name: credentials.name || 'Beta Tester' },
                create: {
                  email: credentials.email,
                  name: credentials.name || 'Beta Tester',
                },
              });

              return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
              };
            },
          }),
        ]
      : []),
    // Configure real providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || 'user1';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV !== 'production',
};
