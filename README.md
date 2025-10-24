# Maya Research - Google Authentication & Dashboard

A modern research platform with Google OAuth authentication powered by Supabase and Astro.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Google Cloud Console project with OAuth 2.0 credentials

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example and fill in your values
cp .env.example .env
```

Then edit `.env` with your Supabase credentials:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://nxwuhwavvyjppmzyfybh.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54d3Vod2F2dnlqcHBtenlmeWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDM1MzQsImV4cCI6MjA3NjgxOTUzNH0.djJYNNsQ9ZfZ_q7z9jbd31TTuUWowiHllZ3cdujq5Io
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54d3Vod2F2dnlqcHBtenlmeWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI0MzUzNCwiZXhwIjoyMDc2ODE5NTM0fQ.tgzRAZWnKprkrfX4KG8Mp0eTOJlCf_20IS7UZnDQ-oA

# Database Configuration (for Drizzle ORM)
DATABASE_URL=postgresql://postgres:enterprise@db.nxwuhwavvyjppmzyfybh.supabase.co:5432/postgres
```

### 3. Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication > Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials (Client ID and Secret)
5. Configure authorized redirect URIs:
   - Development: `http://localhost:4321/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 4. Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:4321`
   - Your Supabase project URL
7. Add authorized redirect URIs:
   - Get this from your Supabase Google provider settings
   - It will look like: `https://nxwuhwavvyjppmzyfybh.supabase.co/auth/v1/callback`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## 📁 Project Structure

```
enterprise_maya/
├── src/
│   ├── components/
│   │   └── ui/                    # Reusable UI components
│   ├── layouts/
│   │   └── Layout.astro           # Base layout
│   ├── lib/
│   │   ├── config/
│   │   │   ├── supabase.ts        # Client-side Supabase config
│   │   │   └── supabase-server.ts # Server-side Supabase config
│   │   ├── db/
│   │   │   ├── index.ts           # Drizzle database instance
│   │   │   └── schema.ts          # Database schema
│   │   ├── store/
│   │   │   └── authStore.ts       # Auth state management
│   │   ├── types/
│   │   │   └── auth.ts            # Auth TypeScript types
│   │   └── utils/
│   │       └── auth.ts            # Auth utility functions
│   └── pages/
│       ├── api/
│       │   └── auth/
│       │       ├── callback.ts    # OAuth callback handler
│       │       └── signout.ts     # Sign out endpoint
│       ├── dashboard/
│       │   ├── _components/       # Dashboard-specific components
│       │   └── index.astro        # Protected dashboard page
│       ├── login/
│       │   ├── _components/       # Login-specific components
│       │   └── index.astro        # Login page
│       └── index.astro            # Home (redirects)
├── working-memory/                # Feature planning and tracking
├── drizzle.config.ts              # Drizzle ORM configuration
└── .env                           # Environment variables (create this!)
```

## 🔐 Authentication Flow

1. User visits home page → redirected to `/login` if not authenticated
2. User clicks "Continue with Google" → redirected to Google OAuth
3. User authorizes → Google redirects to `/auth/callback` with code
4. Callback exchanges code for session → Supabase sets cookies automatically
5. User redirected to `/dashboard` → server validates session
6. Protected routes check session on every request

## 🛠️ Key Features

- ✅ Google OAuth authentication via Supabase
- ✅ Automatic token refresh by Supabase
- ✅ Server-side session validation
- ✅ Protected dashboard route
- ✅ Beautiful, responsive UI with Tailwind CSS
- ✅ TypeScript strict mode
- ✅ Drizzle ORM for database operations
- ✅ Modern React 19 components

## 🔧 Tech Stack

- **Framework**: Astro 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **State Management**: Nanostores
- **Language**: TypeScript (strict mode)

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔒 Security Features

- HTTP-only cookies for session storage
- Server-side session validation on protected routes
- Automatic token refresh by Supabase
- Secure cookie settings (httpOnly, secure, sameSite)
- CSRF protection via Supabase

## 📊 Database Schema

The application uses the following database schema:

```typescript
users {
  id: UUID (primary key)
  email: TEXT (unique, not null)
  fullName: TEXT
  avatarUrl: TEXT
  provider: TEXT (default: 'google')
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables" error

Make sure you've created a `.env` file in the root directory with all required variables. Restart the dev server after creating the file.

### Google OAuth not working

1. Verify Google OAuth is enabled in Supabase dashboard
2. Check that redirect URIs match exactly in both Supabase and Google Cloud Console
3. Ensure your Google OAuth credentials are correctly configured in Supabase

### Session not persisting

Clear your browser cookies and try again. Make sure cookies are enabled in your browser.

## 📚 Documentation

- [Astro Documentation](https://docs.astro.build)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

MIT

## 🤝 Contributing

This is a research platform project. Please follow the coding standards defined in `.cursorrules/`.
# enterprise
