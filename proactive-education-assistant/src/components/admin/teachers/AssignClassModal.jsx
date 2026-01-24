import { useMemo, useState } from 'react';
import { approvalService } from '../../../services/approvalService';
import { FaTimes } from 'react-icons/fa';

function AssignClassModal({ teacher, classes, onClose, onSuccess }) {
  const idByName = useMemo(() => {
    const map = new Map();
    classes.forEach(c => map.set(c.name, c.id));
    return map;
  }, [classes]);

  const initialSelected = (teacher.assignedClasses || [])
    .map(name => idByName.get(name))
    .filter(Boolean);

  const [selectedClasses, setSelectedClasses] = useState(initialSelected);
  const [assigning, setAssigning] = useState(false);

  const handleClassToggle = (classId) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(c => c !== classId)
        : [...prev, classId]
    );
  };

  const handleAssign = async () => {
    setAssigning(true);
    try {
      const result = await approvalService.assignClasses(teacher.id, selectedClasses);
      if (result.success) {
        alert('Classes assigned successfully!');
        onSuccess();
      }
    } catch (error) {
      alert('Failed to assign classes: ' + error.message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Assign Classes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Teacher Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Teacher:</span> {teacher.name}
            </p>
            <p className="text-sm text-blue-800">
              <span className="font-medium">Subject:</span> {teacher.subject}
            </p>
          </div>

          {/* Available Classes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Available Classes</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {classes.filter(c => c.status === 'active').map((cls) => (
                <label
                  key={cls.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedClasses.includes(cls.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls.id)}
                    onChange={() => handleClassToggle(cls.id)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{cls.name}</p>
                    <p className="text-sm text-gray-500">{cls.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {cls.studentCount} students
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {selectedClasses.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Selected Classes ({selectedClasses.length}):
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {selectedClasses.map(id => classes.find(c => c.id === id)?.name || id).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={assigning || selectedClasses.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {assigning ? 'Assigning...' : `Assign ${selectedClasses.length} Class(es)`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignClassModal;
