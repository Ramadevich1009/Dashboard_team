import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
    try {
        return url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('your_supabase_url_here')
    } catch {
        return false
    }
}

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

// Only show error if we are in development OR running as a server
if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
    const errorMsg = 'SUPABASE_CONFIG_WARNING: Missing or placeholder environment variables. If you see this in production, check your Vercel Environment Variables.'

    if (typeof window !== 'undefined' || isDev) {
        console.warn(errorMsg)
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' // valid-looking dummy JWT
)
