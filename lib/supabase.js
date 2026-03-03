import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
    try {
        return url && (url.startsWith('http://') || url.startsWith('https://'))
    } catch {
        return false
    }
}

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    throw new Error(
        'INVALID_SUPABASE_CONFIG: You are using placeholder values in .env.local. ' +
        'Please replace "your_supabase_url_here" with your actual project URL from the Supabase Dashboard.'
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
