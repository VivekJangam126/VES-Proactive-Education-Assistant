// import { useParams, useNavigate } from "react-router-dom";
// import { students } from "../../data/students";
// import RiskBadge from "../../components/RiskBadge";
// import { useTheme } from "../../context/ThemeContext";
// import {
//   FaArrowLeft,
//   FaUser,
//   FaCalendarCheck,
//   FaChartLine,
//   FaLightbulb,
//   FaExclamationTriangle,
//   FaHome,
//   FaPhone,
//   FaBook,
//   FaClipboardList,
//   FaBrain,
//   FaComments,
// } from "react-icons/fa";
// import { useTranslation } from "react-i18next";
// import { useEffect, useState } from "react";
// import { translateText } from "../../utils/googleTranslate";

// export default function StudentProfilePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();
//   const { darkMode } = useTheme();

//   // Find student from mock data
//   const student = students.find((s) => s.id === parseInt(id));

//   // If student not found
//   if (!student) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
//         <div className="text-center">
//           <FaUser className="mx-auto text-7xl text-gray-300 dark:text-gray-600 mb-4" />
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('teacher.student_not_found')}</h1>
//           <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{t('teacher.student_not_found_desc')}</p>
//           <button
//             onClick={() => navigate("/students")}
//             className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95"
//           >
//             <FaArrowLeft />
//             {t('teacher.back_to_students')}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Mock data for this student
//   const riskExplanation = getRiskExplanation(student);
//   const [riskText, setRiskText] = useState(riskExplanation);

//   useEffect(() => {
//     let isMounted = true;
//     const run = async () => {
//       const lng = i18n.language || 'en';
//       if (lng !== 'en') {
//         const translated = await translateText(riskExplanation, lng, 'en');
//         if (isMounted) setRiskText(translated);
//       } else {
//         if (isMounted) setRiskText(riskExplanation);
//       }
//     };
//     run();
//     return () => { isMounted = false; };
//   }, [riskExplanation, i18n.language]);
//   const attendanceTrend = getAttendanceTrend(student);
//   const academicPerformance = getAcademicPerformance(student);
//   const suggestedInterventions = getSuggestedInterventions(student);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         {/* 1️⃣ Page Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate("/students")}
//             className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold mb-4 transition-colors transform hover:translate-x-1"
//           >
//             <FaArrowLeft />
//             {t('teacher.back_to_students')}
//           </button>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
//             🎓 {t('teacher.student_profile_title')}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 font-medium">{t('teacher.student_profile_subtitle')}</p>
//         </div>

//         {/* 2️⃣ Student Basic Information Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
//           <div className="h-40 bg-gradient-to-r from-blue-500 via-blue-600 to-teal-500 relative">
//             <div className="absolute inset-0 opacity-20 bg-pattern" style={{
//               backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
//             }}></div>
//           </div>

//           <div className="relative px-6 pb-6">
//             <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-20 mb-6">
//               <div className="flex items-end gap-4">
//                 <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-gray-800 transform transition-all duration-300 hover:scale-105">
//                   {student.name.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="pb-2">
//                   <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
//                   <div className="flex flex-wrap items-center gap-2 mt-2">
//                     <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
//                       🎓 {student.class}
//                     </span>
//                     <div className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
//                       📊 {student.attendance}% {t('teacher.attendance_label')}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <RiskBadge level={student.riskLevel} />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 3️⃣ Risk Explanation Section (MOST IMPORTANT) */}
//         <div
//           className={`rounded-2xl shadow-xl p-8 mb-8 border-l-4 ${
//             student.riskLevel === "high"
//               ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-500"
//               : student.riskLevel === "medium"
//               ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-500"
//               : "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500"
//           }`}
//         >
//           <div className="flex items-start gap-4 mb-4">
//             <div className={`text-3xl mt-1 ${
//               student.riskLevel === "high"
//                 ? "text-red-600"
//                 : student.riskLevel === "medium"
//                 ? "text-yellow-600"
//                 : "text-green-600"
//             }`}>
//               ⚠️
//             </div>
//             <div className="flex-1">
//               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//                 {t('teacher.risk_analysis_title')}
//               </h3>
//               <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">{riskText}</p>
//             </div>
//           </div>
//         </div>

//         {/* 4️⃣ Attendance Trend Section */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex items-center gap-2 mb-6">
//             <FaCalendarCheck className="text-blue-600 text-2xl" />
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//               {t('teacher.attendance_trend_title')}
//             </h3>
//           </div>
//           <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
//             {attendanceTrend.map((day, index) => (
//               <div key={index} className="text-center">
//                 <div
//                   className={`w-full h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md transform transition-all duration-300 hover:scale-110 cursor-default ${
//                     day.present ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-orange-600"
//                   }`}
//                 >
//                   {day.present ? t('teacher.present_short') : t('teacher.absent_short')}
//                 </div>
//                 <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-2">{day.label}</p>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 flex items-center gap-6 text-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg"></div>
//               <span className="font-semibold text-gray-700 dark:text-gray-300">{t('teacher.present')}</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg"></div>
//               <span className="font-semibold text-gray-700 dark:text-gray-300">{t('teacher.absent')}</span>
//             </div>
//           </div>
//         </div>

//         {/* 5️⃣ Academic Performance Trend */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex items-center gap-2 mb-6">
//             <FaChartLine className="text-teal-600 text-2xl" />
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//               {t('teacher.academic_overview_title')}
//             </h3>
//           </div>
//           <div className="space-y-6">
//             {academicPerformance.map((subject, index) => (
//               <div key={index}>
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{subject.name}</span>
//                   <span className="text-lg font-bold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
//                     {subject.score}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-md">
//                   <div
//                     className={`h-3 rounded-full transition-all duration-500 ${
//                       subject.score >= 75
//                         ? "bg-gradient-to-r from-green-500 to-emerald-600"
//                         : subject.score >= 50
//                         ? "bg-gradient-to-r from-yellow-500 to-amber-600"
//                         : "bg-gradient-to-r from-red-500 to-orange-600"
//                     }`}
//                     style={{ width: `${subject.score}%` }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 6️⃣ Suggested Interventions Section */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex items-center gap-2 mb-6">
//             <FaLightbulb className="text-yellow-600 text-2xl" />
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//               {t('teacher.suggested_interventions_title')}
//             </h3>
//           </div>
//           <div className="space-y-4">
//             {suggestedInterventions.map((intervention, index) => (
//               <div
//                 key={index}
//                 className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 transform hover:translate-x-1"
//               >
//                 <div className="text-2xl text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1">
//                   <intervention.icon />
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
//                     {intervention.title}
//                   </h4>
//                   <p className="text-sm text-gray-700 dark:text-gray-300">{intervention.description}</p>
//                 </div>
//                 <span
//                   className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${
//                     intervention.priority === "High"
//                       ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200"
//                       : intervention.priority === "Medium"
//                       ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200"
//                       : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200"
//                   }`}
//                 >
//                   {t(`teacher.priority_${intervention.priority.toLowerCase()}`)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* 7️⃣ Action Buttons */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//           <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('teacher.quick_actions')}</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <button
//               onClick={() => alert(t('teacher.coming_soon_add_attendance'))}
//               className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
//             >
//               <FaCalendarCheck />
//               {t('teacher.add_attendance')}
//             </button>
//             <button
//               onClick={() => alert(t('teacher.coming_soon_add_score'))}
//               className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
//             >
//               <FaBook />
//               {t('teacher.add_academic_score')}
//             </button>
//             <button
//               onClick={() => alert(t('teacher.coming_soon_add_behaviour'))}
//               className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:scale-105 active:scale-95"
//             >
//               <FaComments />
//               {t('teacher.add_behaviour')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper functions for mock data
// function getRiskExplanation(student) {
//   if (student.riskLevel === "high") {
//     return `This student is marked high-risk due to a consistent drop in attendance (${student.attendance}%) and declining academic performance over the last month. Recent observations indicate reduced classroom engagement and several missed assignments. Immediate intervention is recommended to prevent potential dropout.`;
//   } else if (student.riskLevel === "medium") {
//     return `This student shows moderate risk indicators. While attendance (${student.attendance}%) is acceptable, there are early warning signs of disengagement, including occasional absences and fluctuating academic performance. Proactive monitoring and support can help prevent escalation to high risk.`;
//   } else {
//     return `This student is currently low-risk with strong attendance (${student.attendance}%) and consistent academic performance. They demonstrate good classroom engagement and participation. Continue regular monitoring to maintain positive trajectory.`;
//   }
// }

// function getAttendanceTrend(student) {
//   // Mock attendance data - in real app, this would come from backend
//   const attendance = student.attendance;
//   const presentCount = Math.round((attendance / 100) * 8);
  
//   return Array.from({ length: 8 }, (_, i) => ({
//     present: i < presentCount,
//     label: `D${i + 1}`,
//   }));
// }

// function getAcademicPerformance(student) {
//   // Mock academic scores based on risk level
//   const baseScore = student.riskLevel === "high" ? 45 : student.riskLevel === "medium" ? 65 : 85;
  
//   return [
//     { name: "Mathematics", score: baseScore + Math.floor(Math.random() * 15) },
//     { name: "Science", score: baseScore + Math.floor(Math.random() * 15) },
//     { name: "English", score: baseScore + Math.floor(Math.random() * 15) },
//     { name: "Social Studies", score: baseScore + Math.floor(Math.random() * 15) },
//   ];
// }

// function getSuggestedInterventions(student) {
//   const baseInterventions = [
//     {
//       icon: FaHome,
//       title: "Conduct Home Visit",
//       description: "Meet with family to understand home environment and discuss concerns.",
//       priority: student.riskLevel === "high" ? "High" : "Medium",
//     },
//     {
//       icon: FaPhone,
//       title: "Engage with Parents",
//       description: "Schedule a parent-teacher meeting to align on student support strategies.",
//       priority: student.riskLevel === "high" ? "High" : "Medium",
//     },
//   ];

//   if (student.riskLevel === "high") {
//     baseInterventions.push({
//       icon: FaBook,
//       title: "Provide Learning Support",
//       description: "Arrange extra tutoring sessions or peer mentoring for struggling subjects.",
//       priority: "High",
//     });
//   }

//   baseInterventions.push({
//     icon: FaBrain,
//     title: "Monitor Attendance Closely",
//     description: "Daily check-ins and follow-up on absences within 24 hours.",
//     priority: student.riskLevel === "high" ? "High" : "Low",
//   });

//   return baseInterventions;
// }


















// import { useParams, useNavigate } from "react-router-dom";
// import { students } from "../../data/students";
// import RiskBadge from "../../components/RiskBadge";
// import { FaArrowLeft } from "react-icons/fa";

// export default function StudentProfilePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const student = students.find((s) => s.id === parseInt(id));

//   if (!student) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-100">
//         <div className="text-center">
//           <h2 className="text-lg font-semibold text-slate-700 mb-2">
//             Student not found
//           </h2>
//           <button
//             onClick={() => navigate("/students")}
//             className="text-blue-600 hover:underline text-sm"
//           >
//             Back to students
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="px-6 py-6 bg-slate-100 min-h-screen">
//       <div className="max-w-5xl mx-auto space-y-6">

//         {/* Back */}
//         <button
//           onClick={() => navigate("/students")}
//           className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
//         >
//           <FaArrowLeft />
//           Back to students
//         </button>

//         {/* Header */}
//         <div className="bg-white border border-slate-200 rounded-md p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-semibold text-slate-900">
//                 {student.name}
//               </h1>
//               <p className="text-sm text-slate-600 mt-1">
//                 {student.class} • Attendance {student.attendance}%
//               </p>
//             </div>
//             <RiskBadge level={student.riskLevel} />
//           </div>
//         </div>

//         {/* Risk Explanation */}
//         <div className="bg-white border border-slate-200 rounded-md p-6">
//           <h2 className="text-lg font-semibold text-slate-900 mb-2">
//             Risk Analysis
//           </h2>
//           <p className="text-sm text-slate-700 leading-relaxed">
//             This student is currently classified as <strong>{student.riskLevel}</strong> risk
//             based on attendance trends and academic indicators. Continuous monitoring
//             and timely intervention are recommended.
//           </p>
//         </div>

//         {/* Academic Snapshot */}
//         <div className="bg-white border border-slate-200 rounded-md p-6">
//           <h2 className="text-lg font-semibold text-slate-900 mb-4">
//             Academic Overview
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
//             <div>
//               <p className="text-slate-500">Attendance</p>
//               <p className="font-semibold text-slate-900">
//                 {student.attendance}%
//               </p>
//             </div>
//             <div>
//               <p className="text-slate-500">Class</p>
//               <p className="font-semibold text-slate-900">
//                 {student.class}
//               </p>
//             </div>
//             <div>
//               <p className="text-slate-500">Risk Level</p>
//               <RiskBadge level={student.riskLevel} />
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }











import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentService } from "../../services/studentService";
import { riskService } from "../../services/riskService";
import { attendanceService } from "../../services/attendanceService";
import { marksService } from "../../services/marksService";
import { behaviourService, BEHAVIOUR_TYPES, BEHAVIOUR_LABELS } from "../../services/behaviourService";
import RiskBadge from "../../components/RiskBadge";
import {
  FaArrowLeft,
  FaDownload,
  FaUser,
  FaChartLine,
  FaLightbulb,
  FaExclamationTriangle,
  FaHome,
  FaPhone,
  FaBook,
  FaComments,
  FaSpinner,
  FaExclamationCircle,
  FaCheck,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();

  // State management
  const [student, setStudent] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data input form states
  const [activeDataTab, setActiveDataTab] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({ date: '', status: 'PRESENT', submitting: false, message: '' });
  const [marksForm, setMarksForm] = useState({ subject: '', score: '', date: '', submitting: false, message: '' });
  const [behaviourForm, setBehaviourForm] = useState({ selectedTypes: {}, date: '', submitting: false, message: '' });

  // Initialize behaviour checkboxes
  useEffect(() => {
    const initialChecked = {};
    Object.keys(BEHAVIOUR_TYPES).forEach(key => {
      initialChecked[BEHAVIOUR_TYPES[key]] = false;
    });
    setBehaviourForm(prev => ({ ...prev, selectedTypes: initialChecked }));
  }, []);

  // Helper function to refresh risk data
  const refreshRiskData = async () => {
    try {
      const updatedRisk = await riskService.getStudentRisk(id);
      setRiskData(updatedRisk);
    } catch (err) {
      console.error('Error refreshing risk data:', err);
    }
  };

  // Compute available subjects from teacher's assigned classes
  const availableSubjects = teacherClasses.length > 0 
    ? [...new Set(teacherClasses.flatMap((cls) => cls.subjects || []))].sort()
    : [];

  // Fetch student info and risk data
  useEffect(() => {
    const fetchStudentAndRisk = async () => {
      try {
        setLoading(true);
        // Fetch student info
        const studentData = await studentService.getStudentById(id);
        if (!studentData) {
          setError('Student not found or has been deleted.');
          setLoading(false);
          return;
        }
        setStudent(studentData);

        // Fetch teacher's classes with subjects
        const classes = await marksService.getTeacherClassesWithSubjects();
        setTeacherClasses(classes);

        // Fetch risk data
        const risk = await riskService.getStudentRisk(id);
        setRiskData(risk);
        setError(null);
      } catch (err) {
        if (err.message && err.message.includes('Route not found')) {
          setError('Student not found or has been deleted.');
        } else {
          setError('Failed to load student data. Please try again.');
        }
        setStudent(null);
        setRiskData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentAndRisk();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading student profile...</p>
        </div>
      </div>
    );
  }

  // Student not found or error state
  if (!student || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationCircle className="mx-auto text-4xl text-red-500 mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get risk level and determine interventions
  const getSuggestedInterventions = () => {
    const riskLevel = riskData?.riskLevel?.toUpperCase() || 'LOW';

    if (riskLevel === 'HIGH') {
      return [
        {
          icon: FaHome,
          title: 'Home Visit',
          description: 'Conduct immediate home visit to understand situation',
          priority: 'High',
        },
        {
          icon: FaPhone,
          title: 'Parent Meeting',
          description: 'Schedule urgent meeting with parents/guardians',
          priority: 'High',
        },
        {
          icon: FaBook,
          title: 'Extra Academic Support',
          description: 'Arrange tutoring or remedial classes',
          priority: 'High',
        },
        {
          icon: FaComments,
          title: 'Counselor Involvement',
          description: 'Refer to school counselor for psychological support',
          priority: 'High',
        },
      ];
    } else if (riskLevel === 'MEDIUM') {
      return [
        {
          icon: FaPhone,
          title: 'Parent Meeting',
          description: 'Discuss concerns and plan support measures',
          priority: 'Medium',
        },
        {
          icon: FaBook,
          title: 'Extra Academic Support',
          description: 'Offer additional help in weak subjects',
          priority: 'Medium',
        },
        {
          icon: FaCalendarCheck,
          title: 'Monitor Attendance',
          description: 'Track daily attendance and follow up on absences',
          priority: 'Medium',
        },
      ];
    } else {
      return [
        {
          icon: FaCalendarCheck,
          title: 'Continue Monitoring',
          description: 'Regular monitoring to maintain positive trajectory',
          priority: 'Low',
        },
      ];
    }
  };

  const suggestedInterventions = getSuggestedInterventions();

  // Handle attendance submission
  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (!attendanceForm.date) {
      setAttendanceForm(prev => ({ ...prev, message: 'Please select a date' }));
      return;
    }

    try {
      setAttendanceForm(prev => ({ ...prev, submitting: true, message: '' }));
      await attendanceService.recordAttendance(id, student.classId, attendanceForm.date, attendanceForm.status);
      
      setAttendanceForm({ date: '', status: 'PRESENT', submitting: false, message: 'Attendance recorded successfully!' });
      await refreshRiskData();
      
      setTimeout(() => {
        setAttendanceForm(prev => ({ ...prev, message: '' }));
        setActiveDataTab(null);
      }, 2000);
    } catch (err) {
      console.error('Error recording attendance:', err);
      setAttendanceForm(prev => ({ ...prev, submitting: false, message: 'Failed to record attendance. Please try again.' }));
    }
  };

  // Handle marks submission
  const handleMarksSubmit = async (e) => {
    e.preventDefault();
    if (!marksForm.subject || marksForm.score === '' || !marksForm.date) {
      setMarksForm(prev => ({ ...prev, message: 'Please fill all fields' }));
      return;
    }

    const score = parseInt(marksForm.score);
    if (isNaN(score) || score < 0 || score > 100) {
      setMarksForm(prev => ({ ...prev, message: 'Score must be between 0 and 100' }));
      return;
    }

    try {
      setMarksForm(prev => ({ ...prev, submitting: true, message: '' }));
      await marksService.recordMarks(id, student.classId, marksForm.subject, score, marksForm.date);
      
      setMarksForm({ subject: '', score: '', date: '', submitting: false, message: 'Marks recorded successfully!' });
      await refreshRiskData();
      
      setTimeout(() => {
        setMarksForm(prev => ({ ...prev, message: '' }));
        setActiveDataTab(null);
      }, 2000);
    } catch (err) {
      console.error('Error recording marks:', err);
      setMarksForm(prev => ({ ...prev, submitting: false, message: 'Failed to record marks. Please try again.' }));
    }
  };

  // Handle behaviour submission
  const handleBehaviourSubmit = async (e) => {
    e.preventDefault();
    const selectedTypes = Object.keys(behaviourForm.selectedTypes).filter(key => behaviourForm.selectedTypes[key]);
    
    if (selectedTypes.length === 0) {
      setBehaviourForm(prev => ({ ...prev, message: 'Please select at least one behaviour type' }));
      return;
    }

    if (!behaviourForm.date) {
      setBehaviourForm(prev => ({ ...prev, message: 'Please select a date' }));
      return;
    }

    try {
      setBehaviourForm(prev => ({ ...prev, submitting: true, message: '' }));
      
      // Record each selected behaviour type
      for (const type of selectedTypes) {
        await behaviourService.recordBehaviour(id, student.classId, type, behaviourForm.date);
      }
      
      setBehaviourForm(prev => ({ ...prev, selectedTypes: {}, date: '', submitting: false, message: `${selectedTypes.length} behaviour event(s) recorded successfully!` }));
      
      // Reinitialize checkboxes
      const initialChecked = {};
      Object.keys(BEHAVIOUR_TYPES).forEach(key => {
        initialChecked[BEHAVIOUR_TYPES[key]] = false;
      });
      setBehaviourForm(prev => ({ ...prev, selectedTypes: initialChecked }));
      
      await refreshRiskData();
      
      setTimeout(() => {
        setBehaviourForm(prev => ({ ...prev, message: '' }));
        setActiveDataTab(null);
      }, 2000);
    } catch (err) {
      console.error('Error recording behaviour:', err);
      setBehaviourForm(prev => ({ ...prev, submitting: false, message: 'Failed to record behaviour. Please try again.' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* 1️⃣ Page Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/students")}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
                       font-medium mb-4 transition-colors"
          >
            <FaArrowLeft />
            {t('teacher.back_to_students')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('teacher.student_profile_title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('teacher.student_profile_subtitle')}
          </p>
        </div>

        {/* 2️⃣ Student Basic Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-teal-500 rounded-full
                              flex items-center justify-center text-white text-2xl font-bold">
                {student.name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {student.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {student.classId}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start sm:items-end">
              <RiskBadge level={riskData?.riskLevel?.toLowerCase()} />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Status: <span className="font-semibold text-gray-900 dark:text-white">Active</span>
              </div>
            </div>

        {/* 3️⃣ Risk Summary Card (MOST IMPORTANT) */}
        {riskData && (
          <div
            className={`rounded-lg shadow-md border-l-4 p-6 mb-6 ${
              riskData.riskLevel === 'HIGH'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                : riskData.riskLevel === 'MEDIUM'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                : 'bg-green-50 dark:bg-green-900/20 border-green-500'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <FaExclamationTriangle
                className={`text-2xl mt-1 shrink-0 ${
                  riskData.riskLevel === 'HIGH'
                    ? 'text-red-600 dark:text-red-400'
                    : riskData.riskLevel === 'MEDIUM'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-green-600 dark:text-green-400'
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('teacher.risk_analysis_title')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Score:
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {riskData.score}
                    </span>
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3">
                  {riskData.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4️⃣ Risk Factors Breakdown (EXPLAINABILITY) */}
        {riskData?.factors && riskData.factors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaLightbulb className="text-yellow-600 dark:text-yellow-400 text-xl" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Risk Factors (Explainable AI)
              </h3>
            </div>
            <div className="space-y-3">
              {riskData.factors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {factor.name}
                    </h4>
                    {factor.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {factor.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      +{factor.weight}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      points
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <span className="font-semibold">How It Works:</span> Each factor contributes points to the risk score. 
                The sum of all factors determines the final risk level:
                <br />
                <strong>LOW</strong> = Score &lt; 40 | <strong>MEDIUM</strong> = 40-79 | <strong>HIGH</strong> = ≥ 80
              </p>
            </div>
          </div>
        )}

        {/* 5️⃣ Metrics Breakdown */}
        {riskData?.metrics && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-teal-600 dark:text-teal-400 text-xl" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Student Metrics
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Attendance Rate
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {riskData.metrics.attendance_percentage?.toFixed(1) || 'N/A'}%
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Consecutive Absences
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {riskData.metrics.consecutive_absences || 0}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Average Marks
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {riskData.metrics.average_marks?.toFixed(1) || 'N/A'}
                </div>

              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Behaviour Issues
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {riskData.metrics.behaviour_issue_count || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6️⃣ Suggested Interventions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaLightbulb className="text-yellow-600 dark:text-yellow-400 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('teacher.suggested_interventions_title')}
            </h3>
          </div>
          <div className="space-y-3">
            {suggestedInterventions.map((intervention, index) => {
              const Icon = intervention.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                >
                  <Icon className="text-blue-600 dark:text-blue-400 text-xl mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {intervention.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {intervention.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                      intervention.priority === 'High'
                        ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200'
                        : intervention.priority === 'Medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200'
                        : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200'
                    }`}
                  >
                    {t(`teacher.priority_${intervention.priority.toLowerCase()}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7️⃣ Data Entry Forms */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('teacher.quick_actions')}
          </h3>
          
          {/* Form Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveDataTab(activeDataTab === 'attendance' ? null : 'attendance')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeDataTab === 'attendance'
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <FaCalendarCheck className="inline mr-2" />
              {t('teacher.add_attendance')}
            </button>
            <button
              onClick={() => setActiveDataTab(activeDataTab === 'marks' ? null : 'marks')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeDataTab === 'marks'
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <FaBook className="inline mr-2" />
              {t('teacher.add_academic_score')}
            </button>
            <button
              onClick={() => setActiveDataTab(activeDataTab === 'behaviour' ? null : 'behaviour')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeDataTab === 'behaviour'
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <FaComments className="inline mr-2" />
              {t('teacher.add_behaviour')}
            </button>
          </div>

          {/* Attendance Form */}
          {activeDataTab === 'attendance' && (
            <form onSubmit={handleAttendanceSubmit} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LEAVE">On Leave</option>
                </select>
              </div>
              {attendanceForm.message && (
                <div className={`p-3 rounded-lg text-sm ${
                  attendanceForm.message.includes('success')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {attendanceForm.message}
                </div>
              )}
              <button
                type="submit"
                disabled={attendanceForm.submitting}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                         flex items-center justify-center gap-2"
              >
                {attendanceForm.submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Record Attendance
                  </>
                )}
              </button>
            </form>
          )}

          {/* Marks Form */}
          {activeDataTab === 'marks' && (
            <form onSubmit={handleMarksSubmit} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                {availableSubjects.length > 0 ? (
                  <select
                    value={marksForm.subject}
                    onChange={(e) => setMarksForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
                    <FaExclamationCircle className="inline mr-2" />
                    No subjects assigned. Contact admin to assign classes with subjects.
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marksForm.score}
                  onChange={(e) => setMarksForm(prev => ({ ...prev, score: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter marks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={marksForm.date}
                  onChange={(e) => setMarksForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {marksForm.message && (
                <div className={`p-3 rounded-lg text-sm ${
                  marksForm.message.includes('success')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {marksForm.message}
                </div>
              )}
              <button
                type="submit"
                disabled={marksForm.submitting || availableSubjects.length === 0}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                         flex items-center justify-center gap-2"
              >
                {marksForm.submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Record Marks
                  </>
                )}
              </button>
            </form>
          )}

          {/* Behaviour Form */}
          {activeDataTab === 'behaviour' && (
            <form onSubmit={handleBehaviourSubmit} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Behaviour Type(s)
                </label>
                <div className="space-y-2">
                  {Object.keys(BEHAVIOUR_TYPES).map((key) => (
                    <label key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={behaviourForm.selectedTypes[BEHAVIOUR_TYPES[key]] || false}
                        onChange={(e) => setBehaviourForm(prev => ({
                          ...prev,
                          selectedTypes: {
                            ...prev.selectedTypes,
                            [BEHAVIOUR_TYPES[key]]: e.target.checked
                          }
                        }))}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {BEHAVIOUR_LABELS[BEHAVIOUR_TYPES[key]] || BEHAVIOUR_TYPES[key]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={behaviourForm.date}
                  onChange={(e) => setBehaviourForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {behaviourForm.message && (
                <div className={`p-3 rounded-lg text-sm ${
                  behaviourForm.message.includes('success')
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {behaviourForm.message}
                </div>
              )}
              <button
                type="submit"
                disabled={behaviourForm.submitting}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                         flex items-center justify-center gap-2"
              >
                {behaviourForm.submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Record Behaviour
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}

