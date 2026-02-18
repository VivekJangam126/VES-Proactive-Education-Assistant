import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaChalkboardTeacher, FaBook, FaCalendar, FaEye } from "react-icons/fa";

export default function MyClassesPage() {
  const navigate = useNavigate();

  // Mock data - replace with actual data from context/API
  const [classes] = useState([
    {
      id: 1,
      name: "Class 6-A",
      subject: "Mathematics",
      students: 35,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      room: "Room 101",
      attendance: 92,
      nextClass: "Tomorrow at 9:00 AM"
    },
    {
      id: 2,
      name: "Class 7-B",
      subject: "Science",
      students: 32,
      schedule: "Tue, Thu - 10:30 AM",
      room: "Lab 2",
      attendance: 88,
      nextClass: "Today at 10:30 AM"
    },
    {
      id: 3,
      name: "Class 8-A",
      subject: "English",
      students: 38,
      schedule: "Mon, Wed, Fri - 2:00 PM",
      room: "Room 205",
      attendance: 95,
      nextClass: "Monday at 2:00 PM"
    },
    {
      id: 4,
      name: "Class 9-C",
      subject: "Mathematics",
      students: 30,
      schedule: "Tue, Thu, Sat - 11:00 AM",
      room: "Room 103",
      attendance: 90,
      nextClass: "Thursday at 11:00 AM"
    },
  ]);

  const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0);
  const avgAttendance = Math.round(
    classes.reduce((sum, cls) => sum + cls.attendance, 0) / classes.length
  );

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Classes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view your assigned classes</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Classes</p>
                <p className="text-2xl font-semibold text-gray-900">{classes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaChalkboardTeacher className="text-xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FaUsers className="text-xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Attendance</p>
                <p className="text-2xl font-semibold text-gray-900">{avgAttendance}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FaCalendar className="text-xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FaBook className="text-xs text-gray-400" />
                    <span className="text-sm text-gray-600">{classItem.subject}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/students?class=${classItem.name}`)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Students"
                >
                  <FaEye />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {/* Students Count */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-sm text-gray-400" />
                    <span className="text-sm text-gray-600">Students</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{classItem.students}</span>
                </div>

                {/* Schedule */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-sm text-gray-400" />
                    <span className="text-sm text-gray-600">Schedule</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{classItem.schedule}</span>
                </div>

                {/* Room */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FaChalkboardTeacher className="text-sm text-gray-400" />
                    <span className="text-sm text-gray-600">Room</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{classItem.room}</span>
                </div>

                {/* Attendance */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Attendance Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          classItem.attendance >= 90
                            ? 'bg-green-500'
                            : classItem.attendance >= 75
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${classItem.attendance}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{classItem.attendance}%</span>
                  </div>
                </div>
              </div>

              {/* Next Class */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Next Class:</span>
                  <span className="text-xs font-medium text-blue-600">{classItem.nextClass}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/data-entry?class=${classItem.name}`)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Take Attendance
                </button>
                <button
                  onClick={() => navigate(`/students?class=${classItem.name}`)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Students
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {classes.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FaChalkboardTeacher className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-600">No classes assigned yet</p>
            <p className="text-sm text-gray-500 mt-1">Contact your administrator to get classes assigned</p>
          </div>
        )}

      </div>
    </div>
  );
}
