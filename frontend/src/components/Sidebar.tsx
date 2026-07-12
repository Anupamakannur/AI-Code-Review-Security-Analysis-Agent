import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Code2, 
  Database, 
  Network, 
  BookOpen, 
  ShieldAlert 
} from "lucide-react";

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Code Review",
      path: "/editor",
      icon: <Code2 className="w-5 h-5" />,
    },
    {
      name: "Knowledge Base",
      path: "/rag",
      icon: <Database className="w-5 h-5" />,
    },
    {
      name: "System Architecture",
      path: "/architecture",
      icon: <Network className="w-5 h-5" />,
    },
    {
      name: "Security Docs",
      path: "/docs",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 border-r border-brandBorder bg-brandDark/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-brandBorder flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brandAccent to-brandPurple flex items-center justify-center shadow-lg shadow-brandAccent/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              GUARDIA AI
            </h1>
            <span className="text-[10px] text-brandCyan font-semibold tracking-widest uppercase">
              Security Agent
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-brandAccent/10 text-brandAccent border-l-4 border-brandAccent font-medium"
                    : "text-gray-400 hover:bg-brandBorder/40 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Version info */}
      <div className="p-6 border-t border-brandBorder">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">System Version</span>
          <span className="text-sm font-semibold text-gray-300">Milestone 1.0.0</span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">
              Local Core Active
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
