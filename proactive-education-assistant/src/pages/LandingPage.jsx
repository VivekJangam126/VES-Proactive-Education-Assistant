import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaChartLine,
  FaLightbulb,
  FaClipboardCheck,
  FaFileAlt,
  FaChevronRight
} from "react-icons/fa";
import LoginModal from "../components/auth/login";
import RegisterModal from "../components/auth/register";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState(null);
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  // Removed: useAuth hook and redirect logic - routing handles this now

  const features = [
    {
      icon: FaChartLine,
      title: "Early Risk Detection",
      description: "Identify at-risk students before it's too late with data-driven insights"
    },
    {
      icon: FaLightbulb,
      title: "Explainable Insights",
      description: "Clear, transparent reasons behind every risk assessment"
    },
    {
      icon: FaClipboardCheck,
      title: "Teacher-Friendly Dashboard",
      description: "Simple, intuitive interface designed for real classroom workflows"
    },
    {
      icon: FaFileAlt,
      title: "Offline Support",
      description: "Work seamlessly in low-connectivity environments"
    }
  ];

  const stats = [
    { value: "30%", label: "Faster Intervention" },
    { value: "100%", label: "Explainable AI" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaBook className="text-white text-lg" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Proactive Education
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900">Benefits</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Detect Student Dropout Risk Early
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              An AI-powered early warning system that helps educators identify at-risk students 
              using attendance, performance, and behavior data with clear, explainable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setLoginRedirectPath('/pricing');
                  setShowLogin(true);
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Start Free Trial
                <FaChevronRight className="text-sm" />
              </button>
              <button
                onClick={() => {
                  setLoginRedirectPath('/dashboard');
                  setShowLogin(true);
                }}
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-lg font-medium hover:border-gray-300 transition-colors"
              >
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Educators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to identify and support at-risk students effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple, repeatable workflow for early detection and coordinated action
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collect Data</h3>
              <p className="text-gray-600">
                Gather attendance, academic performance, and behavioral data from your students
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Detect Risk</h3>
              <p className="text-gray-600">
                AI analyzes trends and generates explainable risk scores for each student
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Action</h3>
              <p className="text-gray-600">
                Implement targeted interventions with tracking and follow-up reminders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Built for Schools, NGOs, and Education Programs
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">For Teachers</h3>
                    <p className="text-gray-600">Class-level risk lists, daily follow-up prompts, and simple intervention notes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">For Schools</h3>
                    <p className="text-gray-600">Multi-class oversight, attendance trends, and export-ready reports</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">For Organizations</h3>
                    <p className="text-gray-600">Program-level monitoring, field team coordination, and evidence for funding</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  <FaChartLine className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
                <p className="text-gray-600">Join schools already using our platform to support their students</p>
              </div>
              <button
                onClick={() => setShowRegister(true)}
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                No credit card required • 30-day free trial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaBook className="text-blue-400" />
                <span className="font-semibold text-white">Proactive Education</span>
              </div>
              <p className="text-sm text-gray-400">
                Decision support for keeping students in school
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white">Privacy</a>
              <a href="/terms" className="hover:text-white">Terms</a>
              <a href="/contact" className="hover:text-white">Contact</a>
              <a href="/about" className="hover:text-white">About</a>
              <span className="text-gray-500">© 2026 Proactive Education</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => {
          setShowLogin(false);
          setLoginRedirectPath(null);
        }}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLoginSuccess={() => {
          if (loginRedirectPath) {
            navigate(loginRedirectPath);
            setLoginRedirectPath(null);
          }
        }}
      />
      
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
}
