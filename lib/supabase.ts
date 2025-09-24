// IMPORTANT: This file contains placeholder credentials.
// For this app to work, you MUST replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_ANON_KEY'
// with your actual Supabase project credentials.

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

// ▼▼▼ I have configured the app with the credentials you provided. ▼▼▼
const supabaseUrl = 'https://ztiowmnflwpeqjdpkjrv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0aW93bW5mbHdwZXFqZHBranJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzkwOTMsImV4cCI6MjA3NDMxNTA5M30.kscSMbc1GB-qRDgguxvN92erXFzYqt9JV1HVqhwlpT0';
// ▲▲▲ IMPORTANT: It is recommended to invalidate these keys and generate new ones. ▲▲▲

// FIX: Removed the unnecessary configuration check. Since credentials are provided,
// the check was causing a TypeScript error and was redundant.
// The Supabase client is now created directly.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);


/*
================================================================================
🚀 QUICKDELIVER SUPABASE SETUP INSTRUCTIONS 🚀
================================================================================

1.  **Create a Supabase Project:**
    - Go to https://supabase.com/dashboard/projects and click "New project".
    - Give your project a name (e.g., "quickdeliver") and set a strong database password.
    - Choose a region and pricing plan (the free tier is sufficient to start).
    - Wait for your project to be provisioned.

2.  **Add Your Project Credentials:**
    - In your project dashboard, go to Settings > API.
    - Find your Project URL and the `anon` public key.
    - **In this file (`lib/supabase.ts`), scroll up and replace the placeholder values for `supabaseUrl` and `supabaseAnonKey` with your credentials.**
    - ‼️ SECURITY WARNING: Do not commit this file with your real keys to a public git repository.

3.  **Create Database Tables:**
    - In your project dashboard, go to the "SQL Editor".
    - Click "New query".
    - Copy the entire SQL script below and paste it into the editor.
    - Click "RUN" to create the `users`, `orders`, and `reviews` tables.

    -- SQL SCRIPT TO COPY AND RUN --

    -- Create orders table
    CREATE TABLE orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id uuid REFERENCES auth.users(id) NOT NULL,
        pickup TEXT NOT NULL,
        destination TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending', -- e.g., pending, accepted, pickup, enroute, delivered, cancelled
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Create reviews table
    CREATE TABLE reviews (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id uuid REFERENCES auth.users(id) NOT NULL,
        order_id uuid REFERENCES orders(id) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Enable Realtime on tables
    -- Go to Database > Replication in the Supabase dashboard.
    -- Click on "0 tables" under "Source" and enable replication for `orders` and `reviews`.

    -- Enable Row Level Security (RLS)
    -- This is CRITICAL for production security.
    -- Go to Authentication > Policies in the Supabase dashboard.
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

    -- Create RLS Policies
    -- Allow users to see and manage their own orders
    CREATE POLICY "Users can view their own orders." ON orders
        FOR SELECT USING (auth.uid() = client_id);
    CREATE POLICY "Users can create their own orders." ON orders
        FOR INSERT WITH CHECK (auth.uid() = client_id);
    CREATE POLICY "Users can update their own pending orders." ON orders
        FOR UPDATE USING (auth.uid() = client_id AND status = 'pending');

    -- Allow users to see and manage their own reviews
    CREATE POLICY "Users can view their own reviews." ON reviews
        FOR SELECT USING (auth.uid() = client_id);
    CREATE POLICY "Users can create reviews for their own orders." ON reviews
        FOR INSERT WITH CHECK (auth.uid() = client_id);

4.  **Run the App:**
    - After updating the credentials in this file, open `index.html` in your browser.
    - Your QuickDeliver app should now be running locally and connected to your Supabase backend!

================================================================================
*/