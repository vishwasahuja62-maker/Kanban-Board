import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

function Column({ title, status, tasks }) {
    const { updateTaskStatus, clearDone } = useTasks();

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e) => {
        const taskId = e.dataTransfer.getData('taskId');
        updateTaskStatus(taskId, status);
    };

    const statusColors = {
        todo: 'bg-indigo-500',
        inprogress: 'bg-amber-500',
        done: 'bg-emerald-500'
    };

    return (
        <div
            className="flex flex-col h-full min-w-0 animate-slide-up"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex justify-between items-end mb-10 px-2">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${statusColors[status]} shadow-lg shadow-current/50`} />
                        <h3 className="text-[12px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 leading-none">
                            {title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">
                            {tasks.length < 10 ? `0${tasks.length}` : tasks.length}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Active</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Units</span>
                        </div>
                    </div>
                </div>

                {status === 'done' && tasks.length > 0 && (
                    <button
                        onClick={clearDone}
                        className="text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 px-4 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-all duration-300"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-3 space-y-6 scrollbar-hide pb-24">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}

                {tasks.length === 0 && (
                    <div className="h-48 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[40px] flex flex-col items-center justify-center text-gray-400/50 dark:text-gray-600 font-bold text-xs gap-4 hover:border-primary/30 hover:text-primary transition-all duration-500 bg-white/50 dark:bg-white/[0.01]">
                        <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                            <Plus size={20} />
                        </div>
                        <span className="uppercase tracking-[0.2em] text-[10px]">No units found</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function BoardView() {
    const { tasks, activeFilter, settings, loading } = useTasks();

    if (loading) return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/10 rounded-full animate-spin" style={{ borderTopColor: settings.accentColor }} />
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                        <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: settings.accentColor }} />
                    </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse" style={{ color: settings.accentColor }}>Syncing Intelligence</span>
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
        { title: 'Completed', status: 'done' },
    ];

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 h-full overflow-hidden ${settings.density === 'compact' ? 'gap-6 p-4' : 'gap-14 p-4'}`}>
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
