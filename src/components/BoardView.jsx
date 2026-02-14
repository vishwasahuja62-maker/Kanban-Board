import { useState, useEffect } from 'react';
import { useTasks } from '../context/ProjectContext';
import TaskCard from './TaskCard';
import { Plus, Target, Zap, Calendar, FileText, Activity } from 'lucide-react';
import { DndContext, useDroppable, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import Modal from './Modal';

function Column({ title, status, tasks, onTaskClick }) {
    // ... (unchanged)
    const { isOver, setNodeRef } = useDroppable({
        id: status,
    });
    const { clearDone, settings } = useTasks();

    const statusColors = {
        todo: settings.accentColor,
        inprogress: '#f59e0b',
        done: '#10b981'
    };

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col min-h-[400px] md:h-full min-w-0 transition-all duration-700 rounded-[32px] md:rounded-[50px] relative group/column ${isOver ? 'scale-[1.01] md:scale-[1.03] z-30 ring-2 ring-primary/20 bg-primary/5' : 'z-10 bg-transparent'}`}
            style={isOver ? { borderColor: settings.accentColor } : {}}
        >
            {/* Dynamic Overlay */}
            {settings.holographic && (
                <div
                    className={`absolute inset-x-[-12px] inset-y-[-12px] rounded-[40px] md:rounded-[60px] transition-all duration-700 pointer-events-none overflow-hidden
                        ${isOver ? 'opacity-100' : 'opacity-0 scale-95'}`}
                    style={{
                        border: `1px solid ${settings.accentColor}40`,
                        background: `radial-gradient(circle at top center, ${settings.accentColor}10 0%, transparent 70%)`,
                        boxShadow: `0 0 50px ${settings.accentColor}15, inset 0 0 30px ${settings.accentColor}05`
                    }}
                >
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
                        style={{ backgroundImage: `radial-gradient(${settings.accentColor} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

                    {/* Highlight Line */}
                    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent animate-scan-fast"
                        style={{ color: settings.accentColor, top: '-10%' }} />
                </div>
            )}

            <div className={`relative z-20 flex flex-col h-full transition-all duration-700 ${isOver ? 'translate-y-[-4px]' : ''}`}>
                <div className="flex justify-between items-end mb-6 md:mb-10 px-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: statusColors[status], boxShadow: `0 0 15px ${statusColors[status]}80` }} />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 leading-none">
                                {title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">
                                {tasks.length < 10 ? `0${tasks.length}` : tasks.length}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">TASKS</span>
                                <span className="text-[9px] font-black text-gray-500/50 uppercase tracking-widest">TOTAL</span>
                            </div>
                        </div>
                    </div>

                    {status === 'done' && tasks.length > 0 && (
                        <button
                            onClick={clearDone}
                            className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-500 px-4 py-2 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 transition-all duration-300"
                        >
                            <Zap size={14} className="group-hover:scale-110 transition-transform" />
                            Clear All
                        </button>
                    )}
                </div>

                <div className={`flex-1 md:overflow-y-auto pr-0 md:pr-3 space-y-4 md:space-y-6 scrollbar-hide pb-4 md:pb-24 transition-all duration-700 ${isOver ? 'px-4' : ''}`}>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}

                    {tasks.length === 0 && (
                        <div className="h-40 md:h-56 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[32px] md:rounded-[48px] flex flex-col items-center justify-center text-gray-400/50 dark:text-gray-600 font-bold text-xs gap-4 md:gap-6 hover:border-primary/30 hover:text-primary transition-all duration-500 bg-white/40 dark:bg-card-dark/20 backdrop-blur-[2px]">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-current flex items-center justify-center">
                                <Plus size={24} strokeWidth={3} />
                            </div>
                            <span className="uppercase tracking-[0.2em] text-[10px] font-black">No Tasks Yet</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function BoardView() {
    const { tasks, activeFilter, settings, loading, updateTaskStatus, updateTask } = useTasks();
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

    // Setup sensors for Drag and Drop
    // We use a delay on TouchSensor to allow scrolling, user must press and hold for 250ms to drag
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8, // Require slight movement for mouse to start drag (avoids accidental clicks)
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Press and hold for 250ms to pick up
                tolerance: 5, // Allow 5px movement during hold without cancelling
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const newStatus = over.id;
            updateTaskStatus(active.id, newStatus);
        }
    };

    const categoryColors = {
        feature: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        bug: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        design: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        research: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    };

    const priorityColors = {
        low: 'bg-blue-500/10 text-blue-500',
        medium: 'bg-amber-500/10 text-amber-500',
        high: 'bg-rose-500/10 text-rose-500 animate-pulse'
    };

    if (loading) return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-8">
                <div className="relative">
                    <div className="w-20 h-20 border-[6px] border-primary/5 rounded-full animate-spin" style={{ borderTopColor: settings.accentColor, borderRightColor: `${settings.accentColor}40` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full animate-ping shadow-2xl" style={{ backgroundColor: settings.accentColor }} />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] animate-pulse text-gray-400">Loading Tasks...</span>
                    <div className="h-1 w-32 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-progress" style={{ width: '60%', backgroundColor: settings.accentColor }} />
                    </div>
                </div>
            </div>
        </div>
    );

    let boardTasks = tasks;
    if (activeFilter === 'high') {
        boardTasks = tasks.filter(t => t.priority === 'high');
    }

    const columns = [
        { title: 'To Do', status: 'todo' },
        { title: 'In Progress', status: 'inprogress' },
        { title: 'Done', status: 'done' },
    ];

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className={`h-full ${settings.density === 'compact' ? 'p-2 sm:p-4' : 'p-3 sm:p-6'} overflow-y-auto md:overflow-y-hidden overflow-x-hidden md:overflow-x-auto scrollbar-hide`}>
                {/* Mobile: Flex Column (Vertical Stack), Desktop: Grid (Horizontal Columns) */}
                <div className={`
                    flex flex-col md:grid md:grid-flow-col md:auto-cols-[minmax(280px,1fr)] md:grid-cols-3 
                    gap-8 md:gap-6 lg:gap-10 h-auto md:h-full
                    ${settings.density === 'compact' ? 'gap-6' : ''}
                `}>
                    {columns.map(col => (
                        <Column
                            key={col.status}
                            title={col.title}
                            status={col.status}
                            tasks={boardTasks.filter(t => t.status === col.status)}
                            onTaskClick={setSelectedTask}
                        />
                    ))}
                </div>
                {/* Bottom spacer for mobile scrolling */}
                <div className="h-20 md:hidden" />
            </div>

            {/* Task Detail Modal */}
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
        </DndContext>
    );
}

export default BoardView;
