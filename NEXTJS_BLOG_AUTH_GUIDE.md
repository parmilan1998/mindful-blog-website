# Next.js 15 Blog App — Advanced Auth & Authorization Guide

## Stack
- Next.js 15 (App Router)
- TypeScript
- Prisma + PostgreSQL
- NextAuth.js v5 (Auth.js)
- JWT + Role-Based Access Control (RBAC)
- Zod (validation)
- Bcrypt (password hashing)
- Middleware (route protection)

---

## 1. FOLDER STRUCTURE (Annotated)

```
blog-app/
├── src/
│   ├── app/                          # Next.js App Router root
│   │   ├── (auth)/                   # Route group — shares auth layout
│   │   │   ├── layout.tsx            # Minimal centered layout for auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # /login
│   │   │   ├── register/
│   │   │   │   └── page.tsx          # /register
│   │   │   └── forgot-password/
│   │   │       └── page.tsx          # /forgot-password
│   │   │
│   │   ├── (dashboard)/              # Route group — protected dashboard
│   │   │   ├── layout.tsx            # Sidebar + topbar layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # /dashboard — overview stats
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx          # /posts — list all (own) posts
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # /posts/new
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # /posts/[id] — view
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx  # /posts/[id]/edit
│   │   │   └── admin/                # Admin-only section
│   │   │       ├── layout.tsx        # Extra admin guard
│   │   │       ├── page.tsx          # /admin — admin overview
│   │   │       └── users/
│   │   │           └── page.tsx      # /admin/users — manage all users
│   │   │
│   │   ├── (public)/                 # Public-facing blog
│   │   │   ├── layout.tsx            # Public navbar + footer layout
│   │   │   ├── page.tsx              # / — homepage with published posts
│   │   │   └── blog/
│   │   │       ├── page.tsx          # /blog — all published posts
│   │   │       └── [slug]/
│   │   │           └── page.tsx      # /blog/[slug] — single post
│   │   │
│   │   ├── api/                      # API Routes (backend)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts      # NextAuth handler (GET + POST)
│   │   │   ├── posts/
│   │   │   │   ├── route.ts          # GET /api/posts, POST /api/posts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET/PUT/DELETE /api/posts/[id]
│   │   │   ├── users/
│   │   │   │   ├── route.ts          # GET /api/users (admin only)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET/PUT/DELETE /api/users/[id]
│   │   │   └── upload/
│   │   │       └── route.ts          # POST /api/upload (image uploads)
│   │   │
│   │   ├── layout.tsx                # Root layout (html + body)
│   │   └── globals.css
│   │
│   ├── auth.ts                       # NextAuth.js config (THE core auth file)
│   ├── middleware.ts                  # Route protection middleware
│   │
│   ├── lib/                          # Shared utilities
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── auth-utils.ts             # Password hash/verify helpers
│   │   ├── tokens.ts                 # JWT + email token helpers
│   │   ├── validations.ts            # Zod schemas
│   │   └── rate-limit.ts             # Simple rate limiter
│   │
│   ├── types/                        # TypeScript types
│   │   ├── auth.ts                   # Session, User, JWT types
│   │   ├── posts.ts                  # Post, Comment types
│   │   └── next-auth.d.ts            # Module augmentation for NextAuth
│   │
│   ├── hooks/                        # React custom hooks
│   │   ├── use-session.ts            # Typed useSession wrapper
│   │   └── use-permissions.ts        # RBAC permission hook
│   │
│   └── components/
│       ├── auth/
│       │   ├── login-form.tsx
│       │   ├── register-form.tsx
│       │   └── auth-guard.tsx        # Client-side route guard component
│       ├── posts/
│       │   ├── post-card.tsx
│       │   └── post-editor.tsx
│       └── ui/                       # Shared UI primitives
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Seed script
│
├── .env.local                        # Env vars (never commit)
├── auth.config.ts                    # Auth config (edge-compatible)
├── next.config.ts
└── middleware.ts                     # (at root or src/ — must be edge-compatible)
```

---

## 2. DATABASE SCHEMA

**File: `prisma/schema.prisma`**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ────────────────────────────────────────────────────────────────────

enum Role {
  USER          // Can create/read/update/delete own posts
  EDITOR        // Can create/edit all posts (not delete others')
  ADMIN         // Full access — manage users, all posts
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// ─── Models ───────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // null if OAuth-only user
  image         String?
  role          Role      @default(USER)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  posts     Post[]
  accounts  Account[]   // OAuth accounts
  sessions  Session[]   // DB sessions (if using DB strategy)

  @@map("users")
}

model Post {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  content     String     @db.Text
  excerpt     String?
  coverImage  String?
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Author relation
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("posts")
}

// ─── NextAuth Required Models ──────────────────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

---

## 3. ENVIRONMENT VARIABLES

**File: `.env.local`**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"

# NextAuth
AUTH_SECRET="your-super-secret-key-min-32-chars"   # openssl rand -base64 32
AUTH_URL="http://localhost:3000"

# OAuth (optional)
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# Email (for password reset)
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER="resend"
EMAIL_SERVER_PASSWORD="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

---

## 4. NEXTAUTH CONFIGURATION

### 4a. Auth Config (Edge-compatible)

**File: `auth.config.ts`** — This file is imported by middleware (which runs on the Edge). It must NOT import Prisma (Node.js only).

```typescript
// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

// This config is edge-compatible (no Node.js APIs)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",           // Custom login page
    signOut: "/",
    error: "/login",            // Auth errors redirect here
    newUser: "/dashboard",      // After first OAuth sign-in
  },

  callbacks: {
    // ── authorized() ─────────────────────────────────────────────────────────
    // Called by middleware BEFORE a page renders.
    // Return true = allow, false = redirect to signIn page.
    // This is the first line of defense for route protection.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnAuth = nextUrl.pathname.startsWith("/login") || 
                       nextUrl.pathname.startsWith("/register");

      // Redirect authenticated users away from auth pages
      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Protect dashboard routes
      if (isOnDashboard && !isLoggedIn) {
        return false; // Triggers redirect to /login
      }

      // Admin routes — further checked in layout/API
      if (isOnAdmin && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },

  providers: [
    Google,
    GitHub,
    // Credentials provider declared here but logic in auth.ts
    Credentials({ credentials: {} }),
  ],
};
```

### 4b. Main Auth File

**File: `src/auth.ts`** — Full NextAuth setup with all callbacks, Prisma adapter, JWT customization.

```typescript
// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth-utils";
import { loginSchema } from "@/lib/validations";
import { authConfig } from "../auth.config";
import type { Role } from "@prisma/client";

export const {
  handlers,   // { GET, POST } — export from api/auth/[...nextauth]/route.ts
  auth,       // Server-side session helper
  signIn,     // Programmatic sign-in
  signOut,    // Programmatic sign-out
} = NextAuth({
  ...authConfig,

  // ── Adapter ────────────────────────────────────────────────────────────────
  // Persists accounts, sessions, verification tokens to DB.
  // When using Credentials, session strategy must be "jwt" (not database).
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",   // JWT sessions (stateless, works with Credentials)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    // ── OAuth Providers ──────────────────────────────────────────────────────
    Google({
      // Google auto-verifies email — no need for manual verification
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),

    // ── Credentials Provider ─────────────────────────────────────────────────
    // Email + Password login
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // 1. Validate input shape with Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Find user in database
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            password: true,
            emailVerified: true,
          },
        });

        // 3. User not found or OAuth-only account (no password)
        if (!user || !user.password) return null;

        // 4. Verify password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return null;

        // 5. Return user object (will be put into JWT)
        // Never include the password hash in the returned object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],

  // ── Callbacks ──────────────────────────────────────────────────────────────
  callbacks: {
    ...authConfig.callbacks,

    // jwt() fires whenever a JWT is created or updated.
    // Runs: on sign-in, on session access, on token refresh.
    async jwt({ token, user, account, trigger, session }) {
      // On initial sign-in, `user` is populated
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role as Role;
        token.emailVerified = (user as any).emailVerified;
      }

      // Handle session.update() calls (e.g., user changed their name)
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
      }

      // Refresh role from DB on every request (catches role changes)
      // Only do this every 5 minutes to avoid DB overload
      if (token.id) {
        const shouldRefresh =
          !token.roleLastChecked ||
          Date.now() - (token.roleLastChecked as number) > 5 * 60 * 1000;

        if (shouldRefresh) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.roleLastChecked = Date.now();
          }
        }
      }

      return token;
    },

    // session() fires when getServerSession() or useSession() is called.
    // Shapes what the client receives — only expose what's needed.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },

  events: {
    // Called after OAuth sign-in creates a new user
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
      // Could send welcome email here
    },
  },
});
```

---

## 5. TYPE AUGMENTATION

**File: `src/types/next-auth.d.ts`** — Extend NextAuth's built-in types to include our custom fields.

```typescript
// src/types/next-auth.d.ts
import type { Role } from "@prisma/client";
import type { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    emailVerified: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    emailVerified: Date | null;
    roleLastChecked?: number;
  }
}
```

---

## 6. MIDDLEWARE (Route Protection)

**File: `middleware.ts`** (project root — runs on Edge Runtime)

```typescript
// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use the edge-compatible authConfig (no Prisma)
export const { auth: middleware } = NextAuth(authConfig);

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (Next.js image optimization)
     * - favicon.ico
     * - Public API routes we want open (none here)
     * - Public pages: /, /blog, /blog/[slug]
     */
    "/((?!_next/static|_next/image|favicon.ico|blog|$).*)",
    // Always run for dashboard + admin
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
```

**How it works:**
1. Middleware intercepts every matched request BEFORE the page renders
2. Calls `authorized()` from `authConfig.callbacks`
3. If the user is not logged in and hits `/dashboard`, middleware redirects to `/login`
4. If the user is logged in and hits `/login`, middleware redirects to `/dashboard`

---

## 7. SHARED UTILITIES

### 7a. Prisma Singleton

**File: `src/lib/prisma.ts`**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Prevent multiple Prisma instances in development (hot-reload creates new instances)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 7b. Password Utilities

**File: `src/lib/auth-utils.ts`**

```typescript
// src/lib/auth-utils.ts
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

const SALT_ROUNDS = 12;

// ── Password Hashing ───────────────────────────────────────────────────────────

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

// ── Permission Checks (server-side) ───────────────────────────────────────────

type PermissionCheck = {
  userId: string;
  role: Role;
  resourceOwnerId?: string; // For "own resource" checks
};

export function canEditPost({ role, userId, resourceOwnerId }: PermissionCheck) {
  if (role === "ADMIN") return true;
  if (role === "EDITOR") return true;
  if (role === "USER" && userId === resourceOwnerId) return true;
  return false;
}

export function canDeletePost({ role, userId, resourceOwnerId }: PermissionCheck) {
  if (role === "ADMIN") return true;
  if (role === "USER" && userId === resourceOwnerId) return true;
  return false;
}

export function isAdmin(role: Role) {
  return role === "ADMIN";
}

// ── Server-Side Session Helper ─────────────────────────────────────────────────

// Use in Server Components and API Routes to get the current user's session
export async function requireAuth() {
  const { auth } = await import("@/auth");
  const session = await auth();
  
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  
  return session.user;
}

// Require a specific role
export async function requireRole(allowedRoles: Role[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  
  return user;
}
```

### 7c. Zod Validation Schemas

**File: `src/lib/validations.ts`**

```typescript
// src/lib/validations.ts
import { z } from "zod";

// ── Auth Schemas ───────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

// ── Post Schemas ───────────────────────────────────────────────────────────────

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export const updatePostSchema = createPostSchema.partial();

// ── Type Exports ───────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
```

---

## 8. API ROUTES (Backend)

### 8a. NextAuth Handler

**File: `src/app/api/auth/[...nextauth]/route.ts`**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
// This file is deliberately minimal — all config lives in src/auth.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

### 8b. Register Endpoint

**File: `src/app/api/register/route.ts`**

```typescript
// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate with Zod
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // 2. Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create user (first user gets ADMIN role)
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 8c. Posts API

**File: `src/app/api/posts/route.ts`**

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/lib/validations";

// GET /api/posts — List posts (public or own depending on auth)
export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Build where clause based on authentication
  const where = session?.user
    ? // Authenticated: can see own posts of all statuses
      session.user.role === "ADMIN"
      ? {} // Admin sees everything
      : { authorId: session.user.id }
    : // Public: only published posts
      { status: "PUBLISHED" as const };

  // Add status filter if provided
  if (status && session?.user) {
    Object.assign(where, { status });
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

// POST /api/posts — Create new post (authenticated only)
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = createPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        ...result.data,
        authorId: session.user.id,
        publishedAt:
          result.data.status === "PUBLISHED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    // Unique constraint violation on slug
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**File: `src/app/api/posts/[id]/route.ts`**

```typescript
// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canEditPost, canDeletePost } from "@/lib/auth-utils";
import { updatePostSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

// GET /api/posts/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, image: true } } },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Non-published posts are only visible to authorized users
  if (post.status !== "PUBLISHED") {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (
      !canEditPost({
        role: session.user.role,
        userId: session.user.id,
        resourceOwnerId: post.authorId,
      })
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json({ post });
}

// PUT /api/posts/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // RBAC check
  if (
    !canEditPost({
      role: session.user.role,
      userId: session.user.id,
      resourceOwnerId: post.authorId,
    })
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const result = updatePostSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...result.data,
      publishedAt:
        result.data.status === "PUBLISHED" && !post.publishedAt
          ? new Date()
          : undefined,
    },
  });

  return NextResponse.json({ post: updated });
}

// DELETE /api/posts/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (
    !canDeletePost({
      role: session.user.role,
      userId: session.user.id,
      resourceOwnerId: post.authorId,
    })
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

---

## 9. SERVER COMPONENTS (Frontend)

### 9a. Root Layout

**File: `src/app/layout.tsx`**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "A full-stack Next.js blog",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session on the server — passes to SessionProvider for client access
  const session = await auth();

  return (
    <html lang="en">
      <body>
        {/* SessionProvider makes session available to client components */}
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

### 9b. Dashboard Layout (Protected)

**File: `src/app/(dashboard)/layout.tsx`**

```tsx
// src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// This layout wraps all /dashboard/* and /admin/* pages.
// Middleware already protects these routes, but we double-check here
// and add an extra guard for admin routes.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Belt-and-suspenders: middleware should catch this, but just in case
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-slate-50">
        <nav className="p-4">
          <p className="font-medium">{session.user.name}</p>
          <p className="text-sm text-slate-500">{session.user.role}</p>
          {/* Nav links */}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
```

### 9c. Admin Layout (Role Guard)

**File: `src/app/(dashboard)/admin/layout.tsx`**

```tsx
// src/app/(dashboard)/admin/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Second layer of defense — only ADMINs can access /admin/*
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check role on the server — never trust client-side checks alone
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard"); // Not an admin? Go to dashboard
  }

  return (
    <div>
      <header className="border-b bg-red-50 p-4">
        <span className="text-sm font-medium text-red-700">Admin Area</span>
      </header>
      {children}
    </div>
  );
}
```

---

## 10. CLIENT COMPONENTS (Frontend)

### 10a. Login Form

**File: `src/components/auth/login-form.tsx`**

```tsx
"use client";
// src/components/auth/login-form.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      // signIn returns { error: string | null, ok: boolean }
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Handle redirect manually
      });

      if (result?.error) {
        // NextAuth returns "CredentialsSignin" for invalid credentials
        setError("Invalid email or password");
        return;
      }

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh(); // Refresh server components
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Server-side error */}
      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      {/* OAuth */}
      <div className="mt-4 border-t pt-4 space-y-2">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full rounded border px-4 py-2 hover:bg-slate-50"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full rounded border px-4 py-2 hover:bg-slate-50"
        >
          Continue with GitHub
        </button>
      </div>
    </form>
  );
}
```

### 10b. Permission Hook (RBAC Client-Side)

**File: `src/hooks/use-permissions.ts`**

```typescript
"use client";
// src/hooks/use-permissions.ts
// This hook provides client-side permission checks.
// IMPORTANT: These are for UI purposes only (show/hide buttons).
// ALL real authorization must happen server-side in API routes.

import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";

export function usePermissions() {
  const { data: session } = useSession();
  const user = session?.user;

  return {
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    isEditor: user?.role === "EDITOR" || user?.role === "ADMIN",
    userId: user?.id,
    role: user?.role as Role | undefined,

    // Resource-level checks
    canEditPost(authorId: string) {
      if (!user) return false;
      if (user.role === "ADMIN" || user.role === "EDITOR") return true;
      return user.id === authorId;
    },

    canDeletePost(authorId: string) {
      if (!user) return false;
      if (user.role === "ADMIN") return true;
      return user.id === authorId;
    },
  };
}
```

---

## 11. HOW IT ALL CONNECTS — REQUEST LIFECYCLE

```
Browser Request → middleware.ts → Page/API Route

1. middleware.ts (Edge):
   - Reads JWT from cookie
   - Calls authorized() from authConfig
   - If not logged in + protected route → redirect /login
   - If logged in + auth page → redirect /dashboard

2. Page renders (Server Component):
   - Calls `auth()` to get session
   - Server layout can redirect based on role (admin check)
   - Passes data down to child components

3. Client Component:
   - Uses useSession() for reactive session state
   - Uses usePermissions() hook to show/hide UI elements

4. API Route called:
   - Calls `auth()` again (JWT validated server-side)
   - Checks role/ownership with canEditPost() etc.
   - Returns 401 (no session) or 403 (wrong role)
   - Never trusts client-sent data about permissions
```

---

## 12. RBAC PERMISSION MATRIX

| Action            | Guest | USER        | EDITOR | ADMIN |
|-------------------|-------|-------------|--------|-------|
| View published    | ✅    | ✅          | ✅     | ✅    |
| View draft (own)  | ❌    | ✅          | ✅     | ✅    |
| View draft (any)  | ❌    | ❌          | ✅     | ✅    |
| Create post       | ❌    | ✅          | ✅     | ✅    |
| Edit own post     | ❌    | ✅          | ✅     | ✅    |
| Edit any post     | ❌    | ❌          | ✅     | ✅    |
| Delete own post   | ❌    | ✅          | ❌     | ✅    |
| Delete any post   | ❌    | ❌          | ❌     | ✅    |
| View /admin       | ❌    | ❌          | ❌     | ✅    |
| Manage users      | ❌    | ❌          | ❌     | ✅    |

---

## 13. SECURITY CHECKLIST

- [x] Passwords hashed with bcrypt (12 salt rounds)
- [x] JWT secret in env vars (never hardcoded)
- [x] Session role refreshed periodically (catches role changes)
- [x] All mutations validated with Zod server-side
- [x] Authorization checked server-side in every API route
- [x] Admin routes protected at both middleware AND layout level
- [x] Never return password hash in any response
- [x] `slug` uniqueness enforced at DB level
- [x] OAuth account linking limited to same-email accounts
- [x] CSRF protected by NextAuth default headers
- [ ] Rate limiting on /api/register and /api/auth (add next)
- [ ] Email verification flow (add with Resend/Nodemailer)
- [ ] Refresh token rotation (NextAuth handles in v5)

---

## 14. SETUP COMMANDS

```bash
# Install dependencies
npm install next-auth@beta @auth/prisma-adapter prisma @prisma/client
npm install bcryptjs zod react-hook-form @hookform/resolvers
npm install -D @types/bcryptjs

# Initialize Prisma
npx prisma init

# After editing schema.prisma:
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Generate AUTH_SECRET
openssl rand -base64 32
```
