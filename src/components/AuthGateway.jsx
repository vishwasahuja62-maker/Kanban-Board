import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, UserPlus, ArrowRight, CheckCircle, Shield } from 'lucide-react';

function AuthGateway() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: authError } = isLogin
            ? await login(email, password)
            : await signup(email, password, { display_name: name });

        if (authError) {
            setLoading(false);
            if (authError.message.includes('rate limit')) {
                setError('Security check: Please wait 60s before retrying.');
            } else {
                setError(authError.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#030712] overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '-2s' }} />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-emerald-500/10 blur-[100px] rounded-full opacity-50" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="w-full max-w-md relative z-10 perspective-1000">
                {/* Main Glass Card */}
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-indigo-500/10 hover:border-white/20">

                    {/* Top Brand Section */}
                    <div className="pt-10 pb-8 px-8 text-center bg-gradient-to-b from-white/5 to-transparent">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transform rotate-3 hover:rotate-6 transition-transform duration-500 group">
                            {/* Use the Logo Image if available, else fallback to Icon */}
                            <img
                                src="/logo.png"
                                alt="Kanban Logo"
                                className="w-14 h-14 object-contain drop-shadow-md"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <Shield size={36} className="text-white hidden" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                            {isLogin ? 'Welcome Back' : 'Get Started'}
                        </h1>
                        <p className="text-sm font-medium text-gray-400">
                            {isLogin
                                ? 'Enter your details to access your dashboard.'
                                : 'Create your workspace and start organizing.'}
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 pt-2">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">Full Name</label>
                                    <div className="relative group focus-within:ring-2 ring-indigo-500/50 rounded-2xl transition-all duration-300">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                                            <UserPlus size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-black/20 border border-white/5 text-white text-sm font-bold pl-12 pr-4 py-4 rounded-2xl outline-none placeholder:text-gray-600 focus:bg-black/30 transition-all"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">Email Address</label>
                                <div className="relative group focus-within:ring-2 ring-indigo-500/50 rounded-2xl transition-all duration-300">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/20 border border-white/5 text-white text-sm font-bold pl-12 pr-4 py-4 rounded-2xl outline-none placeholder:text-gray-600 focus:bg-black/30 transition-all"
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">Password</label>
                                <div className="relative group focus-within:ring-2 ring-indigo-500/50 rounded-2xl transition-all duration-300">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/5 text-white text-sm font-bold pl-12 pr-4 py-4 rounded-2xl outline-none placeholder:text-gray-600 focus:bg-black/30 transition-all"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="p-1 bg-red-500/20 rounded-full shrink-0">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    </div>
                                    <p className="text-xs font-bold text-red-400 leading-relaxed">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative overflow-hidden bg-white text-gray-900 font-black py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? 'Sign In' : 'Create Account'}
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                    setEmail('');
                                    setPassword('');
                                }}
                                className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
                            >
                                {isLogin ? (
                                    <>
                                        New Here?
                                        <span className="text-indigo-400 group-hover:underline decoration-2 underline-offset-4">Create Account</span>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?
                                        <span className="text-indigo-400 group-hover:underline decoration-2 underline-offset-4">Sign In</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Text */}
                <p className="text-center text-[10px] font-bold text-gray-600 mt-8 uppercase tracking-widest opacity-50">
                    Secure Connection • v2.4.0
                </p>
            </div>
        </div>
    );
}

export default AuthGateway;
