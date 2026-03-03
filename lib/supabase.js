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

// Only throw if we are in development OR running as a server (not during static build/export)
if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
    const errorMsg = 'INVALID_SUPABASE_CONFIG: Please set real NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables/Vercel settings.'

    if (typeof window !== 'undefined') {
        console.error(errorMsg)
    } else if (isDev) {
        throw new Error(errorMsg)
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)
