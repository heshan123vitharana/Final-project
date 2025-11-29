import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, User, Lock, ArrowRight, AlertCircle, Sparkles, Shield } from 'lucide-react';

const RegionalLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        district: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const districts = [
        'Colombo', 'Gampaha', 'Kalutara',
        'Kandy', 'Matale', 'Nuwara Eliya',
        'Galle', 'Matara', 'Hambantota',
        'Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya',
        'Puttalam', 'Kurunegala',
        'Anuradhapura', 'Polonnaruwa',
        'Badulla', 'Monaragala',
        'Ratnapura', 'Kegalle',
        'Ampara', 'Batticaloa', 'Trincomalee'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/regional-officers/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            navigate('/regional-dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="regional-login-container">
            {/* Animated Background */}
            <div className="regional-login-bg">
                <div className="regional-gradient-orb regional-orb-1"></div>
                <div className="regional-gradient-orb regional-orb-2"></div>
                <div className="regional-gradient-orb regional-orb-3"></div>
            </div>

            {/* Floating Particles */}
            <div className="regional-particles">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="regional-particle"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
                            x: [null, Math.random() * window.innerWidth],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                ))}
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="regional-login-card"
            >
                {/* Header Section */}
                <div className="regional-card-header">
                    <motion.div
                        className="regional-icon-container"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="regional-icon-glow"></div>
                        <MapPin className="regional-icon" />
                        <Sparkles className="regional-sparkle regional-sparkle-1" />
                        <Sparkles className="regional-sparkle regional-sparkle-2" />
                    </motion.div>

                    <motion.h1
                        className="regional-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Regional Officer Portal
                    </motion.h1>

                    <motion.div
                        className="regional-subtitle-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Shield className="regional-shield-icon" />
                        <p className="regional-subtitle">Secure Access Gateway</p>
                    </motion.div>
                </div>

                {/* Form Section */}
                <div className="regional-form-container">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                className="regional-error-alert"
                            >
                                <AlertCircle className="regional-error-icon" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="regional-form">
                        {/* District Field */}
                        <motion.div
                            className="regional-form-group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="regional-label">
                                District Office
                                <span className="regional-required">*</span>
                            </label>
                            <div className="regional-input-wrapper">
                                <MapPin className={`regional-input-icon ${focusedField === 'district' ? 'regional-icon-active' : ''}`} />
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('district')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="regional-select"
                                >
                                    <option value="">Select your district</option>
                                    {districts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                                <div className={`regional-input-border ${focusedField === 'district' ? 'regional-border-active' : ''}`}></div>
                            </div>
                        </motion.div>

                        {/* Username Field */}
                        <motion.div
                            className="regional-form-group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="regional-label">
                                Username
                                <span className="regional-required">*</span>
                            </label>
                            <div className="regional-input-wrapper">
                                <User className={`regional-input-icon ${focusedField === 'username' ? 'regional-icon-active' : ''}`} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('username')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="regional-input"
                                    placeholder="Enter your username"
                                />
                                <div className={`regional-input-border ${focusedField === 'username' ? 'regional-border-active' : ''}`}></div>
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            className="regional-form-group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className="regional-label">
                                Password
                                <span className="regional-required">*</span>
                            </label>
                            <div className="regional-input-wrapper">
                                <Lock className={`regional-input-icon ${focusedField === 'password' ? 'regional-icon-active' : ''}`} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="regional-input"
                                    placeholder="Enter your password"
                                />
                                <div className={`regional-input-border ${focusedField === 'password' ? 'regional-border-active' : ''}`}></div>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="regional-submit-btn"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <span className="regional-btn-content">
                                {isLoading ? (
                                    <>
                                        <div className="regional-spinner"></div>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="regional-btn-icon" />
                                    </>
                                )}
                            </span>
                            <div className="regional-btn-glow"></div>
                        </motion.button>
                    </form>
                </div>

                {/* Footer */}
                <motion.div
                    className="regional-card-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="regional-footer-badge">
                        <Shield className="regional-footer-icon" />
                        <span>Secured with 256-bit encryption</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RegionalLogin;
