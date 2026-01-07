import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Custom animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slideIn {
    animation: slideIn 0.4s ease-out;
  }
`;

const Chatbot = () => {
  const { theme } = useTheme();

  // Inject custom animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Proactive Education Assistant chatbot. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      isTyping: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Knowledge base for the chatbot
  const knowledgeBase = {
    greetings: [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'
    ],
    about: [
      'what is this', 'what is proactive education', 'about', 'what does this do', 'purpose'
    ],
    features: [
      'features', 'what can you do', 'capabilities', 'functionality'
    ],
    pricing: [
      'pricing', 'cost', 'price', 'how much', 'subscription', 'plan'
    ],
    payment: [
      'payment', 'pay', 'checkout', 'billing'
    ],
    support: [
      'help', 'support', 'contact', 'assistance'
    ]
  };

  const responses = {
    greetings: [
      "Hello! Welcome to Proactive Education Assistant. How can I help you today?",
      "Hi there! I'm here to assist you with anything related to our education platform.",
      "Hey! Great to see you. What would you like to know about our application?"
    ],
    about: [
      "Proactive Education Assistant is a comprehensive platform designed to help educational institutions manage students, teachers, and administrative tasks efficiently. We provide tools for student management, teacher coordination, analytics, and much more.",
      "We're an innovative education management system that streamlines school operations, enhances learning experiences, and provides valuable insights through advanced analytics."
    ],
    features: [
      "Our platform includes: Student Management, Teacher Dashboard, Analytics & Reporting, Class Management, Data Import/Export, Payment Processing, and much more. You can explore all features in the respective sections of our application.",
      "Key features include: Comprehensive student profiles, Teacher assignment tools, Real-time analytics, Secure payment gateway, Multi-language support, and Responsive design for all devices."
    ],
    pricing: [
      "We offer a premium plan at ₹499/month with a 50% discount from the regular ₹999. This includes all features, unlimited users, and priority support.",
      "Our pricing is ₹499 per month (currently 50% off from ₹999). This gives you access to all premium features including analytics, unlimited students/teachers, and 24/7 support."
    ],
    payment: [
      "You can make payments through our secure gateway supporting UPI, Credit/Debit Cards, Net Banking, and Pay Later options. We also support auto-pay for monthly subscriptions.",
      "Payment is processed securely through Razorpay. We accept UPI (Google Pay, PhonePe, BHIM), all major credit/debit cards, net banking, and Pay Later options."
    ],
    support: [
      "You can reach our support team through the contact section or email us at support@proactiveeducation.com. We're here to help 24/7!",
      "For assistance, please check our FAQ section or contact our support team. You can also explore the different sections of our application for self-help resources."
    ],
    default: [
      "I'm not sure about that specific question. Could you please rephrase it or ask about our features, pricing, payment options, or general support?",
      "I'd be happy to help! Please ask me about our features, pricing, payment methods, or any other aspect of the Proactive Education Assistant platform.",
      "That's an interesting question! While I might not have the exact answer, I can tell you about our core features, pricing plans, and how to use the platform effectively."
    ]
  };

  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Check greetings
    if (knowledgeBase.greetings.some(word => message.includes(word))) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }

    // Check about
    if (knowledgeBase.about.some(word => message.includes(word))) {
      return responses.about[Math.floor(Math.random() * responses.about.length)];
    }

    // Check features
    if (knowledgeBase.features.some(word => message.includes(word))) {
      return responses.features[Math.floor(Math.random() * responses.features.length)];
    }

    // Check pricing
    if (knowledgeBase.pricing.some(word => message.includes(word))) {
      return responses.pricing[Math.floor(Math.random() * responses.pricing.length)];
    }

    // Check payment
    if (knowledgeBase.payment.some(word => message.includes(word))) {
      return responses.payment[Math.floor(Math.random() * responses.payment.length)];
    }

    // Check support
    if (knowledgeBase.support.some(word => message.includes(word))) {
      return responses.support[Math.floor(Math.random() * responses.support.length)];
    }

    // Default response
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        id: messages.length + 2,
        text: getResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Dragging functionality
  const handleMouseDown = (e) => {
    if (isOpen) return; // Don't allow dragging when chat is open
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Keep the button within viewport bounds
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      {/* Chatbot Button */}
      <div
        className={`fixed z-50 cursor-move select-none ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          onClick={() => !isDragging && setIsOpen(true)}
          className={`w-16 h-16 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600' : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600'} rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 flex items-center justify-center group relative overflow-hidden`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-pulse"></div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-20"></div>

          <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />

          {/* Notification dot */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce shadow-lg border-2 border-white">
              <div className="w-full h-full bg-red-400 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
        </div>

        {/* Tooltip */}
        {!isOpen && !isDragging && (
          <div className={`absolute bottom-full right-0 mb-3 px-3 py-2 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'} rounded-lg shadow-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            Chat with us!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current"></div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none animate-fadeIn">
          <div
            ref={chatRef}
            className={`w-full max-w-md h-96 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} border-2 rounded-3xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden transform transition-all duration-500 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            style={{
              marginBottom: '100px',
              marginRight: '20px'
            }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-5 ${theme === 'dark' ? 'bg-gradient-to-r from-slate-700 to-slate-600' : 'bg-gradient-to-r from-slate-50 to-slate-100'} border-b ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} relative overflow-hidden`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full -translate-y-10 translate-x-10"></div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} rounded-full flex items-center justify-center shadow-lg animate-pulse`}>
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Proactive Assistant</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium flex items-center gap-1`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Online
                  </div>
                </div>
              </div>
              <div className="flex gap-2 relative z-10">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-slate-600 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-800'} transition-all duration-200 hover:scale-105`}
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-red-600 text-slate-300 hover:text-white' : 'hover:bg-red-500 text-slate-600 hover:text-white'} transition-all duration-200 hover:scale-105`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className={`flex-1 overflow-y-auto p-5 space-y-4 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-800 to-slate-700' : 'bg-gradient-to-b from-slate-50 to-white'} relative`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-3">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-xl"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-xl"></div>
                  </div>

                  <div className="relative z-10">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
                        style={{
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        <div className={`flex items-end gap-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${message.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </div>

                          {/* Message bubble */}
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md'
                                : `${theme === 'dark' ? 'bg-gradient-to-br from-slate-700 to-slate-600 text-white' : 'bg-gradient-to-br from-white to-slate-100 text-slate-800'} border ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} rounded-bl-md`
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start animate-slideIn">
                        <div className="flex items-end gap-2 max-w-xs">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className={`px-4 py-3 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-slate-700 to-slate-600' : 'bg-gradient-to-br from-white to-slate-100'} border ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} rounded-bl-md`}>
                            <div className="flex items-center gap-1">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                              </div>
                              <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} ml-2`}>Typing...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className={`p-5 ${theme === 'dark' ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-slate-600' : 'bg-gradient-to-r from-white to-slate-50 border-slate-200'} border-t relative overflow-hidden`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full translate-y-8 -translate-x-8"></div>
                  </div>

                  <div className="flex gap-3 relative z-10">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about our platform..."
                        className={`w-full px-4 py-3 pr-12 rounded-2xl border-2 ${theme === 'dark' ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400 focus:border-blue-400' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:border-blue-500'} focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg`}
                      />
                      {inputMessage && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className={`p-3 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                        inputMessage.trim()
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/25'
                          : `${theme === 'dark' ? 'bg-slate-600 text-slate-400' : 'bg-slate-300 text-slate-500'} cursor-not-allowed`
                      }`}
                    >
                      <Send className={`w-5 h-5 transition-transform duration-200 ${inputMessage.trim() ? 'hover:translate-x-0.5 hover:-translate-y-0.5' : ''}`} />
                    </button>
                  </div>

                  {/* Quick suggestions */}
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {['Features', 'Pricing', 'Support'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInputMessage(`Tell me about ${suggestion.toLowerCase()}`)}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 ${
                          theme === 'dark'
                            ? 'bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Chatbot;