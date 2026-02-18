import { useState } from "react";
import { FaUser, FaUpload, FaDownload, FaPlus } from "react-icons/fa";

export default function AddStudentPage() {
  const [activeTab, setActiveTab] = useState("single");
  const [formData, setFormData] = useState({
    name: "",
    enrollNo: "",
    class: "",
    dob: "",
    gender: "",
    contact: "",
    email: "",
    classTeacher: "",
    school: "",
    address: "",
    parentContact: "",
    parentEmail: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
  const teachers = ["Mr. John Doe", "Ms. Jane Smith", "Mr. Raj Kumar", "Ms. Priya Patel"];
  const schools = ["Main Campus", "North Branch", "South Branch"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.enrollNo || !formData.class) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    // Here you would send data to backend
    console.log("Form submitted:", formData);
    setMessage({ type: "success", text: "Student added successfully!" });
    
    // Reset form
    setTimeout(() => {
      setFormData({
        name: "",
        enrollNo: "",
        class: "",
        dob: "",
        gender: "",
        contact: "",
        email: "",
        classTeacher: "",
        school: "",
        address: "",
        parentContact: "",
        parentEmail: "",
      });
      setMessage({ type: "", text: "" });
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setMessage({ type: "success", text: `File "${file.name}" uploaded successfully!` });
      
      // Here you would process the file
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }
  };

  const downloadTemplate = () => {
    const template = "Name,Enrollment No,Class,DOB,Gender,Contact,Email,Class Teacher,School,Address,Parent Contact,Parent Email\nJohn Doe,2024001,Class 6,2010-01-15,Male,9876543210,john@example.com,Mr. John Doe,Main Campus,123 Street,9876543211,parent@example.com";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student_template.csv";
    link.click();
  };

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Add Student</h1>
          <p className="text-sm text-gray-500 mt-1">Add students individually or upload in bulk</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("single")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "single"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaUser className="inline mr-2" />
              Single Student
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "bulk"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaUpload className="inline mr-2" />
              Bulk Upload
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Single Student Form */}
          {activeTab === "single" && (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student name"
                    required
                  />
                </div>

                {/* Enrollment No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enrollment No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="enrollNo"
                    value={formData.enrollNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2024001"
                    required
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit number"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="student@example.com"
                  />
                </div>

                {/* Class Teacher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Teacher
                  </label>
                  <select
                    name="classTeacher"
                    value={formData.classTeacher}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
                    ))}
                  </select>
                </div>

                {/* School */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School
                  </label>
                  <select
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select School</option>
                    {schools.map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                </div>

                {/* Parent Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Contact
                  </label>
                  <input
                    type="tel"
                    name="parentContact"
                    value={formData.parentContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit number"
                  />
                </div>

                {/* Parent Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Email
                  </label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="parent@example.com"
                  />
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="text-xs" />
                  Add Student
                </button>
              </div>
            </form>
          )}

          {/* Bulk Upload */}
          {activeTab === "bulk" && (
            <div className="p-6">
              
              {/* Download Template */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Download Template</h3>
                    <p className="text-xs text-gray-600">
                      Download the Excel template and fill in student details
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <FaDownload className="text-xs" />
                    Download
                  </button>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Upload Student Data
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  CSV or Excel file (Max 5MB)
                </p>
                
                <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  <FaUpload className="text-xs" />
                  Choose File
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadedFile && (
                  <div className="mt-4 text-sm text-gray-600">
                    Selected: <span className="font-medium">{uploadedFile.name}</span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Download the template file</li>
                  <li>• Fill in all required fields (Name, Enrollment No, Class)</li>
                  <li>• Save the file in CSV or Excel format</li>
                  <li>• Upload the completed file</li>
                  <li>• Review and confirm the imported data</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
