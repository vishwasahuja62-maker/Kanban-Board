import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { Plus, Target, Zap } from 'lucide-react';

function Column({ title, status, tasks }) {
    const [isOver, setIsOver] = useState(false);
    const { updateTaskStatus, clearDone, settings } = useTasks();

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    };

    const handleDragLeave = () => setIsOver(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsOver(false);
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) updateTaskStatus(taskId, status);
    };

    const statusColors = {
        todo: settings.accentColor,
        inprogress: '#f59e0b',
        done: '#10b981'
    };

    return (
        <div
            className={`flex flex-col h-full min-w-0 transition-all duration-700 rounded-[50px] relative group/column ${isOver ? 'scale-[1.03] z-30' : 'z-10'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* ELITE HOLOGRAPHIC OVERLAY */}
            {settings.holographic && (
                <div
                    className={`absolute inset-x-[-12px] inset-y-[-12px] rounded-[60px] transition-all duration-700 pointer-events-none overflow-hidden
                        ${isOver ? 'opacity-100' : 'opacity-0 scale-95'}`}
                    style={{
                        border: `1px solid ${settings.accentColor}40`,
                        background: `radial-gradient(circle at top center, ${settings.accentColor}10 0%, transparent 70%)`,
                        boxShadow: `0 0 50px ${settings.accentColor}15, inset 0 0 30px ${settings.accentColor}05`
                    }}
                >
                    {/* Tech Grid Background */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
                        style={{ backgroundImage: `radial-gradient(${settings.accentColor} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

                    {/* Scanning Laser Line */}
                    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent animate-scan-fast"
                        style={{ color: settings.accentColor, top: '-10%' }} />

                    {/* Corner Brackets */}
                    <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 opacity-50" style={{ borderColor: settings.accentColor }} />
                    <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 opacity-50" style={{ borderColor: settings.accentColor }} />
                    <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 opacity-50" style={{ borderColor: settings.accentColor }} />
                    <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 opacity-50" style={{ borderColor: settings.accentColor }} />

                    {/* Floating Particles/Icons */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 animate-ping">
                        <Target size={120} style={{ color: settings.accentColor }} strokeWidth={0.5} />
                    </div>
                </div>
            )}

            <div className={`relative z-20 flex flex-col h-full transition-all duration-700 ${isOver ? 'translate-y-[-4px]' : ''}`}>
                <div className="flex justify-between items-end mb-10 px-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: statusColors[status], boxShadow: `0 0 15px ${statusColors[status]}80` }} />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 leading-none">
                                {title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">
                                {tasks.length < 10 ? `0${tasks.length}` : tasks.length}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Units</span>
                                <span className="text-[9px] font-black text-gray-500/50 uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    </div>

                    {status === 'done' && tasks.length > 0 && (
                        <button
                            onClick={clearDone}
                            className="group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-500 px-5 py-2.5 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 transition-all duration-300 border border-transparent hover:border-rose-500/20"
                        >
                            <Zap size={14} className="group-hover:scale-110 transition-transform" />
                            Purge Records
                        </button>
                    )}
                </div>

                <div className={`flex-1 overflow-y-auto pr-3 space-y-6 scrollbar-hide pb-24 transition-all duration-700 ${isOver ? 'px-4 blur-[1px] opacity-40 grayscale' : ''}`}>
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}

                    {tasks.length === 0 && (
                        <div className="h-56 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[48px] flex flex-col items-center justify-center text-gray-400/50 dark:text-gray-600 font-bold text-xs gap-6 hover:border-primary/30 hover:text-primary transition-all duration-500 bg-white/40 dark:bg-card-dark/20 backdrop-blur-[2px]">
                            <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center animate-bounce-slow">
                                <Plus size={24} strokeWidth={3} />
                            </div>
                            <span className="uppercase tracking-[0.4em] text-[10px] font-black">Awaiting Deployment</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function BoardView() {
    const { tasks, activeFilter, settings, loading } = useTasks();

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
                    <span className="text-[12px] font-black uppercase tracking-[0.5em] animate-pulse text-gray-400">Synchronizing Intel</span>
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
        { title: 'Backlog', status: 'todo' },
        { title: 'In Service', status: 'inprogress' },
        { title: 'Shipped', status: 'done' },
    ];

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 h-full overflow-hidden ${settings.density === 'compact' ? 'gap-6 p-4' : 'gap-16 p-6'}`}>
            {columns.map(col => (
                <Column
                    key={col.status}
                    title={col.title}
                    status={col.status}
                    tasks={boardTasks.filter(t => t.status === col.status)}
                />
            ))}
        </div>
    );
}

export default BoardView;
