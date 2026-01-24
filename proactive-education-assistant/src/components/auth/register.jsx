import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { organisationService } from "../../services/organisationService";
import LanguageSelector from "../LanguageSelector";

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "teacher",
    organization: ""
  });
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch organisations on mount
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const data = await organisationService.getOrganisations();
        setOrganisations(data || []);
      } catch (error) {
        console.error("Failed to fetch organisations:", error);
      }
    };
    fetchOrganisations();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setErrorMessage("Name, email, and password are required");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    if (formData.role === "teacher" && !formData.organization) {
      setErrorMessage("Please select an organization");
      return;
    }

    setLoading(true);

    try {
      if (formData.role === "teacher") {
        // Find the organisation ID by name
        const org = organisations.find(o => o.name === formData.organization);
        if (!org) {
          setErrorMessage("Please select a valid organization");
          setLoading(false);
          return;
        }

        const response = await authService.teacherRegister(
          formData.fullName,
          formData.email,
          formData.password,
          org._id
        );
        
        if (response) {
          setSuccessMessage("Registration successful! Your account is pending admin approval. Please check your email for updates.");
          setTimeout(() => {
            setFormData({
              fullName: "",
              email: "",
              password: "",
              role: "teacher",
              organization: ""
            });
            onSwitchToLogin();
          }, 2000);
        }
      } else if (formData.role === "coordinator") {
        // Admin registration
        const response = await authService.adminRegister(
          formData.organization,
          "School", // Default type, can be expanded
          formData.fullName,
          formData.email,
          formData.password
        );

        if (response) {
          setSuccessMessage("Admin account created successfully! You can now login.");
          setTimeout(() => {
            setFormData({
              fullName: "",
              email: "",
              password: "",
              role: "teacher",
              organization: ""
            });
            onSwitchToLogin();
          }, 2000);
        }
      }
    } catch (error) {
      setErrorMessage(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-800">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-800">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMessage}</span>
              </div>
            </div>
          )}
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
              {formData.role === "teacher" ? "Select Organization" : "Create Organization Name"}
            </label>
            {formData.role === "teacher" ? (
              <select
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200
                           text-gray-800
                           focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                           transition-all bg-white"
              >
                <option value="">-- Select an organization --</option>
                {organisations.map((org) => (
                  <option key={org._id} value={org.name}>
                    {org.name} ({org.type || "Organization"})
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                type="text"
                placeholder="Your School or Organization Name"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200
                           text-gray-800 placeholder-gray-400
                           focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                           transition-all"
              />
            )}
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
          disabled={loading}
          className="w-full mt-6 bg-linear-to-r from-teal-500 to-blue-500 text-white
                     font-semibold py-3 rounded-lg
                     hover:from-teal-600 hover:to-blue-600
                     focus:outline-none focus:ring-4 focus:ring-teal-200
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-md hover:shadow-lg
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Creating Account..." : "Create Account"}
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
