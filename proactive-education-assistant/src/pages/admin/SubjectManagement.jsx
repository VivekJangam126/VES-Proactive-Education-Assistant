import { useState } from 'react';
import { SubjectTable } from '../../components/admin/subjects/SubjectTable';
import { AddEditSubjectModal } from '../../components/admin/subjects/AddEditSubjectModal';
import { useAdmin } from '../../context/AdminContext';
import { FaChevronDown, FaBook, FaUsers, FaCalendar } from 'react-icons/fa';

export const SubjectManagement = () => {
  const { classes, teachers, subjects, loading, addSubject, updateSubject, deleteSubject } = useAdmin();
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Set initial class on load
  if (!selectedClass && classes.length > 0) {
    setSelectedClass(classes[0].id);
  }

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
  };

  const handleAddSubject = () => {
    setSelectedSubject(null);
    setModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setModalOpen(true);
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      deleteSubject(selectedClass, subjectId);
    }
  };

  const handleCloseModal = () => {
    setSelectedSubject(null);
    setModalOpen(false);
  };

  const handleSuccess = (formData) => {
    if (selectedSubject) {
      updateSubject(selectedClass, selectedSubject.id, formData);
    } else {
      addSubject(selectedClass, formData);
    }
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">
            Loading subjects...
          </p>
        </div>
      </div>
    );
  }

  const selectedClassData = classes.find((c) => c.id === selectedClass);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Subject Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage subjects and assign teachers to each class
          </p>
        </div>

        {/* Class Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Class
          </label>
          <div className="relative">
            <select
              value={selectedClass || ''}
              onChange={(e) => handleClassChange(Number(e.target.value))}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.attendanceMode}) - {cls.studentCount} students
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Class Info Card */}
        {selectedClassData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaBook className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase mb-1">
                    Class
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedClassData.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaCalendar className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase mb-1">
                    Attendance Mode
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedClassData.attendanceMode}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaUsers className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase mb-1">
                    Students
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedClassData.studentCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subjects Table */}
        <SubjectTable
          subjects={selectedClass ? (subjects[selectedClass] || []) : []}
          onEdit={handleEditSubject}
          onDelete={handleDeleteSubject}
          onAdd={handleAddSubject}
        />

        {/* Add/Edit Subject Modal */}
        {modalOpen && (
          <AddEditSubjectModal
            subject={selectedSubject}
            teachers={teachers}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default SubjectManagement;
