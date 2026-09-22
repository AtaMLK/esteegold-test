This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Production environment

Set these in Vercel for the production project:

- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_SUPABASE_PROJECT_URL
- NEXT_PUBLIC_SUPABASE_API_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_EMAILS
- IYZIPAY_API_KEY
- IYZIPAY_SECRET_KEY
- IYZIPAY_URI
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- ORDER_NOTIFICATION_EMAIL
- NEXT_PUBLIC_INSTAGRAM_URL (optional)

Never commit service-role, iyzico, or Resend secrets to Git.

## Supabase launch migration

After merging this branch to the production branch, apply the migrations to the production Supabase project. The launch-hardening migration repairs the pricing-settings relation, adds configurable jewelry options, creates the product-media bucket/table if needed, and creates clearly labeled demo orders for admin testing.

## Media

Product images are optimized to WebP in the admin browser before direct upload to Supabase Storage. Product videos are limited to 15 seconds and 15 MB. Larger uploads should use resumable storage uploads rather than passing binary data through the Next.js route.

## Admin order email

Order notifications use the Resend HTTP API from the server. The notification is intentionally non-blocking: a mail-provider failure does not turn a successfully paid order into a failed payment.

## Google sign-in

The Google consent-screen branding is configured in Google Cloud, not in the Next.js code. The OAuth client must use the Supabase Auth callback URL and the production site URL must be present in Supabase Auth redirect settings. Configure the Google OAuth consent screen with the EsteeHouse app name, logo and verified domain before launch.
