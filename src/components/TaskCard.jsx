import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Calendar, CheckSquare, Trash2, Archive, X } from 'lucide-react';
import { useTasks } from '../context/ProjectContext';
import { useDraggable } from '@dnd-kit/core';

function TaskCard({ task, onClick }) {
    const { settings, purgeTask, archiveTask } = useTasks();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
    } : undefined;

    const total = task.subtasks?.length || 0;
    const done = task.subtasks?.filter(s => s.done).length || 0;
    const pct = total === 0 ? 0 : (done / total) * 100;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const priorityStyles = {
        high: 'text-red-500 bg-red-500/10 border-red-500/20',
        medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        low: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    };

    const categoryGradient = {
        feature: 'from-indigo-500/5 to-purple-500/5 hover:to-indigo-500/10',
        bug: 'from-rose-500/5 to-orange-500/5 hover:to-rose-500/10',
        design: 'from-cyan-500/5 to-blue-500/5 hover:to-cyan-500/10',
        research: 'from-pink-500/5 to-rose-500/5 hover:to-pink-500/10'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={`group relative bg-white dark:bg-[#0d1117] p-5 rounded-[24px] border border-gray-100 dark:border-white/5 premium-shadow hover:hover:-translate-y-1.5 transition-all duration-500 cursor-grab active:cursor-grabbing overflow-hidden neon-border touch-manipulation ${isDragging ? 'opacity-50' : ''}`}
        >
            {/* Decorative Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient[task.category] || 'from-gray-500/5 to-gray-400/5'} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${priorityStyles[task.priority]}`}>
                            {task.priority}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2.5 py-1 bg-gray-50 dark:bg-white/5 rounded-full">
                            {task.category}
                        </span>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className="text-gray-300 hover:text-primary transition-colors p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
                            style={{ '--tw-hover-color': settings.accentColor }}
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-44 bg-white/95 dark:bg-[#0d1117]/95 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                                <button
                                    onClick={() => {
                                        archiveTask(task.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
                                    style={{ '--tw-hover-color': settings.accentColor }}
                                >
                                    <Archive size={14} />
                                    Archive
                                </button>
                                <button
                                    onClick={() => {
                                        purgeTask(task.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
                                >
                                    <Trash2 size={14} />
                                    Delete Task
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <h4 className="text-[14px] font-bold text-gray-800 dark:text-white mb-6 leading-relaxed">
                    {task.name}
                </h4>

                <div className="flex flex-col gap-4">
                    {/* Progress Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                            <div className="flex items-center gap-1">
                                <CheckSquare size={12} />
                                <span>{done}/{total} Subtasks</span>
                            </div>
                            <span>{Math.round(pct)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                            <Calendar size={12} />
                            <span>{(task.due_date || task.due) ? new Date(task.due_date || task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No label'}</span>
                        </div>

                        <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                            <img
                                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee || task.ownerId}`}
                                className="w-7 h-7 rounded-lg relative z-10 border-2 border-white dark:border-gray-900 shadow-sm"
                                alt="Assignee"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
