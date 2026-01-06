import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTeacher } from "../../context/TeacherContext";

// Mock teacher database (in real app, this would be an API call)
const MOCK_TEACHERS = {
  "pending@school.org": {
    email: "pending@school.org",
    password: "123",
    name: "Pending Teacher",
    status: "PENDING",
    assignedClasses: [],
    subject: "General Education",
  },
  "teacher1@school.org": {
    email: "teacher1@school.org",
    password: "123",
    name: "Sarah Johnson",
    status: "APPROVED",
    assignedClasses: ["Grade 6A"],
    subject: "Mathematics",
  },
  "teacher2@school.org": {
    email: "teacher2@school.org",
    password: "123",
    name: "Michael Chen",
    status: "APPROVED",
    assignedClasses: ["Grade 7A", "Grade 7B"],
    subject: "Science",
  },
  "admin": {
    email: "admin",
    password: "123",
    name: "Admin",
    role: "coordinator",
    status: "APPROVED",
    assignedClasses: [],
  },
};

function Modal({ isOpen, onClose, onSwitchToRegister }) {
  if (!isOpen) return null;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  
  const { loginTeacher } = useTeacher();
  const navigate = useNavigate();

  const handleLogin = () => {
    setErrorMessage("");
    setPendingApproval(false);
    
    // Find teacher in mock database
    const teacher = MOCK_TEACHERS[email];
    
    if (!teacher || teacher.password !== password) {
      setErrorMessage("Invalid email or password");
      return;
    }
    
    // Check if teacher account is pending approval
    if (role === "teacher" && teacher.status === "PENDING") {
      setPendingApproval(true);
      setErrorMessage("Your account is awaiting admin approval. Please contact your coordinator.");
      return;
    }
    
    // Login successful
    if (role === "teacher") {
      loginTeacher(teacher);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userRole", "teacher");
      // Trigger custom event for route update
      window.dispatchEvent(new Event("localStorageUpdate"));
      setEmail("");
      setPassword("");
      setRole("teacher");
      onClose();
      setTimeout(() => navigate("/dashboard"), 100);
    } else if (role === "coordinator") {
      // Admin login
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("adminData", JSON.stringify(teacher));
      // Trigger custom event for route update
      window.dispatchEvent(new Event("localStorageUpdate"));
      setEmail("");
      setPassword("");
      setRole("teacher");
      onClose();
      setTimeout(() => navigate("/admin/dashboard"), 100);
    }
  };
  
  return (
    // Overlay (click outside closes)
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex col items-center mb-4">
          <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
            Proactive Education Assistant
          </h2>
          <p className="text-xs text-gray-600 text-center">
            Helping educators identify and support at-risk students early.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {/* Error/Pending Message */}
          {errorMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              pendingApproval 
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-start gap-2">
                {pendingApproval ? (
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{errorMessage}</span>
              </div>
            </div>
          )}
          
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Role
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center p-2.5 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2.5 text-sm text-gray-700 font-medium">Teacher / Field Worker</span>
              </label>
              
              <label className="flex items-center p-2.5 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="role"
                  value="coordinator"
                  checked={role === "coordinator"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2.5 text-sm text-gray-700 font-medium">Coordinator / Admin</span>
              </label>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="educator@school.org"
              className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-200 text-sm
                         text-gray-800 placeholder-gray-400
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                         transition-all"
            />    
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-200 text-sm
                         text-gray-800 placeholder-gray-400
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                         transition-all"
            />
          </div>
        </div>

        {/* Login Button */}
        <button 
          onClick={handleLogin}
          className="w-full mt-4 bg-linear-to-r from-blue-500 to-teal-500 text-white
                     font-semibold py-2.5 rounded-lg text-sm
                     hover:from-blue-600 hover:to-teal-600
                     focus:outline-none focus:ring-4 focus:ring-blue-200
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-md hover:shadow-lg"
        >
          Login to Dashboard
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
        </div>

        {/* Switch to Register */}
        <div className="text-center mt-2 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Don't have an account?</span>
          <button
            onClick={onSwitchToRegister}
            className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
          >
            Create Account
          </button>
        </div>

        {/* Close Button */}
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

export default Modal;
