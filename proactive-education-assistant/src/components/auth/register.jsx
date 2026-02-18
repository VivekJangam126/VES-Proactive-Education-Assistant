import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { organisationService } from "../../services/organisationService";
import LanguageSelector from "../LanguageSelector";

const ROLE_ADMIN = "admin";
const ROLE_TEACHER = "teacher";

const initialFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  schoolName: "",
  schoolType: "School",
  city: "",
  schoolId: ""
};

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

  const showSchoolLookupPlaceholder =
    role === ROLE_TEACHER && formData.schoolId.trim().length > 0 && schoolIdPattern.test(formData.schoolId.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md mx-4 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("signup.page_title", "Create Your Account")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("signup.page_subtitle", "Choose your role to continue")}
          </p>
          <div className="flex justify-center mt-4">
            <LanguageSelector />
          </div>
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
        )}

        {step === "form" && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {role === ROLE_ADMIN ? "Create Your Organization" : "Join Your School"}
              </h3>
              <button
                type="button"
                onClick={() => setStep("role")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Change Role
              </button>
            </div>

            {errors.form && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errors.form}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("signup.name_label", "Full Name")}
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                type="text"
                placeholder={t("signup.name_placeholder", "John Doe")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("signup.email_label", "Email Address")}
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder={t("signup.email_placeholder", "educator@school.org")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="Re-enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
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

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <span className="text-sm text-gray-600">
            {t("signup.already_have_account", "Already have an account?")}
          </span>
          <button
            onClick={onSwitchToLogin}
            className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t("signup.sign_in_link", "Sign in")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
