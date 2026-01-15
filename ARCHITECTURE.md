# HustleCodeX Mobile - Architecture Documentation

## Overview

HustleCodeX Mobile is a gamified mobile application that combines profit intelligence discovery with recovery-focused personal development. This document explains how all the components connect and work together.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Authentication Flow](#authentication-flow)
7. [Database Layer](#database-layer)
8. [API Communication](#api-communication)
9. [State Management](#state-management)
10. [Data Flow](#data-flow)
11. [Key Components](#key-components)
12. [Development Workflow](#development-workflow)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      MOBILE APP (CLIENT)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Native + Expo (iOS/Android/Web)                 │ │
│  │  ┌──────────────┬──────────────┬──────────────────┐   │ │
│  │  │   UI Layer   │  State Mgmt  │   Navigation     │   │ │
│  │  │  (Screens)   │ (React Query)│  (Expo Router)   │   │ │
│  │  └──────────────┴──────────────┴──────────────────┘   │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │          tRPC Client (Type-Safe API)             │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/HTTPS (tRPC)
                            │ Bearer Token / Cookies
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (API)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js Server                                      │ │
│  │  ┌──────────────┬──────────────┬──────────────────┐   │ │
│  │  │   tRPC API   │  OAuth Routes│   Middleware     │   │ │
│  │  │  (Routers)   │  (Callback)  │  (CORS, Auth)    │   │ │
│  │  └──────────────┴──────────────┴──────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│  ┌────────────────────────┴────────────────────────┐        │
│  │  Business Logic Layer                           │        │
│  │  ┌─────────────┬──────────────┬──────────────┐ │        │
│  │  │  Database   │   Storage    │   External   │ │        │
│  │  │  Queries    │   (S3)       │   Services   │ │        │
│  │  │  (Drizzle)  │              │   (LLM, etc) │ │        │
│  │  └─────────────┴──────────────┴──────────────┘ │        │
│  └─────────────────────────────────────────────────┘        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                        │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │   Database   │    Storage   │   Manus OAuth        │    │
│  │   (MySQL)    │    (S3)      │   (Authentication)   │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React Native (v0.81.5) + React 19
- **Build Tool**: Expo (v54)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: TanStack React Query (v5)
- **Type Safety**: TypeScript (v5.9)
- **API Client**: tRPC React (v11)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v4)
- **API Layer**: tRPC (v11) - Type-safe RPC
- **Database ORM**: Drizzle ORM (v0.44)
- **Authentication**: Manus OAuth + JWT
- **Validation**: Zod (v4)
- **Serialization**: SuperJSON (for complex types)

### Database
- **Primary Database**: MySQL/TiDB
- **Migration Tool**: Drizzle Kit
- **Schema**: Drizzle ORM Schema

### Development Tools
- **Package Manager**: pnpm (v9.12)
- **Testing**: Vitest (v2)
- **Linting**: ESLint
- **Formatting**: Prettier
- **Build**: esbuild (for production)

---

## Directory Structure

```
hustlecodex-mobile/
├── app/                          # Frontend: Screens & Routes
│   ├── (tabs)/                   # Tab-based navigation group
│   │   ├── _layout.tsx           # Tab navigator configuration
│   │   ├── index.tsx             # Home screen (Dashboard)
│   │   ├── opportunities.tsx     # Opportunities screen
│   │   ├── console.tsx           # Console monitoring screen
│   │   └── profile.tsx           # User profile screen
│   ├── oauth/                    # OAuth authentication screens
│   │   └── callback.tsx          # OAuth callback handler
│   └── _layout.tsx               # Root layout (providers setup)
│
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   ├── screen-container.tsx      # Screen wrapper
│   └── themed-view.tsx           # Theme-aware components
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts               # Authentication hook
│   └── use-colors.ts             # Theme colors hook
│
├── lib/                          # Frontend libraries & utilities
│   ├── _core/                    # Core framework code
│   │   ├── api.ts                # API helper functions
│   │   ├── auth.ts               # Auth token management
│   │   └── manus-runtime.ts      # Platform integration
│   ├── trpc.ts                   # tRPC client setup
│   └── utils.ts                  # Utility functions
│
├── server/                       # Backend: API & Business Logic
│   ├── _core/                    # Core server framework
│   │   ├── index.ts              # Server entry point
│   │   ├── context.ts            # tRPC context (auth, req, res)
│   │   ├── trpc.ts               # tRPC setup & procedures
│   │   ├── oauth.ts              # OAuth implementation
│   │   ├── sdk.ts                # SDK utilities
│   │   ├── llm.ts                # LLM integration
│   │   └── env.ts                # Environment variables
│   ├── routers.ts                # API route definitions
│   ├── db.ts                     # Database query helpers
│   └── storage.ts                # File storage (S3) helpers
│
├── drizzle/                      # Database schema & migrations
│   ├── schema.ts                 # Database table definitions
│   ├── relations.ts              # Table relationships
│   └── migrations/               # SQL migration files
│
├── shared/                       # Shared code (client & server)
│   ├── types.ts                  # Shared TypeScript types
│   └── const.ts                  # Shared constants
│
├── constants/                    # Frontend constants
│   ├── theme.ts                  # Theme configuration
│   └── oauth.ts                  # OAuth configuration
│
├── tests/                        # Test files
│   └── *.test.ts                 # Unit & integration tests
│
├── assets/                       # Static assets (images, fonts)
├── scripts/                      # Build & deployment scripts
│
└── Configuration Files
    ├── package.json              # Dependencies & scripts
    ├── tsconfig.json             # TypeScript configuration
    ├── tailwind.config.js        # Tailwind CSS config
    ├── app.config.ts             # Expo configuration
    ├── drizzle.config.ts         # Database config
    └── babel.config.js           # Babel transpiler config
```

---

## Frontend Architecture

### Navigation Structure

The app uses **Expo Router** for file-based navigation:

```
app/
├── _layout.tsx                   # Root: Setup providers & navigation
└── (tabs)/                       # Tab Group: Main app screens
    ├── _layout.tsx               # Tabs: Bottom tab navigation
    ├── index.tsx                 # Tab 1: Home Dashboard
    ├── opportunities.tsx         # Tab 2: Opportunities List
    ├── console.tsx               # Tab 3: Console Monitoring
    └── profile.tsx               # Tab 4: User Profile
```

**Navigation Flow:**
1. App loads → `app/_layout.tsx` initializes providers
2. Providers wrap entire app (Query Client, tRPC, Theme, Safe Area)
3. Default route → `(tabs)` group (main app)
4. Tab navigator → Shows 4 bottom tabs

### Provider Hierarchy

```tsx
// app/_layout.tsx
<ThemeProvider>                    // Theme context (colors)
  <SafeAreaProvider>               // Safe area insets (notch, etc)
    <GestureHandlerRootView>       // Gesture handling
      <trpc.Provider>              // tRPC client
        <QueryClientProvider>      // React Query cache
          <Stack>                  // Navigation stack
            <Routes />
          </Stack>
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  </SafeAreaProvider>
</ThemeProvider>
```

**Key Points:**
- **ThemeProvider**: Manages dark/light theme state
- **SafeAreaProvider**: Handles device-specific spacing (notch, home indicator)
- **tRPC Provider**: Enables type-safe API calls
- **QueryClientProvider**: Caches server data, handles loading states
- **Stack Navigator**: Manages screen transitions

### Screen Components

Each screen follows this pattern:

```tsx
// Example: app/(tabs)/index.tsx
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function HomeScreen() {
  // 1. Fetch data using tRPC
  const { data, isLoading } = trpc.items.list.useQuery();
  
  // 2. Handle loading/error states
  if (isLoading) return <ActivityIndicator />;
  
  // 3. Render UI
  return (
    <ScreenContainer>
      {/* Screen content */}
    </ScreenContainer>
  );
}
```

### State Management Strategy

**React Query** handles all server state:
- Query caching & invalidation
- Loading states
- Error handling
- Optimistic updates
- Background refetching

**Local State** (useState/useReducer):
- UI state (modals, selected items)
- Form inputs
- Temporary UI animations

**Global State** (Context):
- Authentication state (useAuth hook)
- Theme preferences
- Safe area insets

---

## Backend Architecture

### Server Initialization

```typescript
// server/_core/index.ts
┌──────────────────────────────────────────────────────┐
│ 1. Create Express App                                │
│    - Enable CORS (reflect origin for credentials)   │
│    - Parse JSON bodies (50mb limit)                  │
├──────────────────────────────────────────────────────┤
│ 2. Register OAuth Routes                             │
│    - /oauth/login (redirect to OAuth provider)       │
│    - /oauth/callback (exchange code for token)       │
├──────────────────────────────────────────────────────┤
│ 3. Register Health Check                             │
│    - GET /api/health (returns { ok: true })          │
├──────────────────────────────────────────────────────┤
│ 4. Register tRPC Middleware                          │
│    - POST /api/trpc (handle all API calls)           │
│    - Creates context (auth, req, res)                │
│    - Routes to appropriate procedure                 │
├──────────────────────────────────────────────────────┤
│ 5. Start Server                                      │
│    - Find available port (default 3000)              │
│    - Listen for connections                          │
└──────────────────────────────────────────────────────┘
```

### tRPC Architecture

**Request Flow:**

```
Client                           Server
  │                                │
  │  trpc.items.list.useQuery()   │
  ├───────────────────────────────>│
  │  POST /api/trpc                │
  │  { queries: [...] }            │
  │                                │
  │                          ┌─────▼─────┐
  │                          │  Context  │
  │                          │ Creation  │
  │                          └─────┬─────┘
  │                                │
  │                          ┌─────▼─────┐
  │                          │  Router   │
  │                          │  Lookup   │
  │                          └─────┬─────┘
  │                                │
  │                          ┌─────▼─────┐
  │                          │ Procedure │
  │                          │ Execution │
  │                          └─────┬─────┘
  │                                │
  │  { result: [...] }            │
  │<───────────────────────────────┤
  │                                │
```

**Router Structure:**

```typescript
// server/routers.ts
export const appRouter = router({
  system: systemRouter,           // System utilities
  
  auth: router({                  // Authentication
    me: publicProcedure.query(),  // Get current user
    logout: publicProcedure.mutation(),
  }),
  
  // Feature routers (TODO: add your features here)
  items: router({
    list: protectedProcedure.query(),
    create: protectedProcedure.mutation(),
  }),
});
```

**Procedure Types:**

1. **publicProcedure**: No authentication required
   - Anyone can call
   - `ctx.user` may be null

2. **protectedProcedure**: Authentication required
   - Throws UNAUTHORIZED if not logged in
   - `ctx.user` is guaranteed to exist

### Context Creation

Every tRPC call creates a context:

```typescript
// server/_core/context.ts
type TrpcContext = {
  req: Request,       // Express request object
  res: Response,      // Express response object
  user: User | null,  // Authenticated user (if any)
};

async function createContext(opts) {
  // 1. Extract request & response
  const { req, res } = opts;
  
  // 2. Attempt to authenticate
  let user = null;
  try {
    user = await sdk.authenticateRequest(req);
  } catch {
    user = null;  // Auth is optional
  }
  
  // 3. Return context
  return { req, res, user };
}
```

---

## Authentication Flow

### Native Apps (iOS/Android)

**Bearer Token Authentication:**

```
┌─────────────┐                              ┌──────────────┐
│   Client    │                              │ Manus OAuth  │
└──────┬──────┘                              └──────┬───────┘
       │                                            │
       │ 1. User taps Login                        │
       ├──────────────────────────────────────────>│
       │    WebBrowser.openAuthSessionAsync()      │
       │                                            │
       │ 2. User authenticates                     │
       │                                            │
       │ 3. Redirect with code                     │
       │<───────────────────────────────────────────┤
       │    myapp://oauth/callback?code=...        │
       │                                            │
┌──────▼──────┐                              ┌──────────────┐
│   Client    │                              │   Backend    │
└──────┬──────┘                              └──────┬───────┘
       │                                            │
       │ 4. Exchange code for token                │
       ├──────────────────────────────────────────>│
       │    POST /oauth/callback                   │
       │                                            │
       │ 5. Return session token                   │
       │<───────────────────────────────────────────┤
       │    { token: "jwt..." }                    │
       │                                            │
       │ 6. Store token in SecureStore             │
       │                                            │
       │ 7. All API calls include token            │
       ├──────────────────────────────────────────>│
       │    Authorization: Bearer <token>          │
       │                                            │
```

**Storage:**
- Token → `expo-secure-store` (encrypted)
- User info → `@react-native-async-storage/async-storage`

### Web App

**Cookie-Based Authentication:**

```
┌─────────────┐                              ┌──────────────┐
│   Browser   │                              │ Manus OAuth  │
└──────┬──────┘                              └──────┬───────┘
       │                                            │
       │ 1. User clicks Login                      │
       ├──────────────────────────────────────────>│
       │    Redirect to OAuth portal               │
       │                                            │
       │ 2. User authenticates                     │
       │                                            │
       │ 3. Redirect back with cookie              │
       │<───────────────────────────────────────────┤
       │    Set-Cookie: session=...                │
       │                                            │
┌──────▼──────┐                              ┌──────────────┐
│   Browser   │                              │   Backend    │
└──────┬──────┘                              └──────┬───────┘
       │                                            │
       │ 4. All requests include cookie            │
       ├──────────────────────────────────────────>│
       │    Cookie: session=...                    │
       │                                            │
```

**Storage:**
- Session → HTTP-only cookie (automatic)
- User info → localStorage (cached for fast access)

### useAuth Hook

Unified authentication hook for all platforms:

```typescript
// hooks/use-auth.ts
const { user, isAuthenticated, loading, logout } = useAuth();

// States:
// - loading: true → Checking authentication
// - isAuthenticated: true → User is logged in
// - user: {...} → User data available
```

**Platform Detection:**
- Web: Fetch user from API (cookie-based)
- Native: Check token in SecureStore

---

## Database Layer

### Schema Definition

```typescript
// drizzle/schema.ts
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

// Add more tables here...
```

### Query Helpers

```typescript
// server/db.ts
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  
  return result[0];
}
```

### Migration Workflow

```bash
# 1. Edit schema in drizzle/schema.ts
# 2. Generate & apply migrations
pnpm db:push

# This runs:
# - drizzle-kit generate (create SQL migration)
# - drizzle-kit migrate (apply to database)
```

---

## API Communication

### tRPC Client Setup

```typescript
// lib/trpc.ts
export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${API_BASE_URL}/api/trpc`,
        transformer: superjson,  // Handle Date, Map, Set, etc.
        
        // Attach auth token
        async headers() {
          const token = await getSessionToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        
        // Include cookies (web)
        fetch(url, options) {
          return fetch(url, { ...options, credentials: "include" });
        },
      }),
    ],
  });
}
```

### Using tRPC in Components

**Queries (Read Data):**

```typescript
// Fetch data
const { data, isLoading, error } = trpc.items.list.useQuery();

// With parameters
const { data } = trpc.items.get.useQuery({ id: 123 });

// Manual refetch
const { refetch } = trpc.items.list.useQuery();
```

**Mutations (Write Data):**

```typescript
const mutation = trpc.items.create.useMutation({
  onSuccess: () => {
    // Invalidate queries to refetch
    utils.items.list.invalidate();
  },
  onError: (error) => {
    console.error("Failed:", error);
  },
});

// Call mutation
mutation.mutate({ title: "New Item" });

// Or with async/await
await mutation.mutateAsync({ title: "New Item" });
```

### Request Batching

tRPC automatically batches multiple queries into a single HTTP request:

```typescript
// These 3 queries become 1 HTTP request
const q1 = trpc.items.list.useQuery();
const q2 = trpc.stats.get.useQuery();
const q3 = trpc.profile.me.useQuery();
```

---

## State Management

### Server State (React Query)

**Managed by React Query:**
- User data
- Opportunities list
- Console metrics
- Profile information

**Features:**
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

### Local State (React Hooks)

**useState for:**
- Form inputs
- Modal visibility
- Selected items
- UI animations

**Example:**
```typescript
const [selectedId, setSelectedId] = useState<string | null>(null);
const [isExpanded, setIsExpanded] = useState(false);
```

### Global State (Context)

**useAuth (Authentication):**
```typescript
const { user, isAuthenticated, logout } = useAuth();
```

**useColors (Theme):**
```typescript
const colors = useColors();
// { primary, secondary, background, foreground, ... }
```

---

## Data Flow

### Complete Request Flow

```
┌────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                             │
│    User taps "Create Item" button                          │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 2. COMPONENT CALLS tRPC MUTATION                           │
│    mutation.mutate({ title: "New Item" })                  │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 3. tRPC CLIENT                                             │
│    - Serialize input with SuperJSON                        │
│    - Attach auth token to headers                          │
│    - Send POST /api/trpc                                   │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 4. EXPRESS SERVER                                          │
│    - CORS middleware (allow credentials)                   │
│    - Body parser (parse JSON)                              │
│    - Route to tRPC middleware                              │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 5. tRPC CONTEXT CREATION                                   │
│    - Extract Bearer token or cookie                        │
│    - Verify JWT signature                                  │
│    - Load user from database                               │
│    - Create context { req, res, user }                     │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 6. tRPC PROCEDURE                                          │
│    - Validate input with Zod schema                        │
│    - Check authentication (protectedProcedure)             │
│    - Execute business logic                                │
│    - Call database query                                   │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 7. DATABASE                                                │
│    - Execute SQL query (via Drizzle ORM)                   │
│    - Return result                                         │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 8. RESPONSE                                                │
│    - Serialize result with SuperJSON                       │
│    - Send JSON response                                    │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 9. tRPC CLIENT                                             │
│    - Deserialize with SuperJSON                            │
│    - Update React Query cache                              │
│    - Trigger onSuccess callback                            │
└───────────────────────┬────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────┐
│ 10. COMPONENT RE-RENDERS                                   │
│     - New data available                                   │
│     - UI updates automatically                             │
└────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. App Entry Point

**File:** `app/_layout.tsx`

**Purpose:** Root layout that sets up all providers

**Key Features:**
- Initializes tRPC client
- Creates React Query client
- Configures safe area handling
- Sets up theme provider
- Configures navigation

### 2. Tab Navigator

**File:** `app/(tabs)/_layout.tsx`

**Purpose:** Bottom tab navigation configuration

**Screens:**
- Home (index.tsx)
- Opportunities (opportunities.tsx)
- Console (console.tsx)
- Profile (profile.tsx)

### 3. Home Screen

**File:** `app/(tabs)/index.tsx`

**Features:**
- User level & XP display
- Daily quests system
- Streak counter
- Quick stats cards
- Motivational content

**State:**
- Local state for UI (useState)
- Would use tRPC queries for real data

### 4. Opportunities Screen

**File:** `app/(tabs)/opportunities.tsx`

**Features:**
- Profit-ranked opportunities
- Expandable cards
- Filtering options
- Success metrics display

**Data:**
- Currently uses mock data
- Would connect to tRPC endpoint

### 5. Console Screen

**File:** `app/(tabs)/console.tsx`

**Features:**
- Real-time metrics (CPU, memory, etc.)
- Active alerts display
- Integration toggles
- System status overview

**Updates:**
- Simulated real-time updates (useEffect)
- Would use tRPC subscriptions in production

### 6. Server Entry

**File:** `server/_core/index.ts`

**Purpose:** Express server initialization

**Responsibilities:**
- Create HTTP server
- Configure middleware (CORS, body parser)
- Register OAuth routes
- Mount tRPC handler
- Start listening on port

### 7. API Router

**File:** `server/routers.ts`

**Purpose:** Define all tRPC endpoints

**Current Routes:**
- `system.*` - System utilities
- `auth.me` - Get current user
- `auth.logout` - Logout user

**Extension Point:**
Add new routers here for features

### 8. Database Helpers

**File:** `server/db.ts`

**Purpose:** Database query functions

**Current Functions:**
- `getDb()` - Get database instance
- `upsertUser()` - Create/update user
- `getUserByOpenId()` - Find user by OAuth ID

**Extension Point:**
Add feature-specific queries here

### 9. Auth Hook

**File:** `hooks/use-auth.ts`

**Purpose:** Authentication state management

**Provides:**
- `user` - Current user object
- `isAuthenticated` - Boolean flag
- `loading` - Loading state
- `logout()` - Logout function
- `refresh()` - Refetch user

---

## Development Workflow

### Starting Development

```bash
# Install dependencies
pnpm install

# Start development server (both API & Metro)
pnpm dev

# This runs concurrently:
# 1. Backend: tsx watch server/_core/index.ts
# 2. Frontend: expo start --web
```

### Development URLs

- **Web App:** http://localhost:8081
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health

### Type Checking

```bash
# Check TypeScript types
pnpm check

# This runs: tsc --noEmit
```

### Linting & Formatting

```bash
# Lint code
pnpm lint

# Format code
pnpm format
```

### Testing

```bash
# Run tests
pnpm test

# This runs: vitest run
```

### Database Operations

```bash
# Generate & apply migrations
pnpm db:push

# This runs:
# 1. drizzle-kit generate (create migration)
# 2. drizzle-kit migrate (apply to DB)
```

### Building for Production

```bash
# Build backend
pnpm build

# This runs: esbuild server/_core/index.ts --bundle
# Output: dist/index.js

# Start production server
pnpm start

# This runs: NODE_ENV=production node dist/index.js
```

### Mobile Development

```bash
# Run on iOS
pnpm ios

# Run on Android
pnpm android

# Generate QR code for Expo Go
pnpm qr
```

---

## Environment Variables

### Required Variables

**Backend (.env):**
```bash
DATABASE_URL=mysql://user:pass@host:3306/database
JWT_SECRET=your-secret-key
OAUTH_SERVER_URL=https://oauth.manus.dev
OWNER_OPEN_ID=owner-user-id
```

**Frontend (Expo):**
```bash
EXPO_PUBLIC_APP_ID=your-app-id
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_OAUTH_PORTAL_URL=https://oauth.manus.dev
```

---

## Summary

### How Everything Connects

1. **User opens app** → Expo Router loads `app/_layout.tsx`

2. **Providers initialize:**
   - tRPC client connects to backend
   - React Query manages cache
   - Theme & Safe Area providers wrap UI

3. **Navigation loads** → Bottom tabs render 4 screens

4. **Screen renders** → Calls `trpc.*.useQuery()` to fetch data

5. **tRPC request:**
   - Client serializes request
   - Sends to `/api/trpc`
   - Includes auth token

6. **Server receives:**
   - Express routes to tRPC handler
   - Creates context (auth user)
   - Executes procedure
   - Queries database (Drizzle ORM)

7. **Response returns:**
   - Serialized with SuperJSON
   - React Query caches result
   - Component re-renders with data

8. **User sees updated UI** → Cycle repeats for interactions

### Key Technologies

- **Expo Router**: File-based navigation
- **tRPC**: Type-safe API (no code generation)
- **React Query**: Server state management
- **Drizzle ORM**: Type-safe database queries
- **NativeWind**: Tailwind for React Native
- **SuperJSON**: Serialize complex types (Date, Map, etc.)
- **Manus OAuth**: Authentication provider

### Extension Points

To add new features:

1. **Database**: Add tables in `drizzle/schema.ts`
2. **Queries**: Add helpers in `server/db.ts`
3. **API**: Add routers in `server/routers.ts`
4. **UI**: Create screens in `app/` directory
5. **Components**: Add to `components/` directory

The architecture is designed to be:
- **Type-safe**: End-to-end TypeScript
- **Modular**: Clear separation of concerns
- **Scalable**: Easy to add features
- **Developer-friendly**: Fast feedback loop
