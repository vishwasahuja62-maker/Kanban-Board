import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import BoardView from './components/BoardView'
import ListView from './components/ListView'
import AnalyticsView from './components/AnalyticsView'
import ArchiveView from './components/ArchiveView'
import AuthGateway from './components/AuthGateway'
import { TaskProvider, useTasks } from './context/ProjectContext'
import { AuthProvider, useAuth } from './context/AuthContext'

function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const mql = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, [query]);
    return matches;
}

function MainContent() {
    const { user, loading } = useAuth();
    const { settings } = useTasks();
    const [currentView, setCurrentView] = useState('board');
    const [theme, setTheme] = useState(localStorage.getItem('pk_theme') || 'light');
    const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('pk_sidebar') === 'collapsed');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isMobile = useMediaQuery('(max-width: 1023px)');

    // Check if user needs to set a display name (if missing in metadata)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const { updateProfile } = useAuth();
    const [newName, setNewName] = useState('');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pk_theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('pk_sidebar', isCollapsed ? 'collapsed' : 'expanded');
    }, [isCollapsed]);

    // Close mobile menu when switching to desktop
    useEffect(() => {
        if (!isMobile) setIsMobileMenuOpen(false);
    }, [isMobile]);

    useEffect(() => {
        if (user && !user.user_metadata?.display_name) {
            setIsProfileModalOpen(true);
        }
    }, [user]);

    const handleSetView = (view) => {
        setCurrentView(view);
        if (isMobile) setIsMobileMenuOpen(false);
    };

    const handleSaveName = async (e) => {
        e.preventDefault();
        if (newName.trim()) {
            await updateProfile({ display_name: newName.trim() });
            setIsProfileModalOpen(false);
        }
    };

    if (loading) return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-[#08090d]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (!user) return <AuthGateway />;


    return (
        <div className="flex h-screen w-screen transition-all duration-400 overflow-hidden">
            {settings.holographic && (
                <div className="mesh-bg">
                    <div className="blob b-1" style={{ backgroundColor: settings.accentColor }}></div>
                    <div className="blob b-2 bg-rose-500"></div>
                </div>
            )}

            {/* Profile Completion Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0d1117] w-full max-w-md p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Welcome!</h2>
                            <p className="text-sm font-medium text-gray-400">Please enter your name to complete your profile.</p>
                        </div>
                        <form onSubmit={handleSaveName} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 dark:text-white focus:ring-2 ring-indigo-500/20 outline-none transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                            >
                                Save Name
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile overlay backdrop */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar: fixed overlay on mobile, normal flex item on desktop */}
            <div className={`
                ${isMobile
                    ? `fixed inset-y-0 left-0 z-[999] transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
                    : ''
                }
            `}>
                <Sidebar
                    currentView={currentView}
                    setView={handleSetView}
                    isCollapsed={isMobile ? false : isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobile={isMobile}
                    onClose={() => setIsMobileMenuOpen(false)}
                />
            </div>

            <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
                <TopBar
                    currentView={currentView}
                    setView={handleSetView}
                    theme={theme}
                    setTheme={setTheme}
                    isMobile={isMobile}
                    onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />

                <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-10">
                    <div className="h-full w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {currentView === 'board' && <BoardView />}
                        {currentView === 'list' && <ListView />}
                        {currentView === 'analytics' && <AnalyticsView />}
                        {currentView === 'archive' && <ArchiveView />}
                    </div>
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <TaskProvider>
                <MainContent />
            </TaskProvider>
        </AuthProvider>
    )
}

export default App
