import { useState, useEffect } from 'react';
import { useTasks } from '../context/ProjectContext';
import { Edit3, Trash2, ChevronRight, LayoutGrid, Info, Calendar, Shield, Rocket, Activity, X, Target, FileText } from 'lucide-react';
import Modal from './Modal';

function ListView() {
    const { tasks, activeFilter, archiveTask, settings, updateTask } = useTasks();
    const [selectedTask, setSelectedTask] = useState(null);
    const [editedTask, setEditedTask] = useState(null);

    useEffect(() => {
        if (selectedTask) setEditedTask({ ...selectedTask });
    }, [selectedTask]);

    const handleSave = async () => {
        if (!editedTask) return;
        await updateTask(editedTask.id, editedTask);
        setSelectedTask(null);
    };

    let listTasks = tasks;
    if (activeFilter === 'high') {
        listTasks = tasks.filter(t => t.priority === 'high');
    }

    const priorityColors = {
        low: 'bg-blue-500/10 text-blue-500',
        medium: 'bg-amber-500/10 text-amber-500',
        high: 'bg-rose-500/10 text-rose-500 animate-pulse'
    };

    return (
        <div className="p-4 md:p-10 h-full overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 px-2 md:px-4 gap-6">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm">
                            <LayoutGrid size={24} className="text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">Activity Log</h2>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] mt-1 ml-0.5"> Detailed audit and task monitoring </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-white/80 dark:bg-white/[0.03] px-8 py-4 rounded-[24px] border border-gray-100 dark:border-white/10 backdrop-blur-xl shadow-lg hidden md:flex">
                        <Activity size={16} className="text-primary animate-pulse" style={{ color: settings.accentColor }} />
                        <span className="text-xs font-black uppercase text-gray-500 dark:text-gray-400 tracking-widest leading-none">
                            {listTasks.length} Live Tasks
                        </span>
                    </div>
                </div>
            </div>

            {/* Structured List */}
            <div className="space-y-6 max-w-7xl mx-auto">
                {listTasks.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center gap-8 bg-white/30 dark:bg-white/[0.01] rounded-[48px] border-2 border-dashed border-gray-100 dark:border-white/5 opacity-40">
                        <div className="p-8 rounded-full border-2 border-gray-200 dark:border-white/10">
                            <Rocket size={48} className="text-gray-300" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.5em] text-gray-400"> No tasks found </span>
                    </div>
                ) : (
                    listTasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className="group relative bg-white dark:bg-[#0d1117]/80 hover:bg-[#fafbff] dark:hover:bg-white/[0.03] p-1 rounded-[32px] transition-all duration-500 border border-gray-100 dark:border-white/5 premium-shadow hover:scale-[1.01] cursor-pointer overflow-hidden"
                        >
                            {/* Accent Glow */}
                            <div className="absolute top-0 bottom-0 left-0 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: settings.accentColor }} />

                            <div className="flex flex-col lg:flex-row lg:items-center py-4 px-5 md:py-6 md:px-10 gap-4 md:gap-8">
                                {/* Leading Label */}
                                <div className="flex items-center gap-4 md:gap-6 min-w-[280px]">
                                    <div
                                        className={`w-1.5 h-12 rounded-full transition-all duration-300 ${task.priority === 'high' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-primary/20'}`}
                                        style={task.priority !== 'high' ? { backgroundColor: `${settings.accentColor}30` } : {}}
                                    />
                                    <div>
                                        <h4 className="text-[17px] font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors flex items-center gap-3" style={{ '--tw-hover-color': settings.accentColor }}>
                                            {task.name}
                                            {task.priority === 'high' && <Shield size={14} className="text-red-500" />}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1 opacity-50">
                                            <span className="text-[10px] font-bold uppercase tracking-wider">ID: {task.id.slice(0, 8)}</span>
                                            <div className="w-1 h-1 rounded-full bg-current" />
                                            <span className={`text-[9px] font-black uppercase tracking-widest`}>
                                                {task.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Dashboard */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Current Status</span>
                                        <span className="text-[11px] font-black text-gray-700 dark:text-gray-300 capitalize">{task.status === 'inprogress' ? 'In Progress' : task.status}</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Priority</span>
                                        <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg w-fit ${priorityColors[task.priority]}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 lg:hidden xl:flex">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Last Updated</span>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                                            <Calendar size={12} />
                                            <span>{new Date(task.updated_at || task.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Console */}
                                <div className="flex items-center justify-end gap-10 md:gap-10">
                                    <div className="relative group/avatar hidden md:block">
                                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity" style={{ backgroundColor: `${settings.accentColor}30` }} />
                                        <img
                                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee || task.ownerId}`}
                                            className="w-12 h-12 rounded-2xl border-4 border-white dark:border-[#0d1117] shadow-xl relative z-10"
                                            alt="Lead"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                archiveTask(task.id);
                                            }}
                                            className="p-3.5 text-gray-300 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                                            title="Archive Task"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <div
                                            className="p-3.5 bg-gray-50 dark:bg-white/5 border border-transparent group-hover:border-primary/20 rounded-2xl text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1"
                                            style={{ '--tw-hover-color': settings.accentColor, '--tw-border-color': `${settings.accentColor}20` }}
                                        >
                                            <ChevronRight size={22} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Task Edit Modal (Same as BoardView) */}
            <Modal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                title="Edit Task"
            >
                {editedTask && (
                    <div className="space-y-8 p-1">
                        {/* Header Inputs */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Task Name</label>
                                <input
                                    type="text"
                                    value={editedTask.name}
                                    onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                                    className="w-full bg-transparent text-2xl md:text-3xl font-black text-gray-900 dark:text-white border-b-2 border-gray-100 dark:border-white/10 pb-2 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="space-y-1.5 flex-1 min-w-[120px]">
                                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest pl-1">Category</label>
                                    <select
                                        value={editedTask.category}
                                        onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-gray-700 dark:text-gray-200"
                                    >
                                        {['feature', 'bug', 'design', 'research'].map(c => (
                                            <option key={c} value={c} className="bg-white dark:bg-gray-900">{c.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5 flex-1 min-w-[120px]">
                                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest pl-1">Priority</label>
                                    <select
                                        value={editedTask.priority}
                                        onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-gray-700 dark:text-gray-200"
                                    >
                                        {['low', 'medium', 'high'].map(p => (
                                            <option key={p} value={p} className="bg-white dark:bg-gray-900">{p.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Status & Date */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="p-4 md:p-6 bg-gray-50 dark:bg-white/[0.02] rounded-[24px] border border-gray-100 dark:border-white/5 space-y-2">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <Calendar size={14} /> Due Date
                                </span>
                                <input
                                    type="date"
                                    value={editedTask.due_date ? editedTask.due_date.split('T')[0] : ''}
                                    onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                                    className="bg-transparent font-bold text-gray-900 dark:text-white text-sm outline-none w-full"
                                />
                            </div>
                            <div className="p-4 md:p-6 bg-gray-50 dark:bg-white/[0.02] rounded-[24px] border border-gray-100 dark:border-white/5 space-y-2">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <Target size={14} /> Status
                                </span>
                                <select
                                    value={editedTask.status}
                                    onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                                    className="bg-transparent font-bold text-gray-900 dark:text-white text-sm outline-none w-full appearance-none capitalize"
                                >
                                    {['todo', 'inprogress', 'done'].map(s => (
                                        <option key={s} value={s} className="bg-white dark:bg-gray-900">{s === 'inprogress' ? 'In Progress' : s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2 px-1">
                                <FileText size={14} /> Description
                            </span>
                            <textarea
                                value={editedTask.description || ''}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                className="w-full p-6 md:p-8 bg-gray-50 dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/10 min-h-[160px] text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                                placeholder="Add detailed task description..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="flex-1 py-4 md:py-5 rounded-[24px] bg-gray-100 dark:bg-white/5 text-gray-500 font-extrabold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-4 md:py-5 rounded-[24px] text-white font-extrabold uppercase text-[10px] md:text-[11px] tracking-widest shadow-xl transition-all hover:scale-[1.02]"
                                style={{ backgroundColor: settings.accentColor, boxShadow: `0 15px 30px ${settings.accentColor}40` }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ListView;
