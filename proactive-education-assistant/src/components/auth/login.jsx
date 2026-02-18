import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTeacher } from "../../context/TeacherContext";
import LanguageSelector from "../LanguageSelector";

function Modal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
  if (!isOpen) return null;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { loginTeacher } = useTeacher();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage("");
    setPendingApproval(false);
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      if (role === "teacher") {
        const userData = await login(email, password, "TEACHER");
        // Also set TeacherContext for compatibility
        if (userData) {
          loginTeacher(userData);
        }

        setEmail("");
        setPassword("");
        setRole("teacher");
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        navigate("/dashboard", { replace: true });
      } else if (role === "coordinator") {
        await login(email, password, "ADMIN");

        setEmail("");
        setPassword("");
        setRole("teacher");
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (error) {
      // Check for specific error codes from the API
      if (error.message && error.message.includes("not approved")) {
        setPendingApproval(true);
        setErrorMessage("Your account is awaiting admin approval. Please contact your coordinator.");
      } else if (error.message && error.message.includes("Invalid credentials")) {
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md mx-4 p-8 shadow-2xl relative"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("app.brand_full", "Welcome Back")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("landing.early_detection", "Sign in to continue to your dashboard")}
          </p>
          <div className="flex justify-center mt-4">
            <LanguageSelector />
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {errorMessage && (
            <div className="p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("login.email_label", "Email Address")}
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder={t("login.email_placeholder", "educator@school.org")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("login.password_label", "Password")}
            </label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder={t("login.password_placeholder", "Enter your password")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

        {/* Login Button */}
        <button 
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full mt-4 bg-linear-to-r from-blue-500 to-teal-500 text-white
                     font-semibold py-2.5 rounded-lg text-sm
                     hover:from-blue-600 hover:to-teal-600
                     focus:outline-none focus:ring-4 focus:ring-blue-200
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-md hover:shadow-lg
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "Logging in..." : "Login to Dashboard"}
        </button>

        {/* Helper text */}
        <div className="space-y-1.5">
          <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Works offline after first login.
          </p>
          <div className="text-xs text-center text-gray-400 space-y-0.5">
            <p className="font-semibold text-gray-500">Demo Credentials:</p>
            <p>Teacher: <span className="text-blue-600">teacher1@school.org</span> or <span className="text-blue-600">teacher2@school.org</span></p>
            <p>Admin: <span className="text-purple-600">admin</span> / Password: <span className="font-mono">123</span></p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Signing In...
              </span>
            ) : (
              t("login.sign_in_button", "Sign In")
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            {t("login.no_account", "Don't have an account?")}
          </p>
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {t("signup.page_title", "Create Account")}
          </button>
          <p className="mt-4 text-xs text-gray-500">
            Demo: admin@demo.com / teacher@demo.com (password: demo)
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
