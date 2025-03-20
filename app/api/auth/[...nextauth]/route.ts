/**
 * NextAuth.js configuration for Google OAuth authentication
 * Handles user authentication and calendar access permissions
 */
import NextAuth from "next-auth";
import { authOptions } from "./config";

// Create the auth handler with our configuration
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };