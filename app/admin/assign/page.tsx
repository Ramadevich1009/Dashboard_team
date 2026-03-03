'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, FileText, Calendar, CheckCircle } from 'lucide-react'

export default function AssignTaskPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        due_date: ''
    })
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkAdmin()
        fetchUsers()
    }, [])

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            router.push('/dashboard')
        }
    }

    const fetchUsers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .order('full_name')

        if (!error) {
            setUsers(data || [])
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const { error } = await supabase
            .from('tasks')
            .insert([
                {
                    title: formData.title,
                    description: formData.description,
                    assigned_to: formData.assigned_to,
                    due_date: formData.due_date,
                    status: 'todo'
                }
            ])

        if (error) {
            setError(error.message)
        } else {
            setSuccess(true)
            setFormData({ title: '', description: '', assigned_to: '', due_date: '' })
            setTimeout(() => setSuccess(false), 3000)
        }
        setSubmitting(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 font-medium transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Assign New Task</h1>
                        <p className="text-gray-500 mt-2">Create and delegate work to team members</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FileText size={16} className="text-indigo-500" />
                                Task Title
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="What needs to be done?"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FileText size={16} className="text-indigo-500" />
                                Description
                            </label>
                            <textarea
                                placeholder="Add more details about this task..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User size={16} className="text-indigo-500" />
                                    Assign To
                                </label>
                                <select
                                    required
                                    value={formData.assigned_to}
                                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none bg-white"
                                >
                                    <option value="">Select a member</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.full_name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-500" />
                                    Due Date
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-medium flex items-center gap-2">
                                <CheckCircle size={18} />
                                Task assigned successfully!
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:transform-none transform hover:-translate-y-1 active:translate-y-0"
                        >
                            {submitting ? 'Assigning...' : 'Create Task'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
