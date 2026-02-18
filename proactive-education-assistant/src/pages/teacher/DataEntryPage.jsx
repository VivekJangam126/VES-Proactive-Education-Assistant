import { useState } from "react";
import { FaCalendarCheck, FaBook, FaUserCheck, FaUpload, FaDownload, FaCheck, FaTimes } from "react-icons/fa";
import { students as mockStudents } from "../../data/students";

export default function DataEntryPage() {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Data Entry</h1>
          <p className="text-sm text-gray-500 mt-1">Record attendance, scores, and behaviour</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "attendance"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaCalendarCheck />
              Attendance
            </button>
            <button
              onClick={() => setActiveTab("scores")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "scores"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaBook />
              Scores
            </button>
            <button
              onClick={() => setActiveTab("behaviour")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "behaviour"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaUserCheck />
              Behaviour
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "attendance" && <AttendanceTab />}
            {activeTab === "scores" && <ScoresTab />}
            {activeTab === "behaviour" && <BehaviourTab />}
          </div>
        </div>

      </div>
    </div>
  );
}

// Attendance Tab Component
function AttendanceTab() {
  const [mode, setMode] = useState("manual");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);

  const classes = ["Class 6-A", "Class 7-B", "Class 8-A", "Class 9-C"];
  const students = mockStudents.filter(s => !selectedClass || s.class === selectedClass);

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleToggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present"
    }));
  };

  const handleSubmit = () => {
    console.log("Attendance submitted:", { selectedClass, selectedDate, attendance });
    alert("Attendance saved successfully!");
  };

  const downloadTemplate = () => {
    const template = "Student Name,Enrollment No,Date,Status\nJohn Doe,2024001,2024-02-18,Present\nJane Smith,2024002,2024-02-18,Absent";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance_template.csv";
    link.click();
  };

  return (
    <div>
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "manual"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setMode("bulk")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "bulk"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Bulk Upload
        </button>
      </div>

      {mode === "manual" ? (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {selectedClass && (
            <>
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleMarkAll("present")}
                  className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll("absent")}
                  className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                >
                  Mark All Absent
                </button>
              </div>

              {/* Students List */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b border-gray-200 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Student Name</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Enrollment No</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.id}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "present" }))}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  attendance[student.id] === "present"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                <FaCheck className="inline mr-1" />
                                Present
                              </button>
                              <button
                                onClick={() => setAttendance(prev => ({ ...prev, [student.id]: "absent" }))}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  attendance[student.id] === "absent"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                <FaTimes className="inline mr-1" />
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Attendance
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* Download Template */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Download Template</h3>
                <p className="text-xs text-gray-600">Download the CSV template for bulk attendance upload</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                <FaDownload className="text-xs" />
                Download
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">Upload Attendance Data</h3>
            <p className="text-xs text-gray-500 mb-4">CSV or Excel file (Max 5MB)</p>
            
            <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">
              <FaUpload className="text-xs" />
              Choose File
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setUploadedFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            {uploadedFile && (
              <div className="mt-4 text-sm text-gray-600">
                Selected: <span className="font-medium">{uploadedFile.name}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Scores Tab Component
function ScoresTab() {
  const [mode, setMode] = useState("manual");
  const [formData, setFormData] = useState({
    student: "",
    class: "",
    subject: "",
    examType: "",
    examDate: new Date().toISOString().split('T')[0],
    maxMarks: "",
    obtainedMarks: "",
    grade: "",
    remarks: ""
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const classes = ["Class 6-A", "Class 7-B", "Class 8-A", "Class 9-C"];
  const subjects = ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Computer Science"];
  const examTypes = ["Unit Test", "Mid Term", "Final Exam", "Assignment", "Quiz", "Project"];
  const students = mockStudents;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePercentage = () => {
    if (formData.obtainedMarks && formData.maxMarks) {
      return ((formData.obtainedMarks / formData.maxMarks) * 100).toFixed(2);
    }
    return "-";
  };

  const calculateGrade = () => {
    const percentage = parseFloat(calculatePercentage());
    if (isNaN(percentage)) return "-";
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.student || !formData.class || !formData.subject || !formData.examType || !formData.maxMarks || !formData.obtainedMarks) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    console.log("Score submitted:", formData);
    setMessage({ type: "success", text: "Score added successfully!" });
    
    // Reset form
    setTimeout(() => {
      setFormData({
        student: "",
        class: "",
        subject: "",
        examType: "",
        examDate: new Date().toISOString().split('T')[0],
        maxMarks: "",
        obtainedMarks: "",
        grade: "",
        remarks: ""
      });
      setMessage({ type: "", text: "" });
    }, 2000);
  };

  const downloadTemplate = () => {
    const template = "Student Name,Enrollment No,Class,Subject,Exam Type,Exam Date,Max Marks,Obtained Marks,Grade,Remarks\nJohn Doe,2024001,Class 6-A,Mathematics,Unit Test,2024-02-18,100,85,A,Good performance\nJane Smith,2024002,Class 7-B,Science,Mid Term,2024-02-18,100,92,A+,Excellent";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scores_template.csv";
    link.click();
  };

  return (
    <div>
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "manual"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setMode("bulk")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "bulk"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Bulk Upload
        </button>
      </div>

      {mode === "manual" ? (
        <form onSubmit={handleSubmit} className="max-w-3xl">
          {/* Message */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Student Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student <span className="text-red-500">*</span>
              </label>
              <select
                name="student"
                value={formData.student}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.class}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Exam Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type <span className="text-red-500">*</span>
              </label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose exam type</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Exam Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Date
              </label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Maximum Marks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleInputChange}
                placeholder="e.g., 100"
                min="0"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Obtained Marks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks Obtained <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="obtainedMarks"
                value={formData.obtainedMarks}
                onChange={handleInputChange}
                placeholder="e.g., 85"
                min="0"
                max={formData.maxMarks || undefined}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Percentage (Auto-calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentage
              </label>
              <input
                type="text"
                value={calculatePercentage() + "%"}
                readOnly
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* Grade (Auto-calculated) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <input
                type="text"
                value={calculateGrade()}
                readOnly
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* Remarks - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows="2"
                placeholder="Optional remarks about performance..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add Score
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Download Template */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Download Template</h3>
                <p className="text-xs text-gray-600">Download the CSV template for bulk scores upload</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                <FaDownload className="text-xs" />
                Download
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">Upload Scores Data</h3>
            <p className="text-xs text-gray-500 mb-4">CSV or Excel file (Max 5MB)</p>
            
            <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">
              <FaUpload className="text-xs" />
              Choose File
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setUploadedFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            {uploadedFile && (
              <div className="mt-4 text-sm text-gray-600">
                Selected: <span className="font-medium">{uploadedFile.name}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Behaviour Tab Component
function BehaviourTab() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [severity, setSeverity] = useState("medium");
  const [notes, setNotes] = useState("");

  const students = mockStudents;
  const behaviourTags = [
    "Low participation",
    "Frequent absence",
    "Disruptive",
    "Silent withdrawal",
    "Good improvement",
    "Excellent behaviour",
    "Needs attention",
    "Aggressive",
    "Helpful",
    "Leadership"
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    console.log("Behaviour submitted:", { selectedStudent, selectedTags, severity, notes });
    alert("Behaviour observation saved successfully!");
    // Reset form
    setSelectedStudent("");
    setSelectedTags([]);
    setSeverity("medium");
    setNotes("");
  };

  return (
    <div className="max-w-3xl">
      {/* Student Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name} - {student.class}
            </option>
          ))}
        </select>
      </div>

      {/* Behaviour Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {behaviourTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Severity */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Severity
        </label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          placeholder="Describe the observation..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!selectedStudent}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Observation
        </button>
      </div>
    </div>
  );
}
