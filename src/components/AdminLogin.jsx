import React from "react";

const AdminLogin = ({ isLoading, errors = {}, formData, handleInputChange, handleSubmit, onBackToHome }) => {
  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-emerald-500/90 via-green-600/85 to-teal-700/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6 text-white px-8">
          <h2 className="text-4xl font-extrabold drop-shadow-lg">Admin Portal</h2>
          <p className="text-lg text-emerald-100 text-center">
            Manage your application with powerful tools and a modern interface.
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onBackToHome}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
              >
                ← Back to Home
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
