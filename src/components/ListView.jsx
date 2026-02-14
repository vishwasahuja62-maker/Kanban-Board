import { useTasks } from '../context/TaskContext';
import { Edit3, Trash2, ChevronRight, LayoutGrid, Info } from 'lucide-react';

function ListView() {
    const { tasks, activeFilter, archiveTask, settings } = useTasks();

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
        <div className="p-10 h-full overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-32">
            <div className="flex justify-between items-end mb-12 px-2">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <LayoutGrid size={20} className="text-gray-400" />
                        <h2 className="text-3xl font-black tracking-tight dark:text-white">Active Inventory</h2>
                    </div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] pl-1"> Detailed unit monitoring system </p>
                </div>

                <div className="flex items-center gap-4 bg-white/50 dark:bg-white/[0.03] px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/5 backdrop-blur-md">
                    <Info size={14} className="text-primary" style={{ color: settings.accentColor }} />
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">
                        {listTasks.length} Units Online
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {listTasks.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-6 opacity-20">
                        <LayoutGrid size={48} />
                        <span className="text-xs font-black uppercase tracking-[0.4em]"> No units in inventory </span>
                    </div>
                ) : (
                    listTasks.map(task => (
                        <div key={task.id} className="group glass-card hover:bg-white dark:hover:bg-white/[0.05] p-6 rounded-[32px] transition-all duration-300 flex items-center gap-8 hover:-translate-x-1 cursor-pointer">
                            <div
                                className={`w-1.5 h-12 rounded-full transition-all duration-300 ${task.priority === 'high' ? 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-primary/20'}`}
                                style={task.priority !== 'high' ? { backgroundColor: `${settings.accentColor}40` } : {}}
                            />

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <h4 className="text-[15px] font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors" style={{ '--tw-hover-color': settings.accentColor }}>{task.name}</h4>
                                    <span className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded-lg border tracking-widest ${categoryColors[task.category]}`}>
                                        {task.category}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ref: {task.id.slice(0, 8)}</span>
                                    <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/10" />
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sync: {new Date(task.updated_at || task.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-14">
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Status</span>
                                    <span
                                        className="text-[11px] font-black text-gray-700 dark:text-gray-200 capitalize px-3 py-1 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10"
                                    >
                                        {task.status === 'inprogress' ? 'In Service' : task.status === 'todo' ? 'Backlog' : 'Shipped'}
                                    </span>
                                </div>

                                <div className="relative group/avatar">
                                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity" style={{ backgroundColor: `${settings.accentColor}30` }} />
                                    <img
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee || task.ownerId}`}
                                        className="w-12 h-12 rounded-2xl border-4 border-white dark:border-[#0d1117] shadow-xl relative z-10"
                                        alt="Lead"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pr-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            archiveTask(task.id);
                                        }}
                                        className="p-3.5 text-gray-300 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                                        title="Move to Archive"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <div className="p-3.5 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" style={{ '--tw-hover-color': settings.accentColor }}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ListView;
