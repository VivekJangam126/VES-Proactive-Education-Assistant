import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import DashboardFooter from "../components/layout/DashboardFooter";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-gray-900">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <DashboardFooter />
      </div>

    </div>
  );
}
