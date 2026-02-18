import { useMemo, useState } from 'react';
import { approvalService } from '../../../services/approvalService';
import { FaTimes } from 'react-icons/fa';

function TeacherApprovalModal({ teacher, classes, onClose, onSuccess }) {
  const classIdByName = useMemo(() => {
    const map = new Map();
    classes.forEach(c => map.set(c.name, c.id));
    return map;
  }, [classes]);

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleClassToggle = (classId) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(c => c !== classId)
        : [...prev, classId]
    );
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const result = await approvalService.approveTeacher(teacher.id, selectedClasses);
      if (result.success) {
        alert('Teacher approved successfully!');
        onSuccess();
      }
    } catch (error) {
      alert('Failed to approve teacher: ' + error.message);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setRejecting(true);
    try {
      const result = await approvalService.rejectTeacher(teacher.id, rejectionReason);
      if (result.success) {
        alert('Teacher rejected');
        onSuccess();
      }
    } catch (error) {
      alert('Failed to reject teacher: ' + error.message);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Teacher Approval</h2>
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Teacher Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {teacher.name}</p>
              <p><span className="font-medium">Email:</span> {teacher.email}</p>
              <p><span className="font-medium">Subject:</span> {teacher.subject}</p>
              <p><span className="font-medium">Joined:</span> {teacher.joinedDate}</p>
            </div>
          </div>

          {!showRejectInput ? (
            <>
              {/* Class Assignment */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Assign Classes (Optional)</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {classes.filter(c => c.status === 'active').map((cls) => (
                    <label
                      key={cls.id}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls.id)}
                        onChange={() => handleClassToggle(cls.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        <p className="text-sm text-gray-500">{cls.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedClasses.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedClasses.map(id => classes.find(c => c.id === id)?.name || id).join(', ')}
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Rejection Reason */
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Reason for Rejection</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="4"
                placeholder="Enter reason for rejection..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {!showRejectInput ? (
              <>
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {approving ? 'Approving...' : 'Approve Teacher'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejecting || !rejectionReason.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherApprovalModal;
