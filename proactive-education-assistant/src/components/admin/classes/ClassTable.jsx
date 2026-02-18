import { FaEdit, FaBan } from 'react-icons/fa';

function ClassTable({ classes, onEdit, onDeactivate }) {
  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
        Inactive
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Class Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Assigned Teachers
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                  {cls.grade && (
                    <div className="text-xs text-gray-500">Grade {cls.grade}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{cls.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{cls.studentCount}</div>
                </td>
                <td className="px-6 py-4">
                  {cls.assignedTeachers.length > 0 ? (
                    <div className="text-sm text-gray-600">
                      {cls.assignedTeachers.join(', ')}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">No teachers assigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(cls.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(cls)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                    >
                      <FaEdit /> Edit
                    </button>
                    {cls.status === 'active' && (
                      <button
                        onClick={() => onDeactivate(cls.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                      >
                        <FaBan /> Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No classes found</p>
        </div>
      )}
    </div>
  );
}

export default ClassTable;
