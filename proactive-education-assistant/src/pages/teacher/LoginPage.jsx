import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isOnline] = useState(true);
  const [syncQueueCount] = useState(2);

  const handleLogin = () => {
    const actualRole = role === "coordinator" ? "admin" : "teacher";
    localStorage.setItem("token", "demo-teacher-token");
    localStorage.setItem("role", actualRole);
    localStorage.setItem("themeMode", isDarkMode ? "dark" : "light");
    
    window.dispatchEvent(new Event("localStorageUpdate"));
    
    if (actualRole === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/teacher/dashboard");
    }
  };

  const handleGuestLogin = () => {
    const actualRole = role === "coordinator" ? "admin" : "teacher";
    localStorage.setItem("token", "demo-guest-token");
    localStorage.setItem("role", actualRole);
    localStorage.setItem("themeMode", isDarkMode ? "dark" : "light");
    
    const guestUser = {
      email: "guest@school.org",
      name: "Guest User",
      status: "APPROVED",
      assignedClasses: ["Demo Class"],
      subject: "All Subjects",
      isGuest: true
    };
    
    if (actualRole === "teacher") {
      localStorage.setItem("teacherData", JSON.stringify(guestUser));
    } else {
      localStorage.setItem("adminData", JSON.stringify(guestUser));
    }
    
    window.dispatchEvent(new Event("localStorageUpdate"));
    
    if (actualRole === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/teacher/dashboard");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative transition-colors duration-300"
      style={isDarkMode ? { 
        background: 'linear-gradient(135deg, #0B0F1A 0%, #0F172A 50%, #000000 100%)'
      } : { 
        background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #F0FDFA 100%)' 
      }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 p-3 rounded-full transition-all duration-300"
        style={isDarkMode ? {
          backgroundColor: 'rgba(34, 211, 238, 0.15)',
          border: '2px solid rgba(34, 211, 238, 0.7)',
          color: '#22D3EE',
          cursor: 'pointer'
        } : {
          backgroundColor: '#DBEAFE',
          border: '2px solid #93C5FD',
          color: '#2563EB',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(34,211,238,0.6)';
            e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 1)';
          }
        }}
        onMouseLeave={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.7)';
          }
        }}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 2v4m0 12v4M4.22 4.22l2.83 2.83m5.9 5.9l2.83 2.83M2 12h4m12 0h4M4.22 19.78l2.83-2.83m5.9-5.9l2.83-2.83" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-md">
        {/* Card */}
        <div 
          className="p-8 rounded-2xl transition-all duration-300"
          style={isDarkMode ? {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(34, 211, 238, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(34, 211, 238, 0.1)'
          } : {
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: 'none'
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            {/* Icon Badge */}
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={isDarkMode ? {
                background: 'linear-gradient(135deg, #22D3EE 0%, #A78BFA 100%)',
                boxShadow: '0 0 25px rgba(34, 211, 238, 0.8), 0 0 50px rgba(167, 139, 250, 0.4)'
              } : {
                background: 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            
            {/* Heading */}
            <h1 
              className="text-3xl font-bold text-center mb-2"
              style={isDarkMode ? {
                color: '#22D3EE',
                textShadow: '0 0 10px rgba(34, 211, 238, 0.3)'
              } : {
                color: '#1F2937'
              }}
            >
              Proactive Education Assistant
            </h1>

            {/* Subheading */}
            <p 
              className="text-sm text-center max-w-sm"
              style={{color: isDarkMode ? '#9CA3AF' : '#6B7280'}}
            >
              Helping educators identify and support at-risk students early.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Role Selection */}
            <div>
              <label 
                className="block text-sm font-medium mb-3"
                style={{color: isDarkMode ? '#D1D5DB' : '#374151'}}
              >
                Select Your Role
              </label>
              <div className="space-y-2">
                {/* Teacher */}
                <label 
                  className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-md"
                  style={isDarkMode ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(34, 211, 238, 0.4)',
                  } : {
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB'
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === "teacher"}
                    onChange={(e) => setRole(e.target.value)}
                    style={{accentColor: isDarkMode ? '#22D3EE' : '#3B82F6'}}
                  />
                  <span 
                    className="ml-3 font-medium"
                    style={{color: isDarkMode ? '#D1D5DB' : '#374151'}}
                  >Teacher / Field Worker</span>
                </label>
                
                {/* Coordinator */}
                <label 
                  className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-md"
                  style={isDarkMode ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(34, 211, 238, 0.4)',
                  } : {
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB'
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value="coordinator"
                    checked={role === "coordinator"}
                    onChange={(e) => setRole(e.target.value)}
                    style={{accentColor: isDarkMode ? '#22D3EE' : '#3B82F6'}}
                  />
                  <span 
                    className="ml-3 font-medium"
                    style={{color: isDarkMode ? '#D1D5DB' : '#374151'}}
                  >Coordinator / Admin</span>
                </label>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{color: isDarkMode ? '#D1D5DB' : '#374151'}}
              >
                Email Address
              </label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="educator@school.org"
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300"
                style={isDarkMode ? {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: emailFocused ? '#22D3EE' : 'rgba(34, 211, 238, 0.4)',
                  color: '#E0E7FF',
                  backdropFilter: 'blur(8px)',
                  boxShadow: emailFocused ? '0 0 20px rgba(34, 211, 238, 0.3)' : 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#1F2937'
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />    
            </div>

            {/* Password Input */}
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{color: isDarkMode ? '#D1D5DB' : '#374151'}}
              >
                Password
              </label>
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300"
                style={isDarkMode ? {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: passwordFocused ? '#22D3EE' : 'rgba(34, 211, 238, 0.4)',
                  color: '#E0E7FF',
                  backdropFilter: 'blur(8px)',
                  boxShadow: passwordFocused ? '0 0 20px rgba(34, 211, 238, 0.3)' : 'none'
                } : {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#1F2937'
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </div>
          </div>

          {/* Login Button */}
          <button 
            onClick={handleLogin}
            className="w-full mt-6 font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg"
            style={isDarkMode ? {
              background: 'linear-gradient(135deg, #22D3EE 0%, #38BDF8 50%, #A78BFA 100%)',
              color: '#000000',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
              cursor: 'pointer'
            } : {
              background: 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%)',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              if (isDarkMode) {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(34, 211, 238, 0.6)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (isDarkMode) {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            Login to Dashboard
          </button>

          {/* Guest Login Button */}
          <button 
            onClick={handleGuestLogin}
            className="w-full mt-3 font-semibold py-3 rounded-lg transition-all duration-200"
            style={isDarkMode ? {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(34, 211, 238, 0.5)',
              color: '#22D3EE',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer'
            } : {
              backgroundColor: '#FFFFFF',
              border: '2px solid #3B82F6',
              color: '#3B82F6',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              if (isDarkMode) {
                e.currentTarget.style.borderColor = '#22D3EE';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 211, 238, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (isDarkMode) {
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.5)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }
            }}
          >
            Continue as Guest
          </button>

          {/* Offline Sync Status */}
          <div
            className="mt-5 rounded-lg border px-4 py-3 text-xs flex items-start gap-3"
            style={isDarkMode ? {
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(34, 211, 238, 0.25)',
              color: '#CBD5F5'
            } : {
              backgroundColor: '#F8FAFC',
              borderColor: '#E2E8F0',
              color: '#475569'
            }}
          >
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={isDarkMode ? { backgroundColor: 'rgba(34, 211, 238, 0.2)', color: '#22D3EE' } : { backgroundColor: '#DBEAFE', color: '#2563EB' }}
            >
              {isOnline ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 18a2 2 0 100-4 2 2 0 000 4zm5.07-4.24a7 7 0 00-10.14 0 1 1 0 01-1.42-1.42 9 9 0 0112.98 0 1 1 0 01-1.42 1.42zM20 9.5a12 12 0 00-16 0 1 1 0 01-1.34-1.49 14 14 0 0118.68 0A1 1 0 0120 9.5z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 5.27L3.28 4 20 20.72 18.73 22l-3.28-3.28A10.9 10.9 0 0112 20a10.9 10.9 0 01-8-3.5 1 1 0 011.46-1.36A8.9 8.9 0 0012 18c1.29 0 2.52-.27 3.64-.76L13 14.6a5 5 0 01-6.77-6.77L2 5.27z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {isOnline ? "Online" : "Offline mode"} • Sync queue {syncQueueCount}
              </p>
              <p className="mt-1">
                {isOnline
                  ? "Changes will sync automatically after login."
                  : "Saved locally. Sync will resume once connected."}
              </p>
            </div>
          </div>

          {/* Helper text */}
          <p 
            className="text-xs text-center mt-4 flex items-center justify-center gap-1"
            style={{color: isDarkMode ? '#6B7280' : '#9CA3AF'}}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Works offline after first login.
          </p>
        </div>

        {/* Footer Note */}
        <p 
          className="text-center text-sm mt-6"
          style={{color: isDarkMode ? '#6B7280' : '#4B5563'}}
        >
          Need help? Contact your school administrator
        </p>
      </div>
    </div>
  );
}
