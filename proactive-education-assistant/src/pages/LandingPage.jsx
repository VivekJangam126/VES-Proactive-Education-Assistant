import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaChartLine, FaBell, FaUsers, FaLightbulb, FaShieldAlt, FaMobile, FaArrowRight, FaCheckCircle, FaSun, FaMoon } from "react-icons/fa";
import LoginModal from "../components/auth/login";
import RegisterModal from "../components/auth/register";
import { useTranslation, Trans } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import { useTheme } from "../context/ThemeContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState(null);
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  // Removed: useAuth hook and redirect logic - routing handles this now

  const features = [
    { icon: FaChartLine, titleKey: "landing.feature_risk_title", descKey: "landing.feature_risk_desc" },
    { icon: FaBell, titleKey: "landing.feature_alerts_title", descKey: "landing.feature_alerts_desc" },
    { icon: FaLightbulb, titleKey: "landing.feature_interventions_title", descKey: "landing.feature_interventions_desc" },
    { icon: FaUsers, titleKey: "landing.feature_collab_title", descKey: "landing.feature_collab_desc" },
    { icon: FaMobile, titleKey: "landing.feature_offline_title", descKey: "landing.feature_offline_desc" },
    { icon: FaShieldAlt, titleKey: "landing.feature_secure_title", descKey: "landing.feature_secure_desc" }
  ];

  const stats = [
    { number: "85%", labelKey: "landing.stats_dropout_prevention" },
    { number: "10K+", labelKey: "landing.stats_students_monitored" },
    { number: "200+", labelKey: "landing.stats_schools_ngos" },
    { number: "24/7", labelKey: "landing.stats_support_available" }
  ];

  const benefits = [
    t("landing.benefit_1"),
    t("landing.benefit_2"),
    t("landing.benefit_3"),
    t("landing.benefit_4"),
    t("landing.benefit_5"),
    t("landing.benefit_6")
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-400/5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm animate-in fade-in-0 slide-in-from-top-2 duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-left-4 duration-500" style={{animationDelay: '0.2s'}}>
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center animate-in zoom-in-95 duration-300" style={{animationDelay: '0.4s'}}>
                <FaBook className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {t('landing.brand_name')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-right-4 duration-500" style={{animationDelay: '0.3s'}}>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
              </button>
              <LanguageSelector />
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200 hover:scale-105"
              >
                {t('auth.sign_in')}
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-5 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('auth.get_started')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-blue-50 dark:from-gray-800 to-white dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium animate-in fade-in-0 slide-in-from-left-4 duration-700">
                <FaCheckCircle />
                <span>{t('landing.trusted_badge')}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-in fade-in-0 slide-in-from-left-4 duration-700" style={{ animationDelay: '0.2s' }}>
                <Trans i18nKey="landing.headline">
                  Prevent Student Dropouts <span className="text-blue-600 dark:text-blue-400">Before They Happen</span>
                </Trans>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-in fade-in-0 slide-in-from-left-4 duration-700" style={{ animationDelay: '0.4s' }}>
                {t('landing.subheadline')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={() => {
                    setLoginRedirectPath('/pricing');
                    setShowLogin(true);
                  }}
                  className="px-8 py-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105"
                >
                  {t('landing.start_trial')}
                  <FaArrowRight />
                </button>
                <button
                  onClick={() => {
                    setLoginRedirectPath('/dashboard');
                    setShowLogin(true);
                  }}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                >
                  {t('landing.view_demo')}
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 animate-in fade-in-0 duration-700" style={{ animationDelay: '0.8s' }}>
                {t('landing.no_cc')}
              </p>
            </div>

            {/* Right: Hero Image/Illustration */}
            <div className="relative animate-in fade-in-0 slide-in-from-right-4 duration-700" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-shadow duration-300">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('landing.risk_dashboard')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('landing.live_student_monitoring')}</p>
                    </div>
                  </div>

                  {/* Mock Risk Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600">8</div>
                      <div className="text-xs text-red-700 font-medium mt-1">{t('landing.high_risk')}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-600">12</div>
                      <div className="text-xs text-yellow-700 font-medium mt-1">{t('landing.medium_risk')}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">45</div>
                      <div className="text-xs text-green-700 font-medium mt-1">{t('landing.low_risk')}</div>
                    </div>
                  </div>

                  {/* Mock Student List */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded w-24 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          i === 1 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {i === 1 ? t('landing.high_risk') : t('landing.medium_risk')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm">
                ✓ {t('landing.real_time_updates')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100 dark:text-blue-200">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              {t('landing.features_title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.2s' }}>
              {t('landing.features_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{t(feature.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in-0 slide-in-from-left-4 duration-700">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('landing.benefits_title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {t('landing.benefits_subtitle')}
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 animate-in fade-in-0 slide-in-from-left-4 duration-700" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                    <FaCheckCircle className="text-green-500 dark:text-green-400 text-xl mt-1 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowRegister(true)}
                className="mt-8 px-8 py-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 hover:scale-105"
              >
                {t('landing.get_started_now')}
                <FaArrowRight />
              </button>
            </div>

            <div className="bg-linear-to-br from-blue-50 dark:from-blue-900/30 to-teal-50 dark:to-teal-900/30 rounded-2xl p-8 animate-in fade-in-0 slide-in-from-right-4 duration-700" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('landing.student_name_sample')}</h3>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                    {t('landing.high_risk')}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('landing.attendance_trend')}</div>
                    <div className="flex items-end gap-1 h-16">
                      {[85, 78, 72, 68, 62].map((val, i) => (
                        <div key={i} className="flex-1 bg-red-400 dark:bg-red-500 rounded-t" style={{ height: `${val}%` }}></div>
                      ))}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">{t('landing.declining_trend')}</div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <FaLightbulb className="text-yellow-600 dark:text-yellow-400 mt-1" />
                      <div>
                        <div className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-1">{t('landing.recommended_actions')}</div>
                        <ul className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
                          <li>• {t('landing.action_parent_meeting')}</li>
                          <li>• {t('landing.action_family_issues')}</li>
                          <li>• {t('landing.action_peer_buddy')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-teal-600 dark:from-blue-700 dark:to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            {t('landing.cta_title')}
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.2s' }}>
            {t('landing.cta_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => setShowRegister(true)}
              className="px-8 py-4 bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700 rounded-lg hover:bg-gray-100 dark:hover:bg-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 hover:scale-105"
            >
              {t('landing.start_trial')}
              <FaArrowRight />
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center gap-2 hover:scale-105"
            >
              {t('auth.sign_in')}
            </button>
          </div>
          <p className="text-sm text-blue-100 dark:text-blue-200 mt-6 animate-in fade-in-0 duration-700" style={{ animationDelay: '0.6s' }}>
            <Trans i18nKey="landing.cta_questions">
              Questions? Contact us at <a href="mailto:support@proactiveeducation.org" className="underline hover:text-white">support@proactiveeducation.org</a>
            </Trans>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 dark:text-gray-500 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <FaBook className="text-white text-sm" />
                </div>
                <span className="text-white dark:text-gray-200 font-semibold">{t('landing.brand_name')}</span>
              </div>
              <p className="text-sm">
                {t('landing.subheadline')}
              </p>
            </div>

            <div>
              <h4 className="text-white dark:text-gray-200 font-semibold mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.features')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.pricing')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.case_studies')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.demo')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white dark:text-gray-200 font-semibold mb-4">{t('footer.resources')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.documentation')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.help_center')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.training')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.blog')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white dark:text-gray-200 font-semibold mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.about_us')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('nav.contact')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.privacy_policy')}</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">{t('footer.terms_of_service')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-900 pt-8 text-center text-sm">
            <p>{t('landing.copyright_full')}</p>
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
