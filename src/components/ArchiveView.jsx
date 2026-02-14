import { useTasks } from '../context/TaskContext';
import { RefreshCw, Trash2, ShieldAlert, Database, History, Search } from 'lucide-react';

function ArchiveView() {
    const { archivedTasks, restoreTask, purgeTask, settings } = useTasks();

    const categoryColors = {
        feature: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
        bug: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
        design: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
        research: 'text-amber-400 border-amber-500/20 bg-amber-500/5'
    };

    return (
        <div className="p-10 h-full overflow-y-auto scrollbar-hide pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex justify-between items-end mb-12">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Database size={20} className="text-gray-400" />
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight"> Task Archive </h2>
                    </div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] pl-1"> Historical task and completion records </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden xl:flex items-center gap-3 bg-white/50 dark:bg-white/[0.03] px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/5 backdrop-blur-md">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search archive..."
                            className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 dark:text-gray-200 w-48"
                        />
                    </div>
                    <button className="h-12 px-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg shadow-red-500/10">
                        Purge All
                    </button>
                </div>
            </div>

            {/* Content section */}
            <div className="bg-white/40 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[40px] overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-white/5">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Task Name</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Assigned To</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Last Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Archived On</th>
                            <th className="px-8 py-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {archivedTasks.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-32">
                                    <div className="flex flex-col items-center justify-center gap-6 opacity-30 grayscale">
                                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                                            <ShieldAlert size={32} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.3em] text-center"> Archive is currently empty </span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            archivedTasks.map(task => (
                                <tr key={task.id} className="group hover:bg-white/50 dark:hover:bg-white/[0.03] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[14px] font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors" style={{ '--tw-hover-color': settings.accentColor }}>{task.name}</span>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border w-fit ${categoryColors[task.category] || ''}`}>
                                                {task.category}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <div className="relative group/avatar">
                                                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity" style={{ backgroundColor: `${settings.accentColor}30` }} />
                                                <img
                                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee || task.ownerId}`}
                                                    className="w-10 h-10 rounded-xl relative z-10 border-2 border-white dark:border-gray-800 shadow-sm"
                                                    alt="Lead"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 border border-gray-100 dark:border-white/10">
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-500">
                                            <History size={12} />
                                            <span>{task.archived_at ? new Date(task.archived_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-4 justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => restoreTask(task.id)}
                                                className="p-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary rounded-xl transition-all"
                                                style={{ '--tw-hover-color': settings.accentColor }}
                                                title="Restore Unit"
                                            >
                                                <RefreshCw size={18} />
                                            </button>
                                            <button
                                                onClick={() => purgeTask(task.id)}
                                                className="p-3 text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all"
                                                title="Permanent Purge"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Legend section */}
            <div className="mt-8 flex justify-between items-center px-4">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Features</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Research</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Critical Bugs</span>
                    </div>
                </div>
                <span className="text-[10px] font-black text-gray-400/50 uppercase tracking-[0.2em]">Workspace: Pro Manager Mode</span>
            </div>
        </div>
    );
}

export default ArchiveView;
