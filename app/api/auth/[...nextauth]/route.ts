import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const dynamic = 'force-dynamic';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
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
});

export { handler as GET, handler as POST };
