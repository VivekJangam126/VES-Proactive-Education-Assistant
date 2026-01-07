import { BrowserRouter } from "react-router-dom";
import { TeacherProvider } from "./context/TeacherContext";
import AppRoutes from "./routes/AppRoutes";
import Chatbot from "./pages/chatbot/Chatbot";

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <BrowserRouter>
        <TeacherProvider>
          <AppRoutes />
          <Chatbot />
        </TeacherProvider>
      </BrowserRouter>
    </div>
  );
}
