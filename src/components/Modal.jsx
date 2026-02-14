import { X } from 'lucide-react';
import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="glass-card w-full sm:max-w-lg rounded-t-[32px] rounded-b-none sm:rounded-[32px] overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-500 shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 sm:p-8 border-b border-white/10 dark:border-white/5 shrink-0">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-white/5 rounded-xl"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 sm:p-8 overflow-y-auto scrollbar-hide">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
