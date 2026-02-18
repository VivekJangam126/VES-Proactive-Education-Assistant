import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaBars,
  FaBook,
  FaCalendarCheck,
  FaChalkboardTeacher,
  FaCheck,
  FaDownload,
  FaExclamationTriangle,
  FaEye,
  FaFileImport,
  FaList,
  FaSpinner,
  FaUserPlus,
  FaExclamationCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useTeacher } from "../../context/TeacherContext";
import RiskBadge from "../../components/RiskBadge";
import { classService } from "../../services/classService";
import { studentService } from "../../services/studentService";

export default function StudentListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();
  const { selectedClass, setSelectedClass } = useTeacher();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("list");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMessage, setFormMessage] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [importStatus, setImportStatus] = useState("");

  const [formData, setFormData] = useState({ name: "", classId: "" });
  const [riskFilter, setRiskFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");

  const tabs = [
    { id: "list", label: t("students.tab_list"), icon: FaList },
    { id: "add", label: t("students.tab_add"), icon: FaUserPlus },
    { id: "import", label: t("students.tab_import"), icon: FaFileImport },
    { id: "attendance", label: t("students.tab_attendance"), icon: FaCalendarCheck },
    { id: "marks", label: t("students.tab_marks"), icon: FaBook },
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const classData = await classService.getClasses();
        setClasses(classData);

        if (classData?.length > 0) {
          // Use _id (MongoDB ObjectId) instead of id
          const initial = classData[0]._id;
          setSelectedClassId(initial);
          if (!selectedClass) {
            setSelectedClass(initial);
          }
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const classId = selectedClassId || selectedClass;
    if (!classId) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentData = await studentService.getStudents(classId);
        setStudents(studentData || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClassId, selectedClass, token]);

  const uniqueGrades = useMemo(() => {
    const grades = students.map((s) => s.class || s.grade).filter(Boolean);
    return Array.from(new Set(grades.map((g) => g.toString())));
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesClass = !selectedClassId || student.classId === selectedClassId || student.class === selectedClassId;
      const matchesRisk = riskFilter === "all" || student.riskLevel === riskFilter;
      const gradeValue = (student.grade ?? student.class)?.toString();
      const matchesGrade = gradeFilter === "all" || gradeValue === gradeFilter;
      return matchesClass && matchesRisk && matchesGrade;
    });
  }, [students, selectedClassId, riskFilter, gradeFilter]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !(formData.classId || selectedClassId)) {
      setFormMessage("Please fill all fields");
      return;
    }
  });

    try {
      await studentService.createStudent({
        name: formData.name.trim(),
        classId: formData.classId || selectedClassId,
      });

      setFormMessage("Student added successfully!");
      setFormData({ name: "", classId: selectedClassId || "" });

      const updatedStudents = await studentService.getStudents(selectedClassId || selectedClass);
      setStudents(updatedStudents || []);

      setTimeout(() => {
        setFormMessage("");
        setActiveTab("list");
      }, 2000);
    } catch (err) {
      console.error("Error adding student:", err);
      setFormMessage("Failed to add student. Please try again.");
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const classId = selectedClassId || selectedClass;
    if (!classId) {
      setImportStatus("error");
      setImportMessage("Please select a class before importing.");
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("classId", classId);

      const result = await studentService.importStudentsCSV(formDataObj);

      setImportStatus("success");
      setImportMessage(
        `Successfully imported ${result.inserted} students. ${result.skipped > 0 ? `Skipped ${result.skipped} rows.` : ""} ${
          result.errors?.length > 0 ? `Errors: ${result.errors.length}` : ""
        }`
      );

      const updatedStudents = await studentService.getStudents(classId);
      setStudents(updatedStudents || []);

      setTimeout(() => {
        setImportStatus("");
        setImportMessage("");
        setActiveTab("list");
      }, 3000);
    } catch (err) {
      console.error("Error importing students:", err);
      setImportStatus("error");
      setImportMessage("Failed to import students. Please check the file format.");
    }
  };

  const downloadTemplate = () => {
    const template = "Name,ClassId\nJohn Doe,class123\nJane Smith,class123\nRaj Kumar,class123";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `students_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getRowBgColor = (riskLevel) => {
    if (riskLevel === "high") return "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30";
    if (riskLevel === "medium")
      return "bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30";
    return "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700";
  };

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("students.page_title_management")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{t("students.page_subtitle_management")}</p>
        </div>

        {classes.length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <FaChalkboardTeacher className="text-blue-600 dark:text-blue-400 text-xl" />
              <div className="flex-1">
                <label
                  htmlFor="classSelect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t("students.select_class")}
                </label>
                <select
                  id="classSelect"
                  value={selectedClassId || ""}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedClass(e.target.value);
                  }}
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a class --</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedClassId && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t("students.showing_from")} {" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {classes.find((c) => c._id === selectedClassId)?.name}
                  </span>
                </div>
              )}
            </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <FaExclamationCircle className="text-red-600 dark:text-red-400 text-lg mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Error</h3>
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          <div className="w-full md:w-48 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-full mb-4 flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span className="font-medium">{t("students.tabs")}</span>
              <FaBars />
            </button>

            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${
                !mobileMenuOpen ? "hidden md:block" : ""
              }`}
            >
              <option value="all">All Risks</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            {/* Filter by Class */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

          <div className="flex-1 min-w-0">
            {activeTab === "list" && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3 mx-auto" />
                      <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("students.risk_level")}
                          </label>
                          <select
                            value={riskFilter}
                            onChange={(e) => setRiskFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">{t("students.filter_all")}</option>
                            <option value="high">{t("students.filter_high")}</option>
                            <option value="medium">{t("students.filter_medium")}</option>
                            <option value="low">{t("students.filter_low")}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("students.class")}
                          </label>
                          <select
                            value={gradeFilter}
                            onChange={(e) => setGradeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">{t("students.all_grades")}</option>
                            {uniqueGrades.map((grade) => (
                              <option key={grade} value={grade}>
                                {t("students.class")} {grade}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {filteredStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                                  {t("students.student_name")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                                  {t("students.class")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                                  {t("students.attendance")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                                  {t("students.risk_status")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                                  {t("students.action")}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {filteredStudents.map((student, idx) => (
                                <tr key={student._id || student.id || idx} className={getRowBgColor(student.riskLevel)}>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {student.name}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{student.class}</td>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {student.attendance}%
                                  </td>
                                  <td className="px-6 py-4 text-sm">
                                    <RiskBadge level={student.riskLevel} />
                                  </td>
                                  <td className="px-6 py-4 text-sm">
                                    <button
                                      onClick={() => navigate(`/students/${student._id || student.id}`)}
                                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                      <FaEye className="text-xs" />
                                      {t("students.view")}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 dark:text-gray-400">{t("students.no_students")}</p>
                        </div>
                      )}
                    </div>

                    <div className="md:hidden space-y-3">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, idx) => (
                          <div
                            key={student._id || student.id || idx}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                              <RiskBadge level={student.riskLevel} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {student.class} • Attendance: {student.attendance}%
                            </p>
                            <button
                              onClick={() => navigate(`/students/${student._id || student.id}`)}
                              className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              {t("students.view_profile")}
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-400">{t("students.no_students")}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "add" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("students.add_new_student")}</h2>
                <form onSubmit={handleAddStudent} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("students.student_name")} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter student name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Class *
                    </label>
                    <select
                      value={formData.classId || selectedClassId || ""}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a class</option>
                      {classes.map((cls, idx) => (
                        <option key={cls._id || cls.id || idx} value={cls._id || cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formMessage && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        formMessage.includes("successfully")
                          ? "bg-green-50 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-700"
                          : "bg-red-50 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700"
                      }`}
                    >
                      {formMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Student
                  </button>
                </form>
              </div>
            )}

            {activeTab === "import" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Import Students</h2>
                <div className="space-y-4 max-w-2xl">
                  {selectedClassId && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        <span className="font-semibold">Note:</span> Imported students will be added to {" "}
                        <span className="font-bold">
                          {classes.find((c) => c.id === selectedClassId)?.name}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Instructions:</h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-100 space-y-1 list-disc list-inside">
                      <li>Column order does not matter</li>
                      <li>Headers must include "Name" and "Class/Grade"</li>
                      <li>Valid grades: 1-12</li>
                      <li>Invalid rows will be skipped with a summary</li>
                      <li>Supports .csv and .xlsx files</li>
                    </ul>
                  </div>

                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FaDownload />
                    Download Sample Template
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Choose File
                    </label>
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileImport}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {importMessage && (
                    <div
                      className={`p-4 rounded-lg flex items-start gap-3 ${
                        importStatus === "success"
                          ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
                          : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700"
                      }`}
                    >
                      {importStatus === "success" ? (
                        <FaCheck className="text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <FaExclamationTriangle className="text-red-600 mt-0.5 shrink-0" />
                      )}
                      <p
                        className={`text-sm ${
                          importStatus === "success"
                            ? "text-green-700 dark:text-green-200"
                            : "text-red-700 dark:text-red-200"
                        }`}
                      >
                        {importMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Attendance Upload</h2>
                <div className="text-center py-12">
                  <FaCalendarCheck className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">This feature is coming soon.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    You'll be able to upload attendance records in bulk.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "marks" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Marks Upload</h2>
                <div className="text-center py-12">
                  <FaBook className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">This feature is coming soon.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    You'll be able to upload academic marks in bulk.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
