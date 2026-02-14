import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    const signup = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    };

    const updateProfile = async (metadata) => {
        const { data, error } = await supabase.auth.updateUser({
            data: metadata
        });
        if (!error && data.user) {
            setUser(data.user);
        }
        return { data, error };
    };

    const metadata = user?.user_metadata || {};

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            updateProfile,
            loading,
            displayName: metadata.display_name || user?.email?.split('@')[0] || 'Elite User',
            avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${metadata.avatar_seed || user?.id || 'default'}`
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
