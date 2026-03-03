'use client'

import { CheckCircle2, Circle, Calendar, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

interface Task {
    id: number
    title: string
    description: string
    status: 'todo' | 'completed'
    due_date: string
    assigned_to?: string
    profiles?: {
        full_name: string
    }
}

interface TaskCardProps {
    task: Task
    onUpdate?: () => void
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
    const [loading, setLoading] = useState(false)

    const markComplete = async () => {
        setLoading(true)
        const { error } = await supabase
            .from('tasks')
            .update({ status: 'completed' })
            .eq('id', task.id)

        if (error) {
            console.error('Error updating task:', error)
        } else if (onUpdate) {
            onUpdate()
        }
        setLoading(false)
    }

    const isCompleted = task.status === 'completed'

    return (
        <div className={`p-4 rounded-xl border transition-all ${isCompleted ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-blue-100 shadow-sm hover:shadow-md'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                </div>
                <button
                    onClick={markComplete}
                    disabled={isCompleted || loading}
                    className={`mt-1 transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-blue-500 cursor-pointer'}`}
                >
                    {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-400">
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{task.due_date}</span>
                </div>
                {(task.profiles?.full_name || task.assigned_to) && (
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                        <User size={14} />
                        <span className="truncate max-w-[120px]">
                            {task.profiles?.full_name || 'Assigned User'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
