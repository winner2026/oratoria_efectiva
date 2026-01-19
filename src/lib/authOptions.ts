import CredentialsProvider from "next-auth/providers/credentials";

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
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    // }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        try {
          // Dynamic import to avoid circular dep issues if any
          // Note: using relative import or alias to client
          const { prisma } = await import("@/infrastructure/db/client");
          
          const userEmail = user.email || "";
          const userName = user.name || "";
          const userImage = user.image || "";

          if (userEmail) {
            await prisma.user.upsert({
              where: { email: userEmail },
              update: {
                name: userName,
                image: userImage,
              },
              create: {
                email: userEmail,
                name: userName,
                image: userImage,
              }
            });
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      return true;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};
