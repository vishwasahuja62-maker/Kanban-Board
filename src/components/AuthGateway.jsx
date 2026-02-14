import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

function AuthGateway() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { error: authError } = isLogin
            ? await login(email, password)
            : await signup(email, password);

        if (authError) {
            // Clean up common Supabase errors for the user
            if (authError.message.includes('rate limit')) {
                setError('Security check: Please wait 60s before retrying.');
            } else {
                setError(authError.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-[#05060f]">
            {/* Ultra Vibrant Mesh Background */}
            <div className="mesh-bg">
                <div className="blob b-1 opacity-[0.4] bg-primary animate-pulse-slow"></div>
                <div className="blob b-2 opacity-[0.3] bg-accent animate-pulse-slow" style={{ animationDelay: '-2s' }}></div>
            </div>

            <div className="w-full max-w-[480px] relative">
                {/* Decorative Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[40px] blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative glass-card bg-white/10 dark:bg-black/40 backdrop-blur-3xl p-12 rounded-[40px] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mb-8 transform -rotate-6">
                            <ShieldCheck size={32} className="text-white" />
                        </div>

                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Identity'}
                        </h2>
                        <p className="text-sm font-medium text-gray-400 mb-10 px-4 leading-relaxed">
                            {isLogin
                                ? 'Authorize your session to access the command center.'
                                : 'Initialize your encrypted repository and begin deployment.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="Secure Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 focus:border-primary/50 pl-14 pr-6 py-4 rounded-2xl outline-none font-bold text-white transition-all placeholder:text-gray-600 shadow-inner"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="Passphrase"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 focus:border-primary/50 pl-14 pr-6 py-4 rounded-2xl outline-none font-bold text-white transition-all placeholder:text-gray-600 shadow-inner"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-widest p-4 rounded-xl text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                            <span>{isLogin ? 'Authorize Session' : 'Initialize Identity'}</span>
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs font-bold text-gray-500 mb-4">
                            {isLogin ? "Don't have an identity yet?" : "Already have an account?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary hover:text-accent font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto"
                        >
                            {isLogin ? 'Create Workspace Identity' : 'Authorize Existing'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthGateway;
