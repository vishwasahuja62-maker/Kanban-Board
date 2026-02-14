import { useState } from 'react';
import { Layout, AlignLeft, BarChart3, Zap, Archive, Activity, Settings, Bell, Trash2, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import Modal from './Modal';

function Sidebar({ currentView, setView }) {
    const { history, notifications, settings, setSettings, clearNotifs, markAllRead, activeFilter, setActiveFilter } = useTasks();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const navItems = [
        { id: 'board', label: 'Board', icon: Layout },
        { id: 'list', label: 'Detailed', icon: AlignLeft },
        { id: 'analytics', label: 'Insights', icon: BarChart3 },
    ];

    const colors = [
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Emerald', value: '#10b981' },
        { name: 'Rose', value: '#f43f5e' },
        { name: 'Amber', value: '#f59e0b' },
        { name: 'Cyan', value: '#06b6d4' },
    ];

    return (
        <>
            <aside className="w-64 sidebar-gradient border-r border-gray-100 dark:border-white/5 flex flex-col h-full transition-all duration-300 z-50 overflow-hidden relative">
                <div className="p-8 pb-10 flex items-center gap-3">
                    <div
                        className="w-10 h-10 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg relative z-10 transition-colors duration-500"
                        style={{ backgroundColor: settings.accentColor }}
                    >
                        P
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white leading-none">
                            ProKanban
                        </h2>
                        <span className="text-[9px] font-black uppercase tracking-widest mt-1 block opacity-80" style={{ color: settings.accentColor }}>
                            Elite Access
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-8 overflow-y-auto scrollbar-hide pt-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.2em] pl-4 mb-4">
                            Navigation
                        </p>
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all duration-300 relative group ${currentView === item.id
                                        ? 'text-white shadow-lg'
                                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                style={currentView === item.id ? { backgroundColor: settings.accentColor, boxShadow: `0 10px 25px -5px ${settings.accentColor}40` } : {}}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.2em] pl-4 mb-4">
                            Intelligence
                        </p>
                        <button
                            onClick={() => setActiveFilter(activeFilter === 'high' ? null : 'high')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all duration-300 border ${activeFilter === 'high'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-sm'
                                    : 'text-gray-500 border-transparent hover:bg-red-500/5 hover:text-red-500'
                                }`}
                        >
                            <Zap size={18} fill={activeFilter === 'high' ? 'currentColor' : 'none'} />
                            <span>Urgent Focus</span>
                        </button>
                        <button
                            onClick={() => setView('archive')}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-[13px] transition-all duration-300 ${currentView === 'archive'
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl'
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <Archive size={18} />
                            <span>Repository</span>
                        </button>
                    </div>

                    <div className="mt-auto pb-4">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.2em]">
                                Live Stream
                            </p>
                            <Activity size={12} className="animate-pulse" style={{ color: settings.accentColor }} />
                        </div>
                        <div className="bg-gray-50 dark:bg-white/[0.02] rounded-2xl p-4 space-y-3 max-h-40 overflow-y-auto scrollbar-hide border border-gray-100 dark:border-white/5">
                            {history.map((log, idx) => (
                                <div key={idx} className="text-[10px] font-medium leading-relaxed px-2 border-l-2 text-gray-500 dark:text-gray-400" style={{ borderColor: `${settings.accentColor}40` }}>
                                    {log.replace('🚨 ', '● ')}
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-white/5 flex gap-2">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex-1 p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 flex justify-center group"
                    >
                        <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                    <button
                        onClick={() => {
                            setIsNotifyOpen(true);
                            markAllRead();
                        }}
                        className="flex-1 p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 flex justify-center group relative"
                    >
                        <Bell size={18} className={unreadCount > 0 ? "animate-bounce" : "group-hover:animate-bounce"} />
                        {unreadCount > 0 && (
                            <div className="absolute top-3.5 right-6 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                        )}
                    </button>
                </div>
            </aside>

            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Workspace Customization">
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Branding Accent</h4>
                        <div className="flex gap-3">
                            {colors.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setSettings({ ...settings, accentColor: c.value })}
                                    className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${settings.accentColor === c.value ? 'scale-110 shadow-lg ring-2 ring-offset-2 ring-gray-900 dark:ring-white' : 'opacity-60 hover:opacity-100'}`}
                                    style={{ backgroundColor: c.value }}
                                >
                                    {settings.accentColor === c.value && <CheckCircle size={16} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Interface Density</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {['standard', 'compact'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setSettings({ ...settings, density: d })}
                                    className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all ${settings.density === d ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="pt-4 border-t border-gray-100 dark:border-white/5">
                        <button className="w-full py-4 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                            <Trash2 size={14} />
                            Purge Local Memory
                        </button>
                    </section>
                </div>
            </Modal>

            <Modal isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} title="Real-time Intel">
                <div className="space-y-4 min-h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <Bell size={40} className="mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">No active alerts</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className="p-5 glass-card rounded-[24px] flex gap-4 transition-all hover:translate-x-1">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                                    }`} style={n.type !== 'error' ? { backgroundColor: `${settings.accentColor}15`, color: settings.accentColor } : {}}>
                                    {n.title.includes('New') ? <UserPlus size={18} /> : n.title.includes('Archived') ? <Archive size={18} /> : <Info size={18} />}
                                </div>
                                <div>
                                    <h5 className="font-black text-[13px] text-gray-900 dark:text-white mb-0.5">{n.title}</h5>
                                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{n.message}</p>
                                    <span className="text-[9px] font-bold text-gray-400 mt-2 block uppercase tracking-tighter">
                                        {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}

                    {notifications.length > 0 && (
                        <button
                            onClick={clearNotifs}
                            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors mt-4"
                        >
                            Clear Intel Feed
                        </button>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default Sidebar;
