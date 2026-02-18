import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TeacherContext = createContext();

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within TeacherProvider');
  }
  return context;
};


export const TeacherProvider = ({ children }) => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Sync teacher context with AuthContext user
  useEffect(() => {
    if (user && user.role === 'TEACHER') {
      setTeacher(user);
      localStorage.setItem('teacherData', JSON.stringify(user));
      // Auto-select class if only one assigned
      if (user.assignedClasses?.length === 1) {
        setSelectedClass(user.assignedClasses[0]);
      }
    }
  }, [user]);

  // Optionally keep loginTeacher for legacy/manual login flows
  const loginTeacher = (teacherData) => {
    setTeacher(teacherData);
    localStorage.setItem('teacherData', JSON.stringify(teacherData));
    if (teacherData.assignedClasses?.length === 1) {
      setSelectedClass(teacherData.assignedClasses[0]);
    }
  };

  const logoutTeacher = () => {
    setTeacher(null);
    setSelectedClass(null);
    localStorage.removeItem('teacherData');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminData');
    localStorage.removeItem('school_id');
    localStorage.removeItem('school_name');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('school_id');
    sessionStorage.removeItem('school_name');
    // Trigger custom event for route update
    window.dispatchEvent(new Event("localStorageUpdate"));
  };

  const value = {
    teacher,
    selectedClass,
    setSelectedClass,
    loginTeacher,
    logoutTeacher,
    hasMultipleClasses: teacher?.assignedClasses?.length > 1,
    hasSingleClass: teacher?.assignedClasses?.length === 1,
  };

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>;
};
