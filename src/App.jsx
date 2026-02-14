import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import BoardView from './components/BoardView'
import ListView from './components/ListView'
import AnalyticsView from './components/AnalyticsView'
import ArchiveView from './components/ArchiveView'
import AuthGateway from './components/AuthGateway'
import { TaskProvider } from './context/TaskContext'
import { AuthProvider, useAuth } from './context/AuthContext'

function MainLayout() {
    const { user, loading } = useAuth();
    const [currentView, setCurrentView] = useState('board');
    const [theme, setTheme] = useState(localStorage.getItem('pk_theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pk_theme', theme);
    }, [theme]);

    if (loading) return (
        <div className="h-screen w-screen flex items-center justify-center bg-app-light dark:bg-app-dark">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (!user) return <AuthGateway />;

    return (
        <TaskProvider>
            <div className="flex h-screen w-screen transition-all duration-400">
                <div className="mesh-bg">
                    <div className="blob b-1 bg-primary"></div>
                    <div className="blob b-2 bg-pink-500"></div>
                </div>

                <Sidebar currentView={currentView} setView={setCurrentView} />

                <main className="flex-1 flex flex-col overflow-hidden relative">
                    <TopBar
                        currentView={currentView}
                        theme={theme}
                        setTheme={setTheme}
                    />

                    <div className="flex-1 overflow-hidden px-10">
                        <div className="h-full w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {currentView === 'board' && <BoardView />}
                            {currentView === 'list' && <ListView />}
                            {currentView === 'analytics' && <AnalyticsView />}
                            {currentView === 'archive' && <ArchiveView />}
                        </div>
                    </div>
                </main>
            </div>
        </TaskProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    )
}

export default App
