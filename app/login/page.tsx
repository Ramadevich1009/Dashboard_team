'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [session, setSession] = useState<any>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) router.push('/dashboard')
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) router.push('/dashboard')
        })

        return () => subscription.unsubscribe()
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-white">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">WorkManager</h1>
                    <p className="text-gray-500 mt-2">Sign in to manage your tasks</p>
                </div>

                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#4f46e5',
                                    brandAccent: '#4338ca',
                                },
                                radii: {
                                    borderRadiusButton: '12px',
                                    inputBorderRadius: '12px',
                                }
                            }
                        }
                    }}
                    providers={[]}
                />
            </div>
        </div>
    )
}
