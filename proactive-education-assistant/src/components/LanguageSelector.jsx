import { useEffect, useState } from 'react';
import i18n from 'i18next';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

const options = [
  { value: 'en', label: 'EN', fullName: 'English' },
  { value: 'hi', label: 'HI', fullName: 'हिंदी' },
  { value: 'mr', label: 'MR', fullName: 'मराठी' }
];

export default function LanguageSelector({ className = '', buttonClassName = '' }) {
  const [lang, setLang] = useState(i18n.language || 'en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onChange = (l) => setLang(l);
    i18n.on('languageChanged', onChange);
    return () => i18n.off('languageChanged', onChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.language-selector')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleChange = (newLang) => {
    setLang(newLang);
    setIsOpen(false);
    try {
      localStorage.removeItem('i18nextLng');
      localStorage.removeItem('appLang');
      localStorage.setItem('i18nextLng', newLang);
    } catch (_e) {}
    i18n.changeLanguage(newLang).then(() => {
      // Force reload to ensure all components update
      window.location.reload();
    });
  };

  const currentLang = options.find(opt => opt.value === lang) || options[0];

  return (
    <div className={`relative language-selector ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-base font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-9 sm:w-auto shadow-sm shadow-gray-400/20 hover:shadow-md ${buttonClassName}`}
        aria-label="Select Language"
      >
        <FaGlobe className="text-gray-600 dark:text-gray-400" />
        <span className="hidden sm:inline truncate">{currentLang.fullName}</span>
        <FaChevronDown className={`hidden sm:inline text-sm text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleChange(opt.value)}
              className={`w-full px-4 py-3 text-left text-base font-medium transition-all duration-200 ${
                lang === opt.value
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt.fullName}</span>
                {lang === opt.value && (
                  <span className="text-blue-500 dark:text-blue-400">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
