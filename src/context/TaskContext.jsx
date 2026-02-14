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
            due_date: data.due_date || data.due,
            status: 'todo',
            created_at: new Date().toISOString(),
            is_optimistic: true
        };

        // Optimistic Update
        console.log("Optimistic update triggering for:", newTask.name);
        setTasks(prev => [newTask, ...prev]);
        notify('Deploying Unit', `Initializing ${data.name}...`);

        const { data: insertedData, error } = await supabase
            .from('tasks')
            .insert([{
                name: data.name,
                description: data.description,
                priority: data.priority,
                category: data.category,
                due_date: data.due_date,
                status: data.status,
                owner_id: user.id,
                subtasks: []
            }])
            .select();

        if (error) {
            // Rollback
            setTasks(prev => prev.filter(t => t.id !== newTask.id));
            log(`Deployment Failed: ${error.message}`, true);
            notify('Deployment Error', error.message, 'error');
        } else if (insertedData && insertedData.length > 0) {
            // Replace optimistic task with real one
            setTasks(prev => prev.map(t => t.id === newTask.id ? insertedData[0] : t));
            log(`Unit Online: ${data.name}`);
            notify('Unit Active', `${data.name} is now operational.`, 'success');
        } else {
            // Fallback if no error but no data (unlikely but safe)
            setTasks(prev => prev.filter(t => t.id !== newTask.id));
            notify('Deployment Warning', 'Unit deployed but no confirmation received.', 'warning');
        }
    };

    const updateTask = async (id, data) => {
        const { error } = await supabase.from('tasks').update(data).eq('id', id);
        if (error) log(`Error: ${error.message}`, true);
        else log(`Modified task: ${data.name}`);
    };

    const updateTaskStatus = async (id, newStatus) => {
        // Optimistic Update
        const taskToUpdate = tasks.find(t => t.id === id);
        if (!taskToUpdate) return;

        console.log(`Relocating unit ${id} to ${newStatus}`);
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));

        // Skip DB update for temporary optimistic tasks
        if (id.toString().startsWith('temp-')) {
            console.log("Postponing DB sync for temporary unit.");
            return;
        }

        const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
        if (error) {
            // Rollback
            setTasks(prev => prev.map(t => t.id === id ? taskToUpdate : t));
            log(`Relocation Failed: ${error.message}`, true);
            notify('Relocation Error', error.message, 'error');
        } else {
            notify('Unit Relocated', `Successfully moved to ${newStatus}.`);
        }
    };

    const archiveTask = async (id) => {
        const taskToArchive = tasks.find(t => t.id === id);
        if (!taskToArchive) return;

        // Optimistic Update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, is_archived: true, archived_at: new Date().toISOString() } : t));
        notify('Unit Archived', 'Unit moved to secure repository.');

        const { error } = await supabase.from('tasks').update({
            is_archived: true,
            archived_at: new Date().toISOString()
        }).eq('id', id);

        if (error) {
            setTasks(prev => prev.map(t => t.id === id ? taskToArchive : t));
            log(`Archival Failed: ${error.message}`, true);
        }
    };

    const restoreTask = async (id) => {
        const taskToRestore = tasks.find(t => t.id === id);
        if (!taskToRestore) return;

        // Optimistic Update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, is_archived: false, archived_at: null } : t));
        notify('Unit Restored', 'Unit returned to active duty.');

        const { error } = await supabase.from('tasks').update({
            is_archived: false,
            archived_at: null
        }).eq('id', id);

        if (error) {
            setTasks(prev => prev.map(t => t.id === id ? taskToRestore : t));
            log(`Restoration Failed: ${error.message}`, true);
        }
    };

    const purgeTask = async (id) => {
        const taskToPurge = tasks.find(t => t.id === id);

        // Optimistic Update
        setTasks(prev => prev.filter(t => t.id !== id));
        notify('Unit Purged', 'Atomic record deletion successful.', 'warning');

        const { error } = await supabase.from('tasks').delete().eq('id', id);

        if (error) {
            if (taskToPurge) setTasks(prev => [taskToPurge, ...prev]);
            log(`Purge Failed: ${error.message}`, true);
        }
    };

    const clearDone = async () => {
        const completedTasks = tasks.filter(t => t.status === 'done');
        if (completedTasks.length === 0) return;

        // Optimistic Update
        setTasks(prev => prev.filter(t => t.status !== 'done'));
        notify('Repository Purged', 'All shipped units cleared from local sector.');

        const { error } = await supabase.from('tasks').delete().eq('status', 'done');

        if (error) {
            setTasks(prev => [...prev, ...completedTasks]);
            log(`Clear Failed: ${error.message}`, true);
        } else {
            log("Full purge of Shipped column.");
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
