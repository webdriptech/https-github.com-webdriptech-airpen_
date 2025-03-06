import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { BookOpen, FileText, Award, BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";

export function Navbar() {
  const { user, isLoaded } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-teal-600">AirPen</span>
          </Link>

          <Authenticated>
            <div className="hidden md:flex items-center space-x-6">
              <NavLink
                icon={<FileText className="h-4 w-4" />}
                label="Notes"
                href="#"
              />
              <NavLink
                icon={<BookOpenCheck className="h-4 w-4" />}
                label="Syllabus"
                href="#"
              />
              <NavLink
                icon={<BookOpen className="h-4 w-4" />}
                label="Quizzes"
                href="#"
              />
              <NavLink
                icon={<Award className="h-4 w-4" />}
                label="Certificates"
                href="#"
              />
            </div>
          </Authenticated>

          {isLoaded ? (
            <div className="flex items-center space-x-4">
              <Authenticated>
                <div className="flex items-center space-x-4">
                  {userData && (
                    <span className="text-gray-900 hidden md:inline">
                      {userData.name}
                    </span>
                  )}
                  <UserButton afterSignOutUrl="/" />
                </div>
              </Authenticated>
              <Unauthenticated>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
              </Unauthenticated>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="flex items-center space-x-1 text-gray-600 hover:text-teal-600 transition-colors duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
