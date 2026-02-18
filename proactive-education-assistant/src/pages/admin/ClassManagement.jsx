import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import ClassTable from '../../components/admin/classes/ClassTable';
import AddEditClassModal from '../../components/admin/classes/AddEditClassModal';
import { FaPlus, FaSchool, FaCheckCircle, FaUsers } from 'react-icons/fa';

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    const result = await adminService.getClasses();
    if (result.success) {
      setClasses(result.data);
    }
    setLoading(false);
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setModalOpen(true);
  };

  const handleEditClass = (classData) => {
    setSelectedClass(classData);
    setModalOpen(true);
  };

  const handleDeactivate = async (classId) => {
    if (window.confirm('Are you sure you want to deactivate this class?')) {
      const result = await adminService.deactivateClass(classId);
      if (result.success) {
        loadClasses();
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
    setModalOpen(false);
  };

  const handleSuccess = () => {
    loadClasses();
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Classes',
      value: classes.length,
      icon: FaSchool,
      color: 'blue'
    },
    {
      label: 'Active Classes',
      value: classes.filter(c => c.status === 'active').length,
      icon: FaCheckCircle,
      color: 'green'
    },
    {
      label: 'Total Students',
      value: classes.reduce((sum, c) => sum + (c.studentCount || 0), 0),
      icon: FaUsers,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Class Management</h1>
            <p className="text-gray-600 mt-2">Manage all classes in the system</p>
          </div>
          <button
            onClick={handleAddClass}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <FaPlus />
            Add Class
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600'
            };
            
            return (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                    <Icon className="text-xl" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Class Table */}
        <ClassTable
          classes={classes}
          onEdit={handleEditClass}
          onDeactivate={handleDeactivate}
        />
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditClassModal
          classData={selectedClass}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default ClassManagement;
