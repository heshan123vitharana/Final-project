import { useState, useEffect } from "react";
import { AiOutlineUser, AiOutlineBank, AiOutlineLock, AiOutlineEdit } from "react-icons/ai";

const Profile = () => {
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

  const [formData, setFormData] = useState(emptyProfile);
  const [originalData, setOriginalData] = useState(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    const savedProfile = sessionStorage.getItem("profileData");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFormData(parsed);
      setOriginalData(parsed);
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profilePhoto: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => { setIsEditing(true); setMessage(null); };
  const handleCancel = () => {
    setFormData(originalData);
    setPasswords({ current: "", new: "", confirm: "" });
    setIsEditing(false);
    setMessage(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if ((passwords.new || passwords.confirm) && passwords.new !== passwords.confirm) {
      setMessage("New password and confirm password do not match!");
      return;
    }
    if ((passwords.new || passwords.confirm) && passwords.current !== formData.password) {
      setMessage("Current password is incorrect!");
      return;
    }
    if (passwords.new) formData.password = passwords.new;

    sessionStorage.setItem("profileData", JSON.stringify(formData));
    setOriginalData(formData);
    setPasswords({ current: "", new: "", confirm: "" });
    setIsEditing(false);
    setMessage("Profile updated successfully!");
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700 border-b-4 border-green-300 pb-2">🏭 My Profile</h1>

        {/* Profile Photo */}
        <div className="relative flex flex-col items-center mb-6">
          <img
            src={formData.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full cursor-pointer hover:bg-green-700 transition">
              <AiOutlineEdit size={18} />
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-6 text-gray-700">
            {/* Mill Owner Details */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-700 font-semibold"><AiOutlineUser /> Mill Owner Details</div>
              <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Contact:</strong> {formData.contactNumber}</p>
              <p><strong>Address:</strong> {formData.address}</p>
              <p><strong>City:</strong> {formData.city}</p>
              <p><strong>State:</strong> {formData.state}</p>
            </section>

            {/* Mill Details */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-700 font-semibold"><AiOutlineBank /> Mill Details</div>
              <p><strong>Mill Name:</strong> {formData.millName}</p>
              <p><strong>Capacity:</strong> {formData.millCapacity}</p>
              <p><strong>Location:</strong> {formData.millLocation}</p>
            </section>

            <div className="flex justify-center mt-6">
              <button onClick={handleEdit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 text-gray-700">
            {/* Mill Owner Details */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-semibold"><AiOutlineUser /> Mill Owner Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" required />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" required />
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" required />
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
              </div>
            </section>

            {/* Mill Details */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-semibold"><AiOutlineBank /> Mill Details</div>
              <input type="text" name="millName" value={formData.millName} onChange={handleChange} placeholder="Mill Name" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
              <input type="text" name="millCapacity" value={formData.millCapacity} onChange={handleChange} placeholder="Mill Capacity" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
              <input type="text" name="millLocation" value={formData.millLocation} onChange={handleChange} placeholder="Mill Location" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
            </section>

            {/* Password Section */}
            <section className="border border-green-200 p-4 rounded-lg bg-green-50 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-semibold"><AiOutlineLock /> Change Password</div>
              <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} placeholder="Current Password" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
              <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} placeholder="New Password" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
              <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} placeholder="Confirm New Password" className="p-2 border rounded w-full focus:ring-2 focus:ring-green-400" />
            </section>

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <button type="button" onClick={handleCancel} className="px-6 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Save</button>
            </div>
          </form>
        )}

        {message && <p className="text-green-600 mt-6 text-center font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
