import {
  FileText,
  BookOpenCheck,
  BookOpen,
  Award,
  Home,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    { icon: <FileText className="h-5 w-5" />, label: "Notes", href: "/notes" },
    {
      icon: <BookOpenCheck className="h-5 w-5" />,
      label: "Syllabus",
      href: "/syllabus",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Quizzes",
      href: "/quizzes",
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: "Certificates",
      href: "/certificates",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-teal-600">AirPen</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${isActive ? "bg-teal-50 text-teal-600" : "text-gray-600 hover:bg-gray-50 hover:text-teal-600"}`}
                >
                  <span
                    className={isActive ? "text-teal-600" : "text-gray-500"}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="bg-teal-50 p-4 rounded-lg">
          <h4 className="font-medium text-teal-700 mb-2">Need Help?</h4>
          <p className="text-sm text-teal-600 mb-3">
            Check our documentation or contact support
          </p>
          <Link
            to="#"
            className="text-sm text-white bg-teal-600 px-3 py-2 rounded-lg inline-block hover:bg-teal-700 transition-colors duration-200"
          >
            View Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
