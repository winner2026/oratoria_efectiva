import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "complex_secret_fallback_123",
  providers: [
    CredentialsProvider({
      name: "Guest Access",
      credentials: {},
      async authorize(credentials, req) {
        return { id: "guest-1", name: "Guest User", email: "guest@example.com", image: "" };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account?.provider === "google" && user?.email) {
        try {
          const { prisma } = await import("@/infrastructure/db/client");
          let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                image: user.image || "",
              }
            });
          }
          token.sub = dbUser.id; // Override Google ID with Prisma ID!
        } catch (e) {
          console.error("JWT Error syncing user:", e);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.sub; // This is now the Prisma UUID
      }
      return session;
    },
    async signIn({ user, account, profile }: any) {
      // The DB creation is now handled in the JWT callback to ensure we get the ID.
      // But we can keep signIn returning true.
      return true;
    }
  }
};
