import { useTasks } from '../context/TaskContext';
import { Edit3, Trash2, ChevronRight } from 'lucide-react';

function ListView() {
    const { tasks, activeFilter, archiveTask } = useTasks();

    let listTasks = tasks;
    if (activeFilter === 'high') {
        listTasks = tasks.filter(t => t.priority === 'high');
    }

    const categoryColors = {
        feature: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        bug: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        design: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        research: 'bg-pink-500/10 text-pink-500 border-pink-500/20'
    };

    return (
        <div className="p-4 h-full overflow-y-auto scrollbar-hide animate-slide-up pb-32">
            <div className="flex justify-between items-center mb-10 px-6">
                <h2 className="text-xl font-black tracking-tight dark:text-white">Detailed Inventory</h2>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/5">
                    {listTasks.length} Units Listed
                </span>
            </div>

            <div className="space-y-4">
                {listTasks.map(task => (
                    <div key={task.id} className="group glass-card hover:bg-white dark:hover:bg-white/[0.05] p-6 rounded-[28px] transition-all duration-300 flex items-center gap-8 hover:-translate-x-1 cursor-pointer">
                        <div className={`w-1.5 h-10 rounded-full ${task.priority === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary/20'}`} />

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">{task.name}</h4>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${categoryColors[task.category]}`}>
                                    {task.category}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium">Last updated: {new Date(task.updatedAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Status</span>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{task.status}</span>
                            </div>

                            <div className="flex items-center -space-x-3">
                                <img
                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee || task.ownerId}`}
                                    className="w-10 h-10 rounded-xl border-4 border-white dark:border-[#0d1117] shadow-sm relative z-10"
                                    alt="Lead"
                                />
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center">
                                    <Edit3 size={14} className="text-gray-300" />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => archiveTask(task.id)}
                                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button className="p-3 text-gray-300 hover:text-primary transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListView;
