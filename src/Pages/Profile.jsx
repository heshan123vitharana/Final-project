import { useState, useEffect } from "react";

// Profile component: allows user to view and edit their profile details
const Profile = () => {
  // Initial empty profile structure
  const emptyProfile = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    city: "",
    state: "",
    password: "",
    profilePhoto: "", // base64 string for image preview
  };

  // State for form data, original data, edit mode, and feedback message
  const [formData, setFormData] = useState(emptyProfile);
  const [originalData, setOriginalData] = useState(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);

  // Load profile data from sessionStorage on mount
  useEffect(() => {
    const savedProfile = sessionStorage.getItem("profileData");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFormData(parsed);
      setOriginalData(parsed);
    }
  }, []);

  // Handle input changes for text fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile photo upload and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePhoto: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch to edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  // Cancel editing and revert changes
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setMessage(null);
  };

  // Save profile changes to sessionStorage
  const handleSave = (e) => {
    e.preventDefault();
    const confirmSave = window.confirm("Are you sure you want to save changes?");
    if (!confirmSave) return;

    sessionStorage.setItem("profileData", JSON.stringify(formData));
    setOriginalData(formData);
    setIsEditing(false);
    setMessage("Profile updated successfully!");
  };

  return (
    <div className="p-8 bg-green-50 min-h-screen flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl">
        {/* Profile page heading */}
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          My Profile
        </h1>

        {/* Profile photo section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-4"
            />
          )}
        </div>

        {/* Profile details: view or edit mode */}
        {!isEditing ? (
          // VIEW MODE
          <div className="space-y-3 text-lg">
            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Contact:</strong> {formData.contactNumber}</p>
            <p><strong>City:</strong> {formData.city}</p>
            <p><strong>State:</strong> {formData.state}</p>
            <p><strong>Password:</strong> {formData.password ? "********" : "-"}</p>

            {/* Edit button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400"
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400"
            />

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400"
            />

            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400"
              />
            </div>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400"
            />

            {/* Save and Cancel buttons */}
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Success message */}
        {message && (
          <p className="text-green-600 mt-6 text-center font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;