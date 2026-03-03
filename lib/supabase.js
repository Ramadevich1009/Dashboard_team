import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' // dummy JWT

// Silently create the client. If the keys are invalid, it will only error when you try to fetch data.
// This ensures the NEXT.JS BUILD always passes regardless of environment variables.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
