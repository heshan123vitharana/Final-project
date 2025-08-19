import { useState, useEffect } from "react";
import {
  AiOutlineUser,
  AiOutlineBank,
  AiOutlineLock,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

const Profile = () => {
  // Initial empty profile data
  const emptyProfile = {
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    millName: "",
    millCapacity: "",
    millLocation: "",
    profilePhoto: "",
    password: "",
  };

  // State hooks
  const [formData, setFormData] = useState(emptyProfile); // form fields
  const [originalData, setOriginalData] = useState(emptyProfile); // backup for cancel
  const [isEditing, setIsEditing] = useState(false); // edit mode toggle
  const [message, setMessage] = useState(null); // success/error message

  // Password fields state
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  // Load profile from session storage when component mounts
  useEffect(() => {
    const savedProfile = sessionStorage.getItem("profileData");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFormData(parsed);
      setOriginalData(parsed);
    }
  }, []);

  // Update form data fields
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Update password fields
  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  // Toggle password visibility (open eye = show text, closed eye = mask with ***)
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle profile photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profilePhoto: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // Enable edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  // Cancel edit, revert changes
  const handleCancel = () => {
    setFormData(originalData);
    setPasswords({ current: "", new: "", confirm: "" });
    setIsEditing(false);
    setMessage(null);
  };

  // Save changes
  const handleSave = (e) => {
    e.preventDefault();

    // Validate password change
    if ((passwords.new || passwords.confirm) && passwords.new !== passwords.confirm) {
      setMessage("❌ New password and confirm password do not match!");
      return;
    }
    if ((passwords.new || passwords.confirm) && passwords.current !== formData.password) {
      setMessage("❌ Current password is incorrect!");
      return;
    }
    if (passwords.new) formData.password = passwords.new; // update password if valid

    // Save to session storage
    sessionStorage.setItem("profileData", JSON.stringify(formData));
    setOriginalData(formData);
    setPasswords({ current: "", new: "", confirm: "" });
    setIsEditing(false);
    setMessage("✅ Profile updated successfully!");
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700 border-b-4 border-green-300 pb-2">
          🏭 My Profile
        </h1>

        {/* Profile Photo */}
        <div className="relative flex flex-col items-center mb-6">
          <img
            src={formData.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-md"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition">
              <AiOutlineEdit size={20} />
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>

        {/* View Mode (Not Editing) */}
        {!isEditing ? (
          <div className="space-y-6 text-gray-700">
            {/* Mill Owner Details */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <AiOutlineUser /> Mill Owner Details
              </div>
              <p>
                <strong>Name:</strong> {formData.firstName} {formData.lastName}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Contact:</strong> {formData.contactNumber}
              </p>
              <p>
                <strong>Address:</strong> {formData.address}
              </p>
              <p>
                <strong>City:</strong> {formData.city}
              </p>
              <p>
                <strong>State:</strong> {formData.state}
              </p>
            </section>

            {/* Mill Details */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <AiOutlineBank /> Mill Details
              </div>
              <p>
                <strong>Mill Name:</strong> {formData.millName}
              </p>
              <p>
                <strong>Capacity:</strong> {formData.millCapacity}
              </p>
              <p>
                <strong>Location:</strong> {formData.millLocation}
              </p>
            </section>

            {/* Edit Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave} className="space-y-6 text-gray-700">
            {/* Mill Owner Details Section */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <AiOutlineUser /> Mill Owner Details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                required
              />
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                />
              </div>
            </section>

            {/* Mill Details Section */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <AiOutlineBank /> Mill Details
              </div>
              <input
                type="text"
                name="millName"
                value={formData.millName}
                onChange={handleChange}
                placeholder="Mill Name"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
              />
              <input
                type="text"
                name="millCapacity"
                value={formData.millCapacity}
                onChange={handleChange}
                placeholder="Mill Capacity"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
              />
              <input
                type="text"
                name="millLocation"
                value={formData.millLocation}
                onChange={handleChange}
                placeholder="Mill Location"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
              />
            </section>

            {/* 🔑 Password Section with Eye Toggle */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <AiOutlineLock /> Change Password
              </div>

              {["current", "new", "confirm"].map((field, idx) => (
                <div key={idx} className="relative">
                  {/* Password Input */}
                  <input
                    type={showPasswords[field] ? "text" : "password"} // 👁 toggle between text and password
                    name={field}
                    value={passwords[field]}
                    onChange={handlePasswordChange}
                    placeholder={
                      field === "current"
                        ? "Current Password"
                        : field === "new"
                        ? "New Password"
                        : "Confirm New Password"
                    }
                    className="p-2 border rounded w-full pr-10 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                  />
                  {/* Eye Button */}
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-green-600 focus:outline-none transition-colors"
                  >
                    {showPasswords[field] ? (
                      <AiOutlineEyeInvisible size={20} /> // 👁 closed → mask input
                    ) : (
                      <AiOutlineEye size={20} /> // 👁 open → show input
                    )}
                  </button>
                </div>
              ))}
            </section>

            {/* Form Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Success/Error Message */}
        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;

