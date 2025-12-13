import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RegionalLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        district: '',
        username: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.district) {
            newErrors.district = 'Please select a district';
        }

        if (!formData.username || formData.username.trim() === '') {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting', {
                description: 'Check the highlighted fields and try again',
                duration: 4000,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/regional-officers/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                toast.success('Login successful!', {
                    description: `Welcome back, Officer (${data.user.district})`,
                    duration: 3000,
                });

                // Redirect to dashboard
                navigate('/regional-dashboard');
            } else {
                toast.error('Login failed', {
                    description: data.message || 'Invalid credentials',
                    duration: 4000,
                });
            }
        } catch (err) {
            console.error('Login Error:', err);
            toast.error('Connection error', {
                description: 'Unable to connect to the server. Please check your internet connection.',
                duration: 4000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-6 font-inter"
            style={{
                backgroundImage: `linear-gradient(to bottom right, rgba(248, 250, 252, 0.4), rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.4)), url('/bg-1.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>

            <div className="relative w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100/50">
                <div className="flex flex-col justify-center p-6 lg:p-8 bg-white">
                    {/* Header with Back Button */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-base font-bold text-gray-900 tracking-tight">Regional Portal</h1>
                                    <p className="text-xs text-gray-500 font-medium">Officer Access</p>
                                </div>
                            </div>

                            {/* Back to Home Button */}
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 px-3.5 py-1.5 rounded-lg shadow-sm transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="tracking-wide">Home</span>
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Regional Access</h2>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            Select your district and sign in to manage operations.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-3" onSubmit={handleSubmit}>

                        {/* District Selection */}
                        <div className="space-y-1">
                            <label htmlFor="district" className="block text-xs font-semibold text-gray-700 tracking-wide">
                                District Office *
                            </label>
                            <select
                                id="district"
                                name="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 font-medium tracking-wide text-sm appearance-none ${errors.district
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
                                    }`}
                            >
                                <option value="">Select your district</option>
                                {districts.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            {errors.district && (
                                <p className="text-xs text-red-600 mt-1">{errors.district}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div className="space-y-1">
                            <label htmlFor="username" className="block text-xs font-semibold text-gray-700 tracking-wide">
                                Username *
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 font-medium tracking-wide text-sm ${errors.username
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
                                    }`}
                                placeholder="Enter officer username"
                            />
                            {errors.username && (
                                <p className="text-xs text-red-600 mt-1">{errors.username}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-xs font-semibold text-gray-700 tracking-wide">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 font-medium tracking-wide text-sm ${errors.password
                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
                                        }`}
                                    placeholder="********"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 tracking-wide text-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="font-semibold">Signing in...</span>
                                    </>
                                ) : (
                                    <span className="font-bold tracking-wide">Sign in</span>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Badge */}
                    <div className="mt-6 flex justify-center">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Official Access Only</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegionalLogin;
