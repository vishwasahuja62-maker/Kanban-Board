import { useTasks } from '../context/TaskContext';

function AnalyticsView() {
    const { tasks } = useTasks();

    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const high = tasks.filter(t => t.priority === 'high').length;
    const velocity = total === 0 ? 0 : (done / total) * 100;

    const allSubtasks = tasks.flatMap(t => t.subtasks || []);
    const finishedSub = allSubtasks.filter(s => s.done).length;
    const subPct = allSubtasks.length === 0 ? 0 : (finishedSub / allSubtasks.length) * 100;

    return (
        <div className="p-10 h-full overflow-y-auto space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-soft">
                    <p className="text-[10px] font-extrabold uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-4">Total Velocity</p>
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">{total}</h2>
                    <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${velocity}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-soft">
                    <p className="text-[10px] font-extrabold uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-4">Completed Units</p>
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{done}</h2>
                </div>

                <div className="bg-white dark:bg-card-dark p-8 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-soft">
                    <p className="text-[10px] font-extrabold uppercase text-red-400 tracking-widest mb-4">High Priority Risks</p>
                    <h2 className="text-5xl font-black text-red-500 tracking-tighter">{high}</h2>
                </div>
            </div>

            <div className="bg-white dark:bg-card-dark p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-soft">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-8">Subtask Completion Rate</h3>
                <div className="relative h-6 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-lg shadow-primary-glow"
                        style={{ width: `${subPct}%` }}
                    ></div>
                </div>
                <div className="mt-4 flex justify-between text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                    <span>Progress: {Math.round(subPct)}%</span>
                    <span>Target: 100%</span>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsView;
