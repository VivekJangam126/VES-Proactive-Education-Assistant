import React from 'react';
import { Check, Users, Bell, Brain, Upload, BarChart3, BookOpen, Languages, MessageSquare, Headphones, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function PricingTable() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme === 'dark' ? 'from-slate-900 to-gray-900' : 'from-slate-50 to-blue-50'} p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Section */}
          <div className="lg:col-span-1 relative">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs sm:text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Most Popular
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">Premium Plan</span>
              </h1>
              
              <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} mb-8 leading-relaxed`}>
                Unlock all features to maximize student success and prevent dropouts with our comprehensive education platform.
              </p>

              {/* CTA Button */}
              <button onClick={() => navigate('/payment')} className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white font-bold py-4 sm:py-5 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mb-6 relative overflow-hidden group text-sm sm:text-base">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🚀 Start Free Trial
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-center mb-6`}>
                ✨ 30-day free trial • No credit card required
              </p>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                  <Check className="w-4 h-4" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Features List */}
          <div className={`lg:col-span-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700`}>
            <div className="text-center mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Everything You Need</h2>
              <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Powerful features designed for educational excellence</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-blue-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Unlimited Student Monitoring</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Track and assess risk for all your students with advanced analytics</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-yellow-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Automated Risk Alerts</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Get instant notifications when students need attention</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-purple-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>AI-Powered Interventions</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Receive personalized recommendations to help at-risk students</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-green-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Easy Data Import</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Import student data via CSV or API seamlessly</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-indigo-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Advanced Analytics Dashboard</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Comprehensive insights and detailed reporting</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-red-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Multi-User Support</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Unlimited teachers and admin accounts</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-cyan-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Class Management</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Organize and manage unlimited classes effortlessly</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-emerald-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Multi-Language Support</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Available in English, Hindi, and Marathi</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-violet-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Google Translate Integration</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Translate content instantly for better communication</div>
                </div>
              </div>
              
              <div className={`group flex items-start gap-4 p-6 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-50 hover:bg-rose-50'} rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-base sm:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Priority Support</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>24/7 support and comprehensive training resources</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}