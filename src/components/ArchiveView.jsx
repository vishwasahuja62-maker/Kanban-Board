import { useTasks } from '../context/TaskContext';
import { RefreshCw, Trash2 } from 'lucide-react';

function ArchiveView() {
    const { archivedTasks, restoreTask, purgeTask } = useTasks();

    const categoryColors = {
        feature: 'bg-purple-50 text-purple-500 border-purple-100',
        bug: 'bg-rose-50 text-rose-500 border-rose-100',
        design: 'bg-cyan-50 text-cyan-500 border-cyan-100',
        research: 'bg-pink-50 text-pink-500 border-pink-100'
    };

    return (
        <div className="p-10 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-10 px-2">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    Archive Repository
                </h2>
                <button className="text-[10px] font-extrabold uppercase bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-sm">
                    Purge All
                </button>
            </div>

            <table className="w-full border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-left bg-transparent">
                        <th className="px-6 py-4 text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.2em] border-b-2 border-gray-100 dark:border-gray-800">Intelligence</th>
                        <th className="px-6 py-4 text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.2em] border-b-2 border-gray-100 dark:border-gray-800 text-center">Lead</th>
                        <th className="px-6 py-4 text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.2em] border-b-2 border-gray-100 dark:border-gray-800 text-center">Status</th>
                        <th className="px-6 py-4 text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.2em] border-b-2 border-gray-100 dark:border-gray-800 text-center">Type</th>
                        <th className="px-6 py-4 text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.2em] border-b-2 border-gray-100 dark:border-gray-800 text-center">Archived</th>
                        <th className="px-6 py-4 border-b-2 border-gray-100 dark:border-gray-800"></th>
                    </tr>
                </thead>
                <tbody>
                    {archivedTasks.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-20 text-sm font-bold text-gray-400 bg-white/50 dark:bg-card-dark/50 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                No intelligence units in archive.
                            </td>
                        </tr>
                    ) : (
                        archivedTasks.map(task => (
                            <tr key={task.id} className="bg-white/60 dark:bg-card-dark/60 backdrop-blur-sm shadow-soft hover:shadow-intense transition-all duration-300 group grayscale hover:grayscale-0">
                                <td className="px-6 py-6 font-bold text-gray-900 dark:text-white rounded-l-2xl">
                                    {task.name}
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <img
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${task.assignee || task.ownerId}`}
                                        className="w-8 h-8 rounded-lg mx-auto border-2 border-gray-50 dark:border-gray-800"
                                        alt="Lead"
                                    />
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <span className="text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700">
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <span className={`text-[9px] font-extrabold uppercase px-3 py-1 rounded-lg border ${categoryColors[task.category] || ''}`}>
                                        {task.category}
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-center text-xs font-bold text-gray-500">
                                    {task.archivedAt ? new Date(task.archivedAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-6 text-right rounded-r-2xl">
                                    <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => restoreTask(task.id)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                                            title="Restore Unit"
                                        >
                                            <RefreshCw size={18} />
                                        </button>
                                        <button
                                            onClick={() => purgeTask(task.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
    );
}

export default ArchiveView;
