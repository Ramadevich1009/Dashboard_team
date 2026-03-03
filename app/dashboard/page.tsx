'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import TaskCard from '@/components/TaskCard'
import { PlusCircle, LogOut, LayoutDashboard, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format, isToday, isTomorrow, isBefore, startOfToday, addDays, startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'

export default function DashboardPage() {
    const [tasks, setTasks] = useState<any[]>([])
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
    const router = useRouter()

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        setProfile(profileData)
        fetchTasks(profileData)
    }

    const fetchTasks = async (userProfile: any) => {
        setLoading(true)
        let query = supabase
            .from('tasks')
            .select(`
                *,
                profiles:assigned_to (
                    full_name,
                    email
                )
            `)
            .order('due_date', { ascending: true })

        // If not admin, only show personal tasks
        if (userProfile.role !== 'admin') {
            query = query.eq('assigned_to', userProfile.id)
        }

        const { data, error } = await query

        if (!error) {
            setTasks(data || [])
        }
        setLoading(false)
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const today = startOfToday()
    const weekStart = startOfWeek(selectedDate) // Make week strip dynamic based on selection
    const weekDays = eachDayOfInterval({
        start: weekStart,
        end: addDays(weekStart, 6)
    })

    const filteredTasks = tasks.filter(t => isSameDay(new Date(t.due_date), selectedDate))

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-indigo-600 font-serif">WorkManager</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>
                    {profile?.role === 'admin' && (
                        <button
                            onClick={() => router.push('/admin/assign')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium"
                        >
                            <PlusCircle size={20} />
                            Assign Task
                        </button>
                    )}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {profile?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{profile?.full_name}</p>
                            <p className="text-xs text-gray-500 truncate">{profile?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 backdrop-blur-md bg-white/80 sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {profile?.role === 'admin' ? 'Team Overview' : 'My Tasks'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="date"
                            className="text-sm border-gray-200 rounded-lg px-2 py-1 outline-none text-gray-600 focus:border-indigo-400"
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                        <div className="text-sm text-gray-400 hidden sm:block">|</div>
                        <div className="text-sm text-gray-500 hidden sm:block font-medium">
                            {format(selectedDate, 'EEEE, MMMM do')}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto w-full">
                    {/* Date Strip */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Date</h3>
                                <div className="relative group/cal">
                                    <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                                        <CalendarIcon size={16} />
                                    </button>
                                    <input
                                        type="date"
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        value={format(selectedDate, 'yyyy-MM-dd')}
                                        onChange={(e) => setSelectedDate(new Date(e.target.value + 'T00:00:00'))}
                                    />
                                </div>
                            </div>
                            {profile?.role === 'admin' && (
                                <span className="text-xs font-semibold px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                                    Admin View
                                </span>
                            )}
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {weekDays.map((date) => {
                                const active = isSameDay(date, selectedDate)
                                return (
                                    <button
                                        key={date.toString()}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex flex-col items-center min-w-[70px] py-4 rounded-3xl transition-all ${active
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1'
                                            : 'bg-white text-gray-400 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-[10px] font-bold uppercase mb-1 opacity-70">
                                            {format(date, 'EEE')}
                                        </span>
                                        <span className="text-xl font-bold">
                                            {format(date, 'd')}
                                        </span>
                                        {isToday(date) && !active && (
                                            <div className="w-1 h-1 bg-indigo-500 rounded-full mt-2" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-sm font-bold text-gray-400">
                            {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'} for this day
                        </span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task: any) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onUpdate={() => fetchTasks(profile)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                                    <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-6 group-hover:scale-110 transition-transform">
                                        <CalendarIcon size={40} />
                                    </div>
                                    <h3 className="text-gray-900 text-xl font-bold">Free Day!</h3>
                                    <p className="text-gray-400 mt-2">No tasks assigned for {format(selectedDate, 'MMMM do')}.</p>
                                    {profile?.role === 'admin' && (
                                        <button
                                            onClick={() => router.push('/admin/assign')}
                                            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                                        >
                                            Assign One Now
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
