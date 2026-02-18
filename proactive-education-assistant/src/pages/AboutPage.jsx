export default function AboutPage() {
  return (
    <div className="px-6 py-8 bg-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            About Proactive Education Assistant
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl">
            A teacher-centric decision support system designed to identify early
            dropout risks and enable timely, meaningful intervention in primary education.
          </p>
        </div>

        {/* Mission */}
        <section className="bg-white border border-slate-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Our Mission
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Millions of students drop out of school not because data is unavailable,
            but because early warning signs are not acted upon in time.
            <br /><br />
            Our mission is to empower teachers with simple, explainable insights so
            they can identify at-risk students early and take corrective action
            before disengagement becomes dropout.
          </p>
        </section>

        {/* Problem Statement */}
        <section className="bg-white border border-slate-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            The Problem We Address
          </h2>
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
            <li>Attendance, marks, and behavior data exist but remain under-utilized</li>
            <li>No unified view of student engagement for teachers</li>
            <li>Late identification of dropout risk</li>
            <li>Over-reliance on manual judgment without structured insight</li>
            <li>Limited digital tools in low-resource environments</li>
          </ul>
        </section>

        {/* Solution Overview */}
        <section className="bg-white border border-slate-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Our Solution
          </h2>
          <div className="space-y-4 text-sm text-slate-700">
            <p>
              Proactive Education Assistant is a lightweight, explainable platform
              that helps teachers:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Track attendance, academic performance, and behavior in one place</li>
              <li>Automatically assess dropout risk using transparent rules</li>
              <li>Understand *why* a student is at risk — not just the score</li>
              <li>Receive suggested intervention actions</li>
              <li>Operate effectively even with low internet connectivity</li>
            </ul>
          </div>
        </section>

        {/* Explainable AI */}
        <section className="bg-white border border-slate-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Explainable Risk Intelligence
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Unlike black-box AI systems, our risk engine is fully explainable and
            deterministic.
            <br /><br />
            Each risk classification is based on clearly defined factors such as:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-700 mt-3 space-y-1">
            <li>Attendance percentage and trends</li>
            <li>Academic performance thresholds</li>
            <li>Behavioral incident frequency</li>
          </ul>
          <p className="text-sm text-slate-700 mt-3">
            This ensures trust, auditability, and responsible use in education.
          </p>
        </section>

        {/* Who It’s For */}
        <section className="bg-white border border-slate-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Who This Platform Is For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-slate-900">Teachers</p>
              <p className="text-slate-700">
                Identify at-risk students early and prioritize intervention.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Schools & NGOs</p>
              <p className="text-slate-700">
                Monitor engagement trends across classes and programs.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Administrators</p>
              <p className="text-slate-700">
                Gain organization-level insight without micromanagement.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Policy & Research</p>
              <p className="text-slate-700">
                Enable data-backed decisions with ethical safeguards.
              </p>
            </div>
          </div>
        </section>

        {/* Ethics & Privacy */}
        <section className="bg-white border border-slate-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Ethics, Privacy & Responsibility
          </h2>
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
            <li>No sensitive personal profiling</li>
            <li>No automated punitive decisions</li>
            <li>School-controlled data ownership</li>
            <li>Transparent and auditable logic</li>
            <li>Designed for future compliance (FERPA / GDPR)</li>
          </ul>
        </section>

        {/* Closing */}
        <section className="bg-white border border-slate-200 rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Our Belief
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Technology should assist educators — not replace them.
            <br /><br />
            By combining simple data input, transparent intelligence,
            and human-centered design, Proactive Education Assistant
            helps schools act early, support better, and keep students learning.
          </p>
        </section>

      </div>
    </div>
  );
}

