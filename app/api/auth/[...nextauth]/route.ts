/**
 * NextAuth.js configuration for Google OAuth authentication
 * Handles user authentication and calendar access permissions
 */
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Extend the default session type to include access token
 * This is necessary for Google Calendar API access
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
  }
}

/**
 * NextAuth configuration options
 * Sets up Google OAuth provider with calendar access scopes
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",        // Always show consent screen
          access_type: "offline",   // Enable refresh token
          response_type: "code",    // Authorization code flow
          scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
        }
      }
    }),
  ],
  callbacks: {
    /**
     * JWT callback - Called when JSON Web Token is created (on sign in) 
     * or updated (when session is accessed in the client)
     */
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    /**
     * Session callback - Called whenever a session is checked
     * Adds the access token to the session object for client-side use
     */
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

// Create the auth handler with our configuration
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };