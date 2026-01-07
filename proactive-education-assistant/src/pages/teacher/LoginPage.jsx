import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", role === "coordinator" ? "admin" : "teacher");
    
    // Set guest teacher data
    const guestTeacher = {
      email: "guest@school.org",
      name: "Guest User",
      status: "APPROVED",
      assignedClasses: ["Demo Class"],
      subject: "All Subjects",
      isGuest: true
    };
    
    if (role === "coordinator") {
      localStorage.setItem("adminData", JSON.stringify(guestTeacher));
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Proactive Education Assistant
            </h1>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              Helping educators identify and support at-risk students early.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === "teacher"}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">Teacher / Field Worker</span>
                </label>
                
                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="coordinator"
                    checked={role === "coordinator"}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 font-medium">Coordinator / Admin</span>
                </label>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="educator@school.org"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200
                           text-gray-800 placeholder-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                           transition-all"
              />    
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200
                           text-gray-800 placeholder-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                           transition-all"
              />
            </div>
          </div>

          {/* Login Button */}
          <button 
            onClick={handleLogin}
            className="w-full mt-6 bg-linear-to-r from-blue-500 to-teal-500 text-white
                       font-semibold py-3 rounded-lg
                       hover:from-blue-600 hover:to-teal-600
                       focus:outline-none focus:ring-4 focus:ring-blue-200
                       transform hover:scale-[1.02] transition-all duration-200
                       shadow-md hover:shadow-lg"
          >
            Continue as Guest
          </button>

          {/* Helper text */}
          <p className="text-xs text-center mt-4 text-gray-500 flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Works offline after first login.
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help? Contact your school administrator
        </p>
      </div>
    </div>
  );
}
