import { useState } from 'react';
import { Search, Plus, Moon, Sun, LogOut, ChevronDown, Rocket, Target, Shield, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import Modal from './Modal';

function TopBar({ currentView, theme, setTheme }) {
    const { logout, displayName, avatarUrl } = useAuth();
    const { addTask, settings } = useTasks();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Task form state
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState('feature');
    const [dueDate, setDueDate] = useState('');

    const titleMap = {
        'board': 'Workspace',
        'list': 'Inventory',
        'analytics': 'Intelligence',
        'archive': 'Repository'
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!taskName) return;
        addTask({
            name: taskName,
            priority,
            category,
            due: dueDate || new Date().toISOString(),
            status: 'todo'
        });
        setTaskName('');
        setDueDate('');
        setIsTaskModalOpen(false);
    };

    return (
        <>
            <header className={`px-10 py-8 flex justify-between items-center z-40 bg-transparent ${settings.density === 'compact' ? 'py-4' : 'py-8'}`}>
                <div className="flex items-center gap-12">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">
                            Command 01
                        </span>
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight text-gradient">
                                {titleMap[currentView]}
                            </h1>
                            <ChevronDown size={20} className="text-gray-300 mt-1" />
                        </div>
                    </div>

                    <div className="hidden xl:flex items-center gap-3 bg-white dark:bg-white/[0.03] px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/5 focus-within:ring-2 transition-all duration-300" style={{ '--tw-ring-color': `${settings.accentColor}20` }}>
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find units..."
                            className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 dark:text-gray-200 w-48 focus:w-80 transition-all duration-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-white/50 dark:bg-white/[0.03] pl-2 pr-6 py-2 rounded-2xl border border-gray-100 dark:border-white/5 backdrop-blur-md">
                        <img src={avatarUrl} className="w-10 h-10 rounded-xl shadow-md border-2 border-white dark:border-gray-800" alt="User" />
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-gray-900 dark:text-white leading-tight">{displayName}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-80" style={{ color: settings.accentColor }}>Commander</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-gray-400 rounded-2xl hover:text-primary transition-all duration-300"
                            style={{ '--tw-hover-color': settings.accentColor }}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="h-12 px-6 text-white rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-black text-[13px] flex items-center gap-3"
                            style={{ backgroundColor: settings.accentColor, boxShadow: `0 10px 40px -10px ${settings.accentColor}60` }}
                        >
                            <Plus size={20} strokeWidth={3} />
                            <span>Launch Unit</span>
                        </button>

                        <div className="w-px h-8 bg-gray-200 dark:bg-white/10 mx-2" />

                        <button
                            onClick={logout}
                            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500 rounded-2xl transition-all duration-300"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Intelligence Unit Deployment">
                <form onSubmit={handleAddTask} className="space-y-8 p-1">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            <Target size={14} />
                            <span>Core Identification</span>
                        </div>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Unique Objective Name"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-[24px] outline-none focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white font-bold transition-all"
                            style={{ '--tw-ring-color': settings.accentColor }}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                                <Shield size={14} />
                                Risk Factor
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['low', 'medium', 'high'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${priority === p ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-400 hover:bg-gray-100'}`}
                                        style={priority === p ? { backgroundColor: settings.accentColor, borderColor: settings.accentColor } : {}}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                                <Rocket size={14} />
                                Department
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3.5 rounded-xl outline-none text-xs font-bold appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
                            >
                                <option value="feature">Feature Development</option>
                                <option value="bug">Bug Eradication</option>
                                <option value="design">Elite Design</option>
                                <option value="research">High R&D</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                            <Clock size={14} />
                            Deadline Target
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 rounded-xl outline-none text-xs font-bold text-gray-700 dark:text-gray-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-4"
                        style={{ backgroundColor: settings.accentColor, boxShadow: `0 20px 50px -10px ${settings.accentColor}60` }}
                    >
                        <Plus size={20} strokeWidth={4} />
                        <span>Deploy Objective</span>
                    </button>
                </form>
            </Modal>
        </>
    );
}

export default TopBar;
