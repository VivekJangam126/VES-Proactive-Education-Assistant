import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getTeachers,
  getClasses,
  getSubjects,
  getAdminStats,
  getRiskDistribution,
  getRiskTrendData,
  getHighRiskAlerts,
} from '../services/adminService';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Data state
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [stats, setStats] = useState(null);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [riskTrendData, setRiskTrendData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        teachersData,
        classesData,
        statsData,
        riskDistData,
        riskTrendData,
        alertsData,
      ] = await Promise.all([
        Promise.resolve(getTeachers()),
        Promise.resolve(getClasses()),
        Promise.resolve(getAdminStats()),
        Promise.resolve(getRiskDistribution()),
        Promise.resolve(getRiskTrendData()),
        Promise.resolve(getHighRiskAlerts()),
      ]);

      setTeachers(teachersData);
      setClasses(classesData);
      setStats(statsData);
      setRiskDistribution(riskDistData);
      setRiskTrendData(riskTrendData);
      setAlerts(alertsData);

      // Load subjects for each class
      const subjectsMap = {};
      classesData.forEach((cls) => {
        subjectsMap[cls.id] = getSubjects(cls.id);
      });
      setSubjects(subjectsMap);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh specific data
  const refreshTeachers = useCallback(() => {
    const teachersData = getTeachers();
    setTeachers(teachersData);
  }, []);

  const refreshClasses = useCallback(() => {
    const classesData = getClasses();
    setClasses(classesData);
  }, []);

  const refreshSubjects = useCallback((classId) => {
    const subjectsData = getSubjects(classId);
    setSubjects((prev) => ({ ...prev, [classId]: subjectsData }));
  }, []);

  const refreshStats = useCallback(() => {
    const statsData = getAdminStats();
    const riskDistData = getRiskDistribution();
    const riskTrendData = getRiskTrendData();
    const alertsData = getHighRiskAlerts();

    setStats(statsData);
    setRiskDistribution(riskDistData);
    setRiskTrendData(riskTrendData);
    setAlerts(alertsData);
  }, []);

  // Teacher operations
  const addTeacher = useCallback((teacherData) => {
    const newTeacher = {
      id: Math.max(...teachers.map((t) => t.id), 0) + 1,
      ...teacherData,
      status: 'Pending',
    };
    setTeachers([...teachers, newTeacher]);
    return newTeacher;
  }, [teachers]);

  const updateTeacher = useCallback((id, teacherData) => {
    setTeachers(teachers.map((t) => (t.id === id ? { ...t, ...teacherData } : t)));
  }, [teachers]);

  const deleteTeacher = useCallback((id) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  }, [teachers]);

  // Class operations
  const addClass = useCallback((classData) => {
    const newClass = {
      id: Math.max(...classes.map((c) => c.id), 0) + 1,
      ...classData,
    };
    setClasses([...classes, newClass]);
    return newClass;
  }, [classes]);

  const updateClass = useCallback((id, classData) => {
    setClasses(classes.map((c) => (c.id === id ? { ...c, ...classData } : c)));
  }, [classes]);

  const deleteClass = useCallback((id) => {
    setClasses(classes.filter((c) => c.id !== id));
  }, [classes]);

  // Subject operations
  const addSubject = useCallback((classId, subjectData) => {
    const currentSubjects = subjects[classId] || [];
    const newSubject = {
      id: Math.max(...currentSubjects.map((s) => s.id), 0) + 1,
      ...subjectData,
    };
    setSubjects((prev) => ({
      ...prev,
      [classId]: [...(prev[classId] || []), newSubject],
    }));
    return newSubject;
  }, [subjects]);

  const updateSubject = useCallback((classId, subjectId, subjectData) => {
    setSubjects((prev) => ({
      ...prev,
      [classId]: (prev[classId] || []).map((s) =>
        s.id === subjectId ? { ...s, ...subjectData } : s
      ),
    }));
  }, []);

  const deleteSubject = useCallback((classId, subjectId) => {
    setSubjects((prev) => ({
      ...prev,
      [classId]: (prev[classId] || []).filter((s) => s.id !== subjectId),
    }));
  }, []);

  const value = {
    // Data
    teachers,
    classes,
    subjects,
    stats,
    riskDistribution,
    riskTrendData,
    alerts,

    // UI State
    loading,
    error,

    // Refresh functions
    loadAllData,
    refreshTeachers,
    refreshClasses,
    refreshSubjects,
    refreshStats,

    // Teacher operations
    addTeacher,
    updateTeacher,
    deleteTeacher,

    // Class operations
    addClass,
    updateClass,
    deleteClass,

    // Subject operations
    addSubject,
    updateSubject,
    deleteSubject,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// Hook to use AdminContext
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
