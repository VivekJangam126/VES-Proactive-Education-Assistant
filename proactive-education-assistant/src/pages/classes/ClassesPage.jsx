export default function ClassesPage() {
  return (
    <div className="px-6 py-6 bg-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-2xl font-semibold">My Classes</h1>
        <p className="text-sm text-slate-600">
          Create and manage classes and subjects you teach.
        </p>

        {/* Create Class */}
        <div className="bg-white p-6 rounded-lg border space-y-4">
          <h2 className="font-semibold">Create New Class</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input" placeholder="Class Name (H3, N3 etc)" />
            <input className="input" placeholder="Subject (DSA, Math etc)" />
          </div>

          <button className="btn-primary">Add Class</button>
        </div>

        {/* Example list */}
        <div className="bg-white p-6 rounded-lg border space-y-2">
          <h2 className="font-semibold">Your Classes</h2>

          <div className="flex gap-2 flex-wrap">
            <span className="badge">H3 - DSA</span>
            <span className="badge">H3 - CC</span>
            <span className="badge">N3 - DSA</span>
          </div>
        </div>

      </div>
    </div>
  );
}
