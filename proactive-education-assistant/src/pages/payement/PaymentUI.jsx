import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import googlePayLogo from '../../assets/googlepay.jpg';
import phonePayLogo from '../../assets/phonepay.png';
import bhimLogo from '../../assets/bhim.png';
import visaLogo from '../../assets/visa.png';
import mcLogo from '../../assets/mc.jpg';
import sbiLogo from '../../assets/sbi.png';
import hdfcLogo from '../../assets/hdfc.png';
import icicLogo from '../../assets/icic.png';
import payLaterLogo from '../../assets/paylater.png';
import paymentQR from '../../assets/payementQR.jpeg';

export default function PaymentUI() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/');
    }
  }, [timeLeft, navigate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100'} p-3 sm:p-4 lg:p-4 flex items-center justify-center relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-400/5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-slate-800 dark:text-white">Processing Payment...</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Please wait while we secure your transaction</p>
            <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-7xl w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        {/* Left Sidebar */}
        <div className="w-full lg:w-80 space-y-4 sm:space-y-6 animate-in fade-in-0 slide-in-from-left-4 duration-500" style={{animationDelay: '0.2s'}}>
          {/* Logo */}
          <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in-0 slide-in-from-left-2 duration-500`} style={{animationDelay: '0.4s'}}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-in zoom-in-95 duration-300" style={{animationDelay: '0.6s'}}>
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10h7c-.53 4.12-3.28 7.79-7 8.94V12H5V7.89l7-3.78v8.89z"/>
              </svg>
            </div>
            <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-800'} text-lg sm:text-xl font-semibold`}>Proactive Education</span>
          </div>

          {/* Price Summary */}
          <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-700' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl p-6 shadow-xl border ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} hover:shadow-2xl transition-all duration-300 animate-in fade-in-0 slide-in-from-left-2 duration-500`} style={{animationDelay: '0.6s'}}>
            <div className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-sm mb-2 font-medium`}>Premium Plan</div>
            <div className="flex items-baseline gap-2 mb-2">
              <div className={`${theme === 'dark' ? 'text-white' : 'text-slate-800'} text-3xl sm:text-4xl font-bold animate-in zoom-in-95 duration-300`} style={{animationDelay: '0.8s'}}>₹499</div>
              <div className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-base sm:text-lg line-through`}>₹999</div>
            </div>
            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300" style={{animationDelay: '1s'}}>
              50% OFF
            </div>
            <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} flex items-center gap-1 animate-in fade-in-0 duration-300`} style={{animationDelay: '1.2s'}}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Auto-pay enabled: ₹499 will be charged monthly
            </div>
          </div>

          {/* User Info */}
          <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4 flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in-0 slide-in-from-left-2 duration-500 overflow-hidden`} style={{animationDelay: '0.8s'}}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 text-slate-400 animate-pulse flex-shrink-0">👤</div>
              <span className={`${theme === 'dark' ? 'text-white' : 'text-slate-800'} text-xs sm:text-sm truncate`}>Using as +91 9561050563</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </div>

          {/* Footer */}
          <div className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} text-xs flex items-center gap-2 px-2 animate-in fade-in-0 duration-500`} style={{animationDelay: '1s'}}>
            <span>Secured by</span>
            <span className="font-semibold">Razorpay</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600' : 'bg-gradient-to-br from-white via-slate-50 to-slate-100'} rounded-3xl p-6 sm:p-8 lg:p-10 relative shadow-2xl border ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} overflow-hidden flex-1`}>
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full translate-y-24 -translate-x-24"></div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0`}>
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1 sm:mb-2`}>Secure Payment</h1>
                <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} text-sm sm:text-base lg:text-lg`}>Choose your preferred payment method</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <button className={`${theme === 'dark' ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'} p-2 sm:p-3 rounded-xl transition-all duration-200`}>
                ⋯
              </button>
              <button onClick={() => {
                setIsLoading(true);
                setTimeout(() => navigate('/'), 10000);
              }} className={`${theme === 'dark' ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'} p-2 sm:p-3 rounded-xl transition-all duration-200 disabled:opacity-50`} disabled={isLoading}>
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <X className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 sm:space-y-5 animate-in fade-in-0 duration-500" style={{animationDelay: '0.8s'}}>
            {/* UPI */}
            <div className={`${theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600 hover:border-blue-400' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300'} border-2 rounded-2xl p-4 sm:p-6 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4 duration-500`} style={{animationDelay: '1s'}}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold text-base sm:text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>UPI Payment</div>
                    <div className="text-xs sm:text-sm text-green-600 font-medium">Fast & Secure • 2 Offers Available</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <img src={googlePayLogo} alt="Google Pay" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <img src={phonePayLogo} alt="PhonePe" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <img src={bhimLogo} alt="BHIM" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className={`${theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600 hover:border-green-400' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-green-300'} border-2 rounded-2xl p-4 sm:p-6 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4 duration-500`} style={{animationDelay: '1.2s'}}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold text-base sm:text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Credit/Debit Cards</div>
                    <div className="text-xs sm:text-sm text-green-600 font-medium">Secure Payment • Up to 1.5% Cashback</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <div className="w-9 h-6 sm:w-10 sm:h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <img src={visaLogo} alt="Visa" className="h-3 sm:h-4 object-contain" />
                  </div>
                  <div className="w-9 h-6 sm:w-10 sm:h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <img src={mcLogo} alt="Mastercard" className="h-3 sm:h-4 object-contain" />
                  </div>
                </div>
              </div>
            </div>

            {/* Netbanking */}
            <div className={`${theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600 hover:border-purple-400' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-purple-300'} border-2 rounded-2xl p-4 sm:p-6 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4 duration-500`} style={{animationDelay: '1.4s'}}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500'} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold text-base sm:text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Net Banking</div>
                    <div className="text-xs sm:text-sm text-purple-600 font-medium">Direct Bank Transfer • 100+ Banks</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <img src={sbiLogo} alt="SBI" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <img src={hdfcLogo} alt="HDFC" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <img src={icicLogo} alt="ICICI" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Later */}
            <div className={`${theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600 hover:border-orange-400' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-orange-300'} border-2 rounded-2xl p-4 sm:p-6 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4 duration-500`} style={{animationDelay: '1.6s'}}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${theme === 'dark' ? 'bg-orange-600' : 'bg-orange-500'} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold text-base sm:text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Pay Later</div>
                    <div className="text-xs sm:text-sm text-orange-600 font-medium">Buy Now, Pay Later • No Interest</div>
                  </div>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-800'} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-white text-xs sm:text-sm font-bold">PL</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className={`mt-8 sm:mt-12 ${theme === 'dark' ? 'border-slate-600 bg-gradient-to-br from-slate-700 to-slate-600' : 'border-slate-200 bg-gradient-to-br from-white to-slate-50'} border-2 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-700`} style={{animationDelay: '1.8s'}}>
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-400/5 to-transparent rounded-full translate-x-20 translate-y-20"></div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 mb-6 sm:mb-8 relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0`}>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 15h4.01M12 21h4.01M12 12h4.01M12 15h4.01M12 21h4.01M12 12h4.01M12 15h4.01M12 21h4.01" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Scan & Pay Instantly</div>
                  <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>UPI QR Code Payment</div>
                </div>
              </div>
              <div className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 ${theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-100/80'} rounded-2xl backdrop-blur-sm border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} flex-shrink-0`}>
                <Clock className={`w-5 h-5 sm:w-6 sm:h-6 ${minutes < 5 ? 'text-red-500' : 'text-slate-500'}`} />
                <span className={`font-mono font-bold text-lg sm:text-xl ${minutes < 5 ? 'text-red-600' : theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 relative z-10">
              <div className={`w-40 h-40 sm:w-52 sm:h-52 lg:w-52 lg:h-52 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-100 to-white' : 'bg-gradient-to-br from-white to-slate-50'} border-4 ${theme === 'dark' ? 'border-slate-300' : 'border-slate-300'} p-3 sm:p-4 rounded-3xl shadow-2xl relative overflow-hidden group flex-shrink-0`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-20 rounded-2xl group-hover:opacity-30 transition-opacity"></div>
                <img src={paymentQR} alt="Payment QR Code" className="w-full h-full object-cover rounded-2xl relative z-10" />
                <div className="absolute top-3 right-3 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left px-4 sm:px-6 lg:px-0 w-full lg:w-auto">
                <div className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-2 sm:mb-3`}>Scan with any UPI App</div>
                <div className={`text-sm sm:text-base ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} mb-6 sm:mb-8 leading-relaxed`}>Open your favorite UPI app and scan the QR code to complete your secure payment instantly</div>
                <div className="flex justify-center lg:justify-start gap-3 sm:gap-5 mb-6 sm:mb-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-slate-100 group flex-shrink-0">
                    <img src={googlePayLogo} alt="Google Pay" className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-slate-100 group flex-shrink-0">
                    <img src={phonePayLogo} alt="PhonePe" className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-blue-400 group flex-shrink-0">
                    <img src={bhimLogo} alt="BHIM" className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300">
                    <span className="text-xl sm:text-2xl animate-bounce">🎉</span>
                    <span>2 Special Offers Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}