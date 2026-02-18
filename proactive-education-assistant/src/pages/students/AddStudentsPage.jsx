import { useState } from "react";
import { FaUpload, FaUserPlus } from "react-icons/fa";

export default function AddStudentsPage() {
  const [mode, setMode] = useState("single");

  return (
    <div className="px-6 py-8 bg-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Add Students
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Add individual students or upload them in bulk using CSV/Excel.
          </p>
        </div>

        {/* Mode Switch */}
        <div className="flex gap-3">
          <button
            onClick={() => setMode("single")}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition ${
              mode === "single"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Single Student
          </button>

          <button
            onClick={() => setMode("bulk")}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition ${
              mode === "bulk"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Bulk Upload
          </button>
        </div>

        {/* SINGLE STUDENT FORM */}
        {mode === "single" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">

            <div className="flex items-center gap-2">
              <FaUserPlus className="text-slate-600" />
              <h2 className="font-semibold text-slate-900">
                Add Single Student
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              {/* Student Name */}
              <FormInput label="Student Name *" placeholder="Full Name" />

              {/* Roll Number */}
              <FormInput label="Roll No *" placeholder="001" />

              {/* Class */}
              <div>
                <label className="form-label">Class / Batch *</label>
                <select className="form-input">
                  <option>Select Class</option>
                  <option>6th</option>
                  <option>7th</option>
                  <option>8th</option>
                  <option>9th</option>
                  <option>10th</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input" />
              </div>

              {/* Gender */}
              <div>
                <label className="form-label">Gender</label>
                <select className="form-input">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Parent Contact */}
              <FormInput label="Parent Contact" placeholder="+91 XXXXX XXXXX" />

              {/* Guardian Name */}
              <FormInput label="Guardian Name" placeholder="Parent / Guardian Name" />

              {/* Address */}
              <FormInput label="Address" placeholder="Village / Area / City" />
            </div>

            <div className="pt-4">
              <button className="px-6 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition">
                Save Student
              </button>
            </div>
          </div>
        )}

        {/* BULK UPLOAD */}
        {mode === "bulk" && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">

            <div className="flex items-center gap-2">
              <FaUpload className="text-slate-600" />
              <h2 className="font-semibold text-slate-900">
                Bulk Upload Students
              </h2>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
              <FaUpload className="mx-auto text-slate-400 text-3xl mb-3" />
              <p className="text-sm text-slate-700 font-medium">
                Upload CSV or Excel file
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag & drop or click to browse
              </p>
              <input type="file" className="hidden" />
            </div>

            {/* Template Format */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
              <p className="text-xs text-slate-500">
                Template format:
              </p>
              <p className="text-xs font-mono text-slate-700 mt-1">
                Name, Roll No, Class, DOB, Gender, Parent Contact, Guardian, Address
              </p>
            </div>

            <button className="px-6 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition">
              Upload File
            </button>
          </div>
        )}

      </div>
    </div>
  );
}


/* ---------- Reusable Input Component ---------- */

function FormInput({ label, placeholder }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );
}
