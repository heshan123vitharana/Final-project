import { useState } from 'react';

const UserRegistration = ({ onAuthSuccess, onExit }) => {
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		businessName: '',
		businessType: '',
		phone: ''
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const validate = () => {
		const newErrors = {};
		if (!form.firstName) newErrors.firstName = 'First name required';
		if (!form.lastName) newErrors.lastName = 'Last name required';
		if (!form.email) newErrors.email = 'Email required';
		if (!form.password) newErrors.password = 'Password required';
		if (form.password && form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
		if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm password required';
		if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
		if (!form.businessName) newErrors.businessName = 'Business name required';
		if (!form.businessType) newErrors.businessType = 'Business type required';
		if (!form.phone) newErrors.phone = 'Phone number required';
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const newErrors = validate();
		if (Object.keys(newErrors).length) {
			setErrors(newErrors);
			setLoading(false);
			return;
		}
		try {
			// Map frontend field names to backend expected names
			const registrationData = {
				first_name: form.firstName,
				last_name: form.lastName,
				business_name: form.businessName,
				business_type: form.businessType,
				phone: form.phone,
				email: form.email,
				password: form.password,
				confirm_password: form.confirmPassword
			};

			const response = await fetch('http://localhost:5000/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(registrationData)
			});
			const result = await response.json();
			if (response.ok && result.user) {
				setSuccess(true);
				sessionStorage.setItem('millOwnerData', JSON.stringify(result.user));
				onAuthSuccess(result.user);
			} else {
				setErrors({ general: result.message || 'Registration failed' });
			}
		} catch {
			setErrors({ general: 'Server error. Please try again.' });
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100">
			<div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
				<h2 className="text-2xl font-bold mb-4 text-emerald-700">Mill Owner Registration</h2>
				{errors.general && <div className="mb-2 text-red-600">{errors.general}</div>}
				{success ? (
					<div className="text-green-700 font-semibold text-center mb-4">Registration successful! Redirecting...</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">First Name</label>
							<input type="text" name="firstName" value={form.firstName} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${errors.firstName ? 'border-red-500' : ''}`} />
							{errors.firstName && <span className="text-xs text-red-600">{errors.firstName}</span>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Last Name</label>
							<input type="text" name="lastName" value={form.lastName} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${errors.lastName ? 'border-red-500' : ''}`} />
							{errors.lastName && <span className="text-xs text-red-600">{errors.lastName}</span>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<input type="email" name="email" value={form.email} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${errors.email ? 'border-red-500' : ''}`} />
							{errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Password</label>
							<input type="password" name="password" value={form.password} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${errors.password ? 'border-red-500' : ''}`} />
							{errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Confirm Password</label>
							<input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${errors.confirmPassword ? 'border-red-500' : ''}`} />
							{errors.confirmPassword && <span className="text-xs text-red-600">{errors.confirmPassword}</span>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Business Name</label>
							<input type="text" name="businessName" value={form.businessName} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${errors.businessName ? 'border-red-500' : ''}`} />
							{errors.businessName && <span className="text-xs text-red-600">{errors.businessName}</span>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Business Type</label>
							<select name="businessType" value={form.businessType} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${errors.businessType ? 'border-red-500' : ''}`}>
								<option value="">Select Business Type</option>
								<option value="private">Private</option>
								<option value="government">Government</option>
							</select>
							{errors.businessType && <span className="text-xs text-red-600">{errors.businessType}</span>}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Phone Number</label>
							<input type="tel" name="phone" value={form.phone} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${errors.phone ? 'border-red-500' : ''}`} />
							{errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
						</div>
						<button type="submit" disabled={loading} className="w-full py-2 px-4 bg-emerald-600 text-white font-semibold rounded-md shadow hover:bg-emerald-700 transition duration-200">
							{loading ? 'Registering...' : 'Register'}
						</button>
						<button type="button" onClick={onExit} className="w-full py-2 px-4 mt-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200">Cancel</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default UserRegistration;
