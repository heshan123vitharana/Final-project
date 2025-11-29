import React, { useState } from 'react';
import { Lock, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordPromptModal = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check sessionStorage first, then localStorage
            const rawData = JSON.parse(sessionStorage.getItem('adminData') || localStorage.getItem('adminData') || '{}');

            // Handle different data structures (direct or nested in user property)
            const adminEmail = rawData.email || (rawData.user && rawData.user.email);

            if (!adminEmail) {
                console.error('Admin session data missing email:', rawData);
                throw new Error('Admin session invalid - Email not found');
            }

            const response = await fetch('http://localhost:5000/api/admin/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: adminEmail,
                    password: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            onSuccess();
            setPassword('');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-emerald-600" />
                            Security Verification
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-gray-600 mb-6 text-sm">
                            Please enter your admin password to access this restricted area.
                        </p>

                        {/* Debug Info */}
                        <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                            Verifying for: <strong>{(() => {
                                const data = JSON.parse(sessionStorage.getItem('adminData') || localStorage.getItem('adminData') || '{}');
                                return data.email || (data.user && data.user.email) || 'Unknown Email';
                            })()}</strong>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify Access'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PasswordPromptModal;
