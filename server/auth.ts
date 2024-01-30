import { isBusinessEmail } from "@/lib/email/utils";
import { db } from "@/server/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare, hash } from "bcryptjs";
import { getAccount } from "models/account";
import { createUser, getUser } from "models/user";
import { Account, NextAuthOptions, User, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { Provider } from "next-auth/providers/index";
import type { AUTH_PROVIDER } from "types";
import { passwordPolicies } from "../lib/common";
import env from "../lib/env";
import { ApiError } from "../lib/errors";
import { invalid } from "@/lib/messages";

const adapter = PrismaAdapter(db);

const providers: Provider[] = [];

if (isAuthProviderEnabled("credentials")) {
  providers.push(
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Không tìm thấy thông tin đăng nhập nào.");
        }

        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        const user = await getUser({ email });

        if (!user) {
          throw new Error(invalid("Thông tin đăng nhập"));
        }

        if (env.confirmEmail && !user.emailVerified) {
          throw new Error("Hãy xác nhận email của bạn");
        }

        const hasValidPassword = await verifyPassword(password, user?.password as string);

        if (!hasValidPassword) {
          throw new Error(invalid("Thông tin đăng nhập"));
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email
        };
      }
    })
  );
}

if (isAuthProviderEnabled("google")) {
  providers.push(
    GoogleProvider({
      clientId: env.google.clientId,
      clientSecret: env.google.clientSecret,
      allowDangerousEmailAccountLinking: true,
      // To force Google to re-issue a Refresh Token
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  );
}

if (isAuthProviderEnabled("email")) {
  providers.push(
    EmailProvider({
      server: {
        host: env.smtp.host,
        port: env.smtp.port,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.password
        }
      },
      from: env.smtp.from
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter,
  providers,
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request"
  },
  session: {
    strategy: "jwt"
  },
  secret: env.nextAuth.secret,
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !user.email || !account) {
        return false;
      }

      if (env.disableNonBusinessEmailSignup && !isBusinessEmail(user.email)) {
        return "/auth/login?error=allow-only-work-email";
      }

      // Login via email and password
      if (account?.provider === "credentials") {
        return true;
      }

      const existingUser = await getUser({ email: user.email });

      // Login via email (Magic Link)
      if (account?.provider === "email") {
        return existingUser ? true : false;
      }

      // First time users
      if (!existingUser) {
        const newUser = await createUser({
          name: `${user.name}`,
          email: `${user.email}`
        });

        await linkAccount(newUser, account);

        return true;
      }

      // Existing users reach here
      const linkedAccount = await getAccount({ userId: existingUser.id });

      if (!linkedAccount) {
        await linkAccount(existingUser, account);
      }

      return true;
    },

    async session({ session, token }) {
      if (token && session) {
        session.user.id = token.sub as string;
      }

      return session;
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user.name) {
        const updateUsername = { ...user, name: session.user.name };
        return { ...token, ...updateUsername };
      }
      return { ...token, ...user };
    }
  }
};

const linkAccount = async (user: User, account: Account) => {
  if (adapter.linkAccount) {
    return await adapter.linkAccount({
      providerAccountId: account.providerAccountId,
      userId: user.id,
      provider: account.provider,
      type: "oauth",
      scope: account.scope,
      token_type: account.token_type,
      access_token: account.access_token
    });
  }
};

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export function getAuthProviders() {
  return env.authProviders?.split(",") || [];
}

export function isAuthProviderEnabled(provider: AUTH_PROVIDER) {
  return getAuthProviders().includes(provider);
}

export function authProviderEnabled() {
  return {
    google: isAuthProviderEnabled("google"),
    email: isAuthProviderEnabled("email"),
    credentials: isAuthProviderEnabled("credentials")
  };
}

export const validatePasswordPolicy = (password: string) => {
  const { minLength } = passwordPolicies;

  if (password.length < minLength) {
    throw new ApiError(422, `Mật khẩu phải có ít nhất ${minLength} ký tự.`);
  }

  // TODO: Add more password policies
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
