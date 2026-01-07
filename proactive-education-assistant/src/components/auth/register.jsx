import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeacher } from "../../context/TeacherContext";
import LanguageSelector from "../LanguageSelector";

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const { loginTeacher } = useTeacher();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "teacher",
    organization: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log("Registration data:", formData);
    alert("Account created successfully!");
  };

  const handleGuestLogin = () => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", formData.role === "coordinator" ? "admin" : "teacher");
    
    // Set guest user data
    const guestUser = {
      email: "guest@school.org",
      name: "Guest User",
      status: "APPROVED",
      assignedClasses: ["Demo Class"],
      subject: "All Subjects",
      isGuest: true
    };
    
    if (formData.role === "teacher") {
      loginTeacher(guestUser);
    } else {
      localStorage.setItem("adminData", JSON.stringify(guestUser));
    }
    
    // Trigger custom event for route update
    window.dispatchEvent(new Event("localStorageUpdate"));
    onClose();
    
    setTimeout(() => navigate(formData.role === "coordinator" ? "/admin/dashboard" : "/dashboard"), 100);
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal box - scrollable on small screens */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="w-16 h-16 bg-linear-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <LanguageSelector className="ml-auto" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Create Educator Account
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Join the platform to support at-risk students
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200
                         text-gray-800 placeholder-gray-400
                         focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                         transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="educator@school.org"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200
                         text-gray-800 placeholder-gray-400
                         focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                         transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Create a secure password"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200
                         text-gray-800 placeholder-gray-400
                         focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                         transition-all"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Role
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-300 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === "teacher"}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700 font-medium">Teacher / Field Worker</span>
              </label>
              
              <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-300 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="coordinator"
                  checked={formData.role === "coordinator"}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-3 text-gray-700 font-medium">Coordinator / Admin</span>
              </label>
            </div>
          </div>

          {/* School/Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School / Organization Name
            </label>
            <input
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              type="text"
              placeholder="Springfield High School"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200
                         text-gray-800 placeholder-gray-400
                         focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                         transition-all"
            />
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Student accounts are not required. This platform is exclusively for educators and coordinators.</span>
          </p>
        </div>

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-linear-to-r from-teal-500 to-blue-500 text-white
                     font-semibold py-3 rounded-lg
                     hover:from-teal-600 hover:to-blue-600
                     focus:outline-none focus:ring-4 focus:ring-teal-200
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-md hover:shadow-lg"
        >
          Create Account
        </button>

        {/* Guest Login Button */}
        <button 
          onClick={handleGuestLogin}
          className="w-full mt-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white
                     font-semibold py-3 rounded-lg
                     hover:from-gray-700 hover:to-gray-800
                     focus:outline-none focus:ring-4 focus:ring-gray-200
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-md hover:shadow-lg"
        >
          Continue as Guest
        </button>

        {/* Switch to Login */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <span className="text-sm text-gray-600">Already have an account?</span>
          <button
            onClick={onSwitchToLogin}
            className="ml-2 text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
          >
            Login
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default RegisterModal;
