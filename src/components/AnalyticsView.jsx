import { useTasks } from '../context/ProjectContext';
import { Target, Zap, CheckCircle2, TrendingUp, Cpu, Activity, BarChart3 } from 'lucide-react';

function AnalyticsView() {
    const { tasks, settings } = useTasks();

    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const high = tasks.filter(t => t.priority === 'high').length;
    const inProgress = tasks.filter(t => t.status === 'inprogress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;

    const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

    const categories = ['feature', 'bug', 'design', 'research'];
    const categoryCount = categories.map(cat => ({
        name: cat,
        count: tasks.filter(t => t.category === cat).length
    }));

    const maxCategory = Math.max(...categoryCount.map(c => c.count), 1);

    return (
        <div className="p-10 h-full overflow-y-auto scrollbar-hide space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Performance Analytics</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time productivity metrics</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completion Rate</span>
                        <span className="text-xl font-black text-primary" style={{ color: settings.accentColor }}>{completionRate}%</span>
                    </div>
                </div>
            </div>

            {/* Main Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Tasks', value: total, icon: Target, color: settings.accentColor },
                    { label: 'Tasks in Progress', value: inProgress, icon: Cpu, color: '#3b82f6' },
                    { label: 'Completed Tasks', value: done, icon: CheckCircle2, color: '#10b981' },
                    { label: 'High Priority', value: high, icon: Zap, color: '#f43f5e' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-8 rounded-[40px] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rotate-45 translate-x-16 -translate-y-16 group-hover:opacity-[0.07] transition-opacity" style={{ color: stat.color }} />
                        <stat.icon className="mb-6 opacity-80" size={24} style={{ color: stat.color }} />
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">{stat.value}</h3>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.15em]">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Progress Breakdown */}
                <div className="lg:col-span-2 glass-card p-10 rounded-[48px] border border-white/20 dark:border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 mb-10">
                        <TrendingUp size={20} className="text-primary" style={{ color: settings.accentColor }} />
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Task Progress</h3>
                    </div>

                    <div className="space-y-12">
                        <div className="relative pt-1">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase inline-block py-1 px-3 rounded-full bg-primary/10 text-primary tracking-widest" style={{ backgroundColor: `${settings.accentColor}15`, color: settings.accentColor }}>
                                        Overall Progress
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-gray-900 dark:text-white">{completionRate}% Completed</span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-100 dark:bg-white/5 p-1 border border-gray-100 dark:border-white/10">
                                <div
                                    style={{ width: `${completionRate}%`, backgroundColor: settings.accentColor }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-1000 shadow-xl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-10 pt-4">
                            {[
                                { label: 'To Do', value: todo, color: 'bg-indigo-400' },
                                { label: 'In Progress', value: inProgress, color: 'bg-amber-400' },
                                { label: 'Completed', value: done, color: 'bg-emerald-400' }
                            ].map((m, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${m.color}`} />
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{m.label}</span>
                                    </div>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="glass-card p-10 rounded-[48px] border border-white/20 dark:border-white/5 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-10">
                        <BarChart3 size={20} className="text-primary" style={{ color: settings.accentColor }} />
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Category Distribution</h3>
                    </div>

                    <div className="space-y-6">
                        {categoryCount.map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest capitalize">{cat.name}</span>
                                    <span className="text-xs font-black text-gray-700 dark:text-gray-300">{cat.count}</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 rounded-full"
                                        style={{
                                            width: `${(cat.count / maxCategory) * 100}%`,
                                            backgroundColor: settings.accentColor,
                                            opacity: 0.3 + ((i + 1) * 0.15)
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
                        <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10" style={{ backgroundColor: `${settings.accentColor}05`, borderColor: `${settings.accentColor}10` }}>
                            <p className="text-[11px] font-bold text-gray-500 leading-relaxed italic">
                                "Highest activity in {categoryCount.sort((a, b) => b.count - a.count)[0]?.name || 'general'} category."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsView;
