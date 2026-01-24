import { useState } from 'react';
import { adminService } from '../../../services/adminService';
import { FaTimes } from 'react-icons/fa';

function AddEditClassModal({ classData, onClose, onSuccess }) {
  const isEdit = !!classData;
  
  const SUBJECT_OPTIONS = ["Math", "Science", "English", "History", "Geography", "Computer"];

  const [formData, setFormData] = useState({
    name: classData?.name || '',
    description: classData?.description || '',
    grade: classData?.grade || '',
    subjects: Array.isArray(classData?.subjects) ? classData.subjects : [],
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.grade) {
      alert('Please fill in all required fields');
      return;
    }
    if (!Array.isArray(formData.subjects) || formData.subjects.length === 0) {
      alert('Please select at least one subject');
      return;
    }

    setSaving(true);
    try {
      let result;
      if (isEdit) {
        result = await adminService.updateClass(classData.id, { name: formData.name, subjects: formData.subjects });
      } else {
        result = await adminService.addClass({ name: formData.name, subjects: formData.subjects });
      }

      if (result.success) {
        alert(isEdit ? 'Class updated successfully!' : 'Class added successfully!');
        onSuccess();
      }
    } catch (error) {
      alert('Failed to save class: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Class' : 'Add New Class'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Grade 7A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 7"
              min="1"
              max="12"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="e.g., Morning batch for Grade 7 students"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUBJECT_OPTIONS.map((subj) => (
                <label key={subj} className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(subj)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        subjects: checked
                          ? [...prev.subjects, subj]
                          : prev.subjects.filter((s) => s !== subj),
                      }));
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-800">{subj}</span>
                </label>
              ))}
            </div>
            {formData.subjects.length > 0 && (
              <p className="text-xs text-gray-600 mt-2">
                Selected: {formData.subjects.join(', ')}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditClassModal;
