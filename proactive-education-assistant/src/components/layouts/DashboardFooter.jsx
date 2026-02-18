function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
        <span>© 2026 Proactive Education Assistant</span>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-gray-900">Privacy</a>
          <a href="/terms" className="hover:text-gray-900">Terms</a>
          <a href="/contact" className="hover:text-gray-900">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default DashboardFooter;
