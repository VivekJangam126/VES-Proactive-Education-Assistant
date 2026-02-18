import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TeacherProvider } from "./context/TeacherContext";
import { GamificationProvider } from "./context/GamificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import Chatbot from "./components/chatbot/Chatbot";

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <BrowserRouter>
        <AuthProvider>
          <TeacherProvider>
            <AppRoutes />
            <Chatbot />
          </TeacherProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
