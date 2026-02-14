import { useState } from 'react';
import { Search, Plus, Moon, Sun, LogOut, ChevronDown, Rocket, Target, Shield, Clock, FileText, LayoutGrid, AlignLeft, BarChart3, Archive, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/ProjectContext';
import Modal from './Modal';

function TopBar({ currentView, setView, theme, setTheme, isMobile, onMenuToggle }) {
    const { logout, displayName, avatarUrl } = useAuth();
    const { addTask, settings } = useTasks();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

    // Task form state
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState('feature');
    const [dueDate, setDueDate] = useState('');

    const titleMap = {
        'board': 'Task Board',
        'list': 'Activity Log',
        'analytics': 'Performance',
        'archive': 'Archive'
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        console.log("Creating Task from TopBar, taskName:", taskName);
        if (!taskName) {
            alert("Required: Please enter a Task Name.");
            return;
        }
        addTask({
            name: taskName,
            description,
            priority,
            category,
            due_date: dueDate || new Date().toISOString(),
            status: 'todo'
        });
        setTaskName('');
        setDescription('');
        setDueDate('');
        setIsTaskModalOpen(false);
    };

    const viewOptions = [
        { id: 'board', label: 'Task Board', icon: LayoutGrid },
        { id: 'list', label: 'Activity Log', icon: AlignLeft },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'archive', label: 'Archive', icon: Archive }
    ];

    return (
        <>
            <header className={`sticky top-0 px-4 sm:px-6 lg:px-10 flex justify-between items-center z-40 transition-all duration-300 backdrop-blur-md border-b border-gray-100 dark:border-white/5 bg-white/70 dark:bg-[#08090d]/70 ${settings.density === 'compact' ? 'py-3 lg:py-4' : 'py-4 lg:py-8'}`}>
                <div className="flex items-center gap-4 lg:gap-12">
                    {isMobile && (
                        <button
                            onClick={onMenuToggle}
                            className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    )}
                    <div className="flex flex-col relative">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">
                            Project Dashboard
                        </span>
                        <div
                            className="flex items-center gap-2 group cursor-pointer select-none"
                            onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                        >
                            <h1 className="text-xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                {titleMap[currentView]}
                            </h1>
                            <div className="p-1.5 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">
                                <ChevronDown
                                    size={18}
                                    className={`text-gray-400 transition-transform duration-500 ${isViewMenuOpen ? 'rotate-180' : ''}`}
                                    style={isViewMenuOpen ? { color: settings.accentColor } : {}}
                                />
                            </div>
                        </div>

                        {/* View Selector Dropdown */}
                        {isViewMenuOpen && (
                            <>
                                <div className="absolute top-[calc(100%+24px)] left-0 w-80 bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] p-3 z-60 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="px-5 py-3 mb-2 border-b border-gray-100 dark:border-white/5">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Select View</span>
                                    </div>
                                    <div className="space-y-1">
                                        {viewOptions.map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setView(option.id);
                                                    setIsViewMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-5 py-4 rounded-2xl text-[13px] font-black transition-all duration-300 flex items-center gap-4 group
                                                    ${currentView === option.id
                                                        ? 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white'
                                                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'}`}
                                            >
                                                <div className={`p-2 rounded-xl transition-colors ${currentView === option.id ? 'bg-white dark:bg-white/10 shadow-sm' : 'bg-transparent text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`} style={currentView === option.id ? { color: settings.accentColor } : {}}>
                                                    <option.icon size={18} />
                                                </div>
                                                <span className="flex-1 group-hover:translate-x-1 transition-transform">{option.label}</span>
                                                {currentView === option.id && (
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="fixed inset-0 z-50 cursor-default bg-black/5 backdrop-blur-sm" onClick={() => setIsViewMenuOpen(false)} />
                            </>
                        )}
                    </div>

                    <div className="hidden xl:flex items-center gap-3 bg-white dark:bg-white/[0.03] px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/5 focus-within:ring-2 transition-all duration-300" style={{ '--tw-ring-color': `${settings.accentColor}20` }}>
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 dark:text-gray-200 w-48 focus:w-80 transition-all duration-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 lg:gap-6">
                    <div className="hidden md:flex items-center gap-3 bg-white/50 dark:bg-white/[0.03] pl-2 pr-4 py-2 rounded-2xl border border-gray-100 dark:border-white/5 backdrop-blur-md">
                        <img src={avatarUrl} className="w-8 h-8 rounded-full shadow-sm border border-white dark:border-gray-800" alt="User" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{displayName}</span>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">
                        <button
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-gray-400 rounded-xl lg:rounded-2xl hover:text-primary transition-all duration-300"
                            style={{ '--tw-hover-color': settings.accentColor }}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="h-10 lg:h-12 px-3 lg:px-6 text-white rounded-xl lg:rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-black text-[13px] flex items-center gap-2 lg:gap-3"
                            style={{ backgroundColor: settings.accentColor, boxShadow: `0 10px 40px -10px ${settings.accentColor}60` }}
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span className="hidden sm:inline">New Task</span>
                        </button>

                        <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-white/10 mx-1 lg:mx-2" />

                        <button
                            onClick={logout}
                            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500 rounded-xl lg:rounded-2xl transition-all duration-300"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create New Task">
                <form onSubmit={handleAddTask} className="space-y-8 p-1">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            <Target size={14} />
                            <span>Task Name</span>
                        </div>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Enter task title"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-[24px] outline-none focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white font-bold transition-all"
                            style={{ '--tw-ring-color': settings.accentColor }}
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                            <FileText size={14} />
                            <span>Description</span>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            rows={3}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-[24px] outline-none focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-white font-medium text-sm transition-all resize-none"
                            style={{ '--tw-ring-color': settings.accentColor }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                                <Shield size={14} />
                                Priority Level
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
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-[20px] outline-none text-[13px] font-bold appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-gray-100 transition-all shadow-sm"
                                >
                                    <option value="feature" className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white">Feature</option>
                                    <option value="bug" className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white">Bug Fix</option>
                                    <option value="design" className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white">Design</option>
                                    <option value="research" className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white">Research</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">
                            <Clock size={14} />
                            Due Date
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
                        <span>Create Task</span>
                    </button>
                </form>
            </Modal>
        </>
    );
}

export default TopBar;
