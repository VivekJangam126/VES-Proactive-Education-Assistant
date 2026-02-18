import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col">
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/students" label="Students" />
        <NavItem to="/data-entry" label="Data Entry" />

        <NavItem to="/chatbot" label="Chatbot" />
      </nav>

      <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
        Proactive Education Assistant
      </div>
    </aside>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm font-medium ${
          isActive
            ? "bg-slate-800 text-white"
            : "hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
