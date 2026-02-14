import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [history, setHistory] = useState(JSON.parse(localStorage.getItem('pk_elite_logs')) || ["Genesis workspace initialized."]);
    const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem('pk_elite_notifs')) || []);
    const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('pk_elite_settings')) || {
        density: 'standard',
        accentColor: '#6366f1',
        showLogs: true
    });
    const [activeFilter, setActiveFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch initial tasks from Supabase
    useEffect(() => {
        if (!user) return;

        const fetchTasks = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error) setTasks(data);
            setLoading(false);
        };

        fetchTasks();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('tasks-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setTasks(prev => {
                        const exists = prev.some(t => t.id === payload.new.id || t.name === payload.new.name);
                        if (exists) return prev;
                        return [payload.new, ...prev];
                    });
                    notify('System Update', `New intel sync detected.`);
                } else if (payload.eventType === 'UPDATE') {
                    setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
                    if (payload.old.status !== payload.new.status) {
                        notify('Unit Relocated', `Unit tracking updated to ${payload.new.status}.`);
                    }
                } else if (payload.eventType === 'DELETE') {
                    setTasks(prev => prev.filter(t => t.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [user]);

    // Persist lists
    useEffect(() => {
        localStorage.setItem('pk_elite_logs', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('pk_elite_notifs', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('pk_elite_settings', JSON.stringify(settings));
        // Apply theme color dynamically
        document.documentElement.style.setProperty('--primary-color', settings.accentColor);
    }, [settings]);

    const log = (msg, urgent = false) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const prefix = urgent ? "🚨 " : "";
        setHistory(prev => [`[${time}] ${prefix}${msg}`, ...prev.slice(0, 49)]);
    };

    const notify = (title, message, type = 'info') => {
        const newNotif = {
            id: Date.now(),
            title,
            message,
            type,
            time: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifs = () => setNotifications([]);

    const addTask = async (data) => {
        const newTask = {
            ...data,
            id: 'temp-' + Date.now(),
            owner_id: user.id,
            subtasks: [],
            created_at: new Date().toISOString(),
            is_optimistic: true
        };

        // Optimistic Update
        setTasks(prev => [newTask, ...prev]);
        notify('Deploying Unit', `Initializing ${data.name}...`);

        const { data: insertedData, error } = await supabase
            .from('tasks')
            .insert([{
                ...data,
                owner_id: user.id,
                subtasks: []
            }])
            .select();

        if (error) {
            // Rollback
            setTasks(prev => prev.filter(t => t.id !== newTask.id));
            log(`Deployment Failed: ${error.message}`, true);
            notify('Deployment Error', error.message, 'error');
        } else {
            // Replace optimistic task with real one
            setTasks(prev => prev.map(t => t.id === newTask.id ? insertedData[0] : t));
            log(`Unit Online: ${data.name}`);
            notify('Unit Active', `${data.name} is now operational.`, 'success');
        }
    };

    const updateTask = async (id, data) => {
        const { error } = await supabase.from('tasks').update(data).eq('id', id);
        if (error) log(`Error: ${error.message}`, true);
        else log(`Modified task: ${data.name}`);
    };

    const updateTaskStatus = async (id, newStatus) => {
        const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
        if (error) log(`Error: ${error.message}`, true);
    };

    const archiveTask = async (id) => {
        const { error } = await supabase.from('tasks').update({
            is_archived: true,
            archived_at: new Date().toISOString()
        }).eq('id', id);
        if (error) log(`Error: ${error.message}`, true);
        else notify('Unit Archived', 'A task has been moved to the secure repository.');
    };

    const restoreTask = async (id) => {
        const { error } = await supabase.from('tasks').update({
            is_archived: false,
            archived_at: null
        }).eq('id', id);
        if (error) log(`Error: ${error.message}`, true);
    };

    const purgeTask = async (id) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) log(`Error: ${error.message}`, true);
    };

    const clearDone = async () => {
        const { error } = await supabase.from('tasks').delete().eq('status', 'done');
        if (error) log(`Error: ${error.message}`, true);
        else {
            log("Full purge of Shipped column.");
            notify('Repository Purged', 'All completed units have been permanently cleared.');
        }
    };

    const activeTasks = tasks.filter(t => !t.is_archived);
    const archivedTasks = tasks.filter(t => t.is_archived);

    return (
        <TaskContext.Provider value={{
            tasks: activeTasks, archivedTasks, history, notifications, settings, activeFilter, loading,
            setSettings, markAllRead, clearNotifs,
            setActiveFilter, addTask, updateTask, updateTaskStatus,
            archiveTask, restoreTask, purgeTask, clearDone
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export const useTasks = () => useContext(TaskContext);
