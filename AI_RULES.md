# Tech Stack

- **Framework**: Next.js 14 with App Router (React 18)
- **Styling**: Tailwind CSS (custom color palette with AlbaniaTours brand colors: primary red `#C1272D`, secondary blue `#004D60`, turquoise `#40E0D0`, and golden accent `#D4AF37`)
- **Database & Auth**: Supabase (PostgreSQL) for data storage and authentication
- **Payments**: Stripe for processing payments with custom checkout flow
- **Email**: Resend for sending transactional emails (booking confirmations, cancellations, partner notifications)
- **Icons**: Lucide React icon library
- **Type Safety**: TypeScript for all source code
- **Forms & Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

# Library Usage Guidelines

## Authentication & User Management
- Use **Supabase** for all authentication (sign-up, login, password reset, sessions)
- Use `@supabase/ssr` and `@supabase/supabase-js` for server-side and client-side Supabase operations
- Always use `createClient()` from `@/lib/supabase/client.ts` for browser-based Supabase operations
- Use the `AuthGate` component for role-based access control and authorization (enforces email verification + admin approval for privileged roles)

## Database Operations
- Use **Supabase JavaScript client** for all PostgreSQL interactions
- Server-side: Use `createClient()` from `@/lib/supabase/server.ts`
- Client-side: Use `createClient()` from `@/lib/supabase/client.ts`
- Store user profiles in the `profiles` table with `role` and `is_approved` fields
- Never write raw SQL in application code; use Supabase's JavaScript API

## Payments & Stripe Integration
- Use **Stripe.js** (`@stripe/stripe-js`) for loading Stripe and card elements
- Use **Stripe Node.js SDK** (`stripe`) for backend operations (payment intents, webhooks)
- Create payment intents via `/api/stripe/create-payment-intent` route
- Handle Stripe webhooks at `/api/webhooks/stripe` for payment confirmation events
- Always calculate commissions using the `src/lib/commissionEngine.ts` logic
- Use `clsx` and `tailwind-merge` for conditional styling of payment components

## Email Notifications
- Use **Resend** for all email sending operations
- Define templates in `src/lib/email.ts` with the `EMAIL_TEMPLATES` object
- Use `sendEmail()` for customer emails (registration, bookings, cancellations, payments)
- Use `sendAdminNotification()` for critical system alerts
- Email templates must include both Albanian and English versions

## Forms & Validation
- Use **Zod** for all form validation schemas
- Define schemas in `src/lib/` or alongside page components
- Validate API route inputs using Zod before database operations
- Return validation errors to the frontend with clear messages

## Images & Media
- Store images in the `public/` directory for static assets
- Use Supabase Storage for user-uploaded images (accommodation photos, profile pictures)
- Use the `ImageUpload` component for image upload functionality

## Date & Time
- Use **date-fns** for all date parsing, formatting, and manipulation
- Use **node-ical** for handling iCalendar `.ics` file imports/exports
- Sync availability calendars with `/api/sync-ical` route
- Format dates consistently: `dd.MM.yyyy` for user-facing displays

## Internationalization
- Support both Albanian and English languages
- Use translation context from `src/context/LanguageContext.tsx`
- Store translations in `src/lib/translations.ts` and `src/config/i18n.ts`
- Set locale based on user selection and environment variables

## Admin & Partner Features
- Separate authentication realm for admin and partner users
- Admin routes protected by `AuthGate` with `requiredRoles={['admin']}`
- Partner routes protected by `AuthGate` with `requiredRoles={['partner']}`
- Use `CommissionManager` component for managing partner commissions
- Moderation queue for user complaints and content approval

## API Routes
- Use Next.js App Router API routes (`src/app/api/.../route.ts`)
- Export `GET`, `POST`, `PUT`, `DELETE` functions as named exports
- Always validate inputs using Zod schemas
- Return JSON responses with consistent structure: `{ success: boolean; data?: any; error?: string }`
- Handle Stripe webhooks with proper signature verification

## Styling & UI Components
- Use **Tailwind CSS** for all styling (no CSS files unless absolutely necessary)
- Follow the AlbaniaTours color palette in `tailwind.config.js`
- Use shadcn/ui components where available (install with `npx shadcn-ui add [component]`)
- Use ` lucide-react` for iconography
- Style auth pages to match app colors—never use default library styles
- Ensure all components are responsive (mobile-first approach)

## Testing & Deployment
- Run tests with `npm run dev` for local development
- Build with `npm run build` and test in production mode with `npm run start`
- Lint code with `npm run lint` before committing
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `ADMIN_EMAIL`
