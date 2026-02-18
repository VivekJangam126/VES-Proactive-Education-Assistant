import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

// Public pages
import LandingPage from "../pages/LandingPage";
import PricingTable from "../pages/payement/PricingTable";
import PaymentUI from "../pages/payement/PaymentUI";

// Teacher pages
import DashboardPage from "../pages/teacher/DashboardPage";
import StudentListPage from "../pages/teacher/StudentListPage";
import StudentProfilePage from "../pages/teacher/StudentProfilePage";
import ProfilePage from "../pages/teacher/ProfilePage";
import DataEntryPage from "../pages/teacher/DataEntryPage";
import GamificationPage from "../pages/teacher/GamificationPage";
import AddStudentPage from "../pages/teacher/AddStudentPage";
import MyClassesPage from "../pages/teacher/MyClassesPage";
import LoginPage from "../pages/teacher/LoginPage";

import MainLayout from "../layouts/MainLayout";

// Admin pages
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherManagement from "../pages/admin/TeacherManagement";
import ClassManagement from "../pages/admin/ClassManagement";
import SubjectManagement from "../pages/admin/SubjectManagement";
import Analytics from "../pages/admin/Analytics";

export default function AppRoutes() {
  const { loading, isAuthenticated, role } = useAuth();

  // Show loading while session is being restored
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ============ PUBLIC ROUTES ============ */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to={role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} replace />
          ) : (
            <LandingPage />
          )
        } 
      />
      <Route path="/pricing" element={<PricingTable />} />
      <Route path="/payment" element={<PaymentUI />} />

      {/* ============ ADMIN ROUTES (PROTECTED) ============ */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Routes>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="teachers" element={<TeacherManagement />} />
                <Route path="classes" element={<ClassManagement />} />
                <Route path="students" element={<StudentOverview />} />
                <Route path="data-import" element={<DataImport />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* ============ TEACHER ROUTES (PROTECTED) ============ */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <MainLayout>
              <StudentListPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/:id"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <MainLayout>
              <StudentProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ============ CATCH ALL ============ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
