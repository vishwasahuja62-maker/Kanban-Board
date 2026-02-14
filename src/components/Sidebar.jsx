import { useState } from 'react';
import { Layout, AlignLeft, BarChart3, Zap, Archive, Activity, Settings, Bell, Trash2, CheckCircle, Info, AlertTriangle, User, RefreshCw } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

function Sidebar({ currentView, setView }) {
    const { history, notifications, settings, setSettings, clearNotifs, markAllRead, activeFilter, setActiveFilter } = useTasks();
    const { user, displayName, updateProfile } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [newName, setNewName] = useState(displayName);
    const [isUpdating, setIsUpdating] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const navItems = [
        { id: 'board', label: 'Task Board', icon: Layout },
        { id: 'list', label: 'Activity Log', icon: AlignLeft },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
            <aside className={`w-64 border-r flex flex-col h-full transition-all duration-300 z-50 overflow-hidden relative ${settings.sidebarStyle === 'glass'
                ? 'bg-white/60 dark:bg-[#08090d]/60 backdrop-blur-3xl border-gray-100 dark:border-white/5'
                : 'sidebar-gradient border-gray-200 dark:border-white/10'
                }`}>
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
                            <span>Archive History</span>
                        </button>
                    </div>

                    <div className="mt-auto pb-4">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.2em]">
                                Activity Stream
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

            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Workspace Configuration">
                <div className="space-y-10">
                    <section className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Personal Identity</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="relative group/avatar">
                                    <img
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata?.avatar_seed || user?.id}`}
                                        className="w-16 h-16 rounded-2xl border-2 border-white dark:border-gray-800 shadow-md"
                                        alt="Avatar"
                                    />
                                    <button
                                        onClick={() => updateProfile({ avatar_seed: Math.random().toString(36).substring(7) })}
                                        className="absolute -bottom-1 -right-1 p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-gray-400 hover:text-primary transition-colors border border-gray-100 dark:border-white/10"
                                    >
                                        <RefreshCw size={12} />
                                    </button>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="w-full bg-transparent border-none outline-none text-sm font-black text-gray-900 dark:text-white placeholder:text-gray-400 p-0"
                                            placeholder="Tactical Callsign"
                                        />
                                        <div className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-gray-200 dark:bg-white/10" />
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{user?.email}</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        setIsUpdating(true);
                                        await updateProfile({ display_name: newName });
                                        setIsUpdating(false);
                                    }}
                                    disabled={newName === displayName || isUpdating}
                                    className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-0 transition-all shadow-lg"
                                    style={{ backgroundColor: settings.accentColor }}
                                >
                                    {isUpdating ? '...' : 'Saves'}
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Primary Command Color</h4>
                        <div className="flex gap-3">
                            {colors.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setSettings({ ...settings, accentColor: c.value })}
                                    className={`w-11 h-11 rounded-2xl transition-all duration-300 flex items-center justify-center ${settings.accentColor === c.value ? 'scale-110 shadow-2xl ring-2 ring-offset-4 ring-primary' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                                    style={{ backgroundColor: c.value, '--tw-ring-color': c.value }}
                                >
                                    {settings.accentColor === c.value && <CheckCircle size={18} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-8">
                        <section className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Visual Density</h4>
                            <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/5">
                                {['standard', 'compact'].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setSettings({ ...settings, density: d })}
                                        className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${settings.density === d ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Sidebar Style</h4>
                            <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-2xl border border-gray-100 dark:border-white/5">
                                {['glass', 'solid'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSettings({ ...settings, sidebarStyle: s })}
                                        className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${settings.sidebarStyle === s ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Experimental Modifiers</h4>

                        <div className="space-y-4">
                            <label className="flex items-center justify-between group cursor-pointer">
                                <span className="flex flex-col">
                                    <span className="text-[11px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">Holographic Effects</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Enable advanced canvas glows & pulses</span>
                                </span>
                                <div
                                    onClick={() => setSettings({ ...settings, holographic: !settings.holographic })}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${settings.holographic ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}
                                    style={settings.holographic ? { backgroundColor: settings.accentColor } : {}}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings.holographic ? 'left-7 shadow-lg' : 'left-1'}`} />
                                </div>
                            </label>

                            <label className="flex items-center justify-between group cursor-pointer">
                                <span className="flex flex-col">
                                    <span className="text-[11px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">Tactile Feedback</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">UI system sounds for deployments</span>
                                </span>
                                <div
                                    onClick={() => setSettings({ ...settings, audio: !settings.audio })}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${settings.audio ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}
                                    style={settings.audio ? { backgroundColor: settings.accentColor } : {}}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings.audio ? 'left-7 shadow-lg' : 'left-1'}`} />
                                </div>
                            </label>

                            <label className="flex items-center justify-between group cursor-pointer">
                                <span className="flex flex-col">
                                    <span className="text-[11px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wider">Auto-Archive</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Automatic relocation of completed units</span>
                                </span>
                                <div
                                    onClick={() => setSettings({ ...settings, autoArchive: !settings.autoArchive })}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${settings.autoArchive ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'}`}
                                    style={settings.autoArchive ? { backgroundColor: settings.accentColor } : {}}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings.autoArchive ? 'left-7 shadow-lg' : 'left-1'}`} />
                                </div>
                            </label>
                        </div>
                    </section>

                    <section className="pt-6 border-t border-gray-100 dark:border-white/5">
                        <button
                            className="w-full py-5 bg-rose-500/5 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:shadow-rose-500/20 group"
                        >
                            <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
                            Purge Workspace Memory
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
                            Clear History
                        </button>
                    )}
                </div>
            </Modal>
        </>
    );
}

export default Sidebar;
