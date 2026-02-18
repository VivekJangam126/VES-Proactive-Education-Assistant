import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import TeacherTable from '../../components/admin/teachers/TeacherTable';
import TeacherApprovalModal from '../../components/admin/teachers/TeacherApprovalModal';
import AssignClassModal from '../../components/admin/teachers/AssignClassModal';

function TeacherManagement() {
  const { teachers, classes, loading, refreshTeachers } = useAdmin();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalType, setModalType] = useState(null); // 'approval' or 'assign'

  const handleApproval = (teacher) => {
    setSelectedTeacher(teacher);
    setModalType('approval');
  };

  const handleAssignClasses = (teacher) => {
    setSelectedTeacher(teacher);
    setModalType('assign');
  };

  const handleCloseModal = () => {
    setSelectedTeacher(null);
    setModalType(null);
  };

  const handleRefresh = () => {
    refreshTeachers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-1">Approve teachers and assign classes</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Teachers</p>
          <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Pending Approvals</p>
          <p className="text-2xl font-bold text-yellow-600">
            {teachers.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Approved Teachers</p>
          <p className="text-2xl font-bold text-green-600">
            {teachers.filter(t => t.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Teacher Table */}
      <TeacherTable
        teachers={teachers}
        onApprove={handleApproval}
        onAssignClasses={handleAssignClasses}
      />

      {/* Modals */}
      {modalType === 'approval' && selectedTeacher && (
        <TeacherApprovalModal
          teacher={selectedTeacher}
          classes={classes}
          onClose={handleCloseModal}
          onSuccess={handleRefresh}
        />
      )}

      {modalType === 'assign' && selectedTeacher && (
        <AssignClassModal
          teacher={selectedTeacher}
          classes={classes}
          onClose={handleCloseModal}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}

export default TeacherManagement;
