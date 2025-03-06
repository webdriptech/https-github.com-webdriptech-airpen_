import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { useState } from "react";
import {
  Mic,
  BookOpen,
  Plus,
  BookOpenCheck,
  Award,
  FileText,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import { ActionButton } from "@/components/dashboard/action-button";
import { ModuleCard } from "@/components/dashboard/module-card";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/navbar";
import { RecordingModal } from "@/components/dashboard/recording-modal";
import { TopicModal } from "@/components/dashboard/topic-modal";
import { ModuleView } from "@/components/dashboard/module-view";
import { NotesView } from "@/components/dashboard/notes-view";
import { useLocation } from "react-router-dom";

export default function DashboardNew() {
  const { user } = useUser();
  const location = useLocation();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  // UI state
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [showNotesView, setShowNotesView] = useState(
    location.pathname === "/notes",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Sample learning modules data
  const modules = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      description: "Learn the fundamentals of ML algorithms and applications",
      progress: 75,
    },
    {
      id: 2,
      title: "Web Development Basics",
      description: "HTML, CSS, and JavaScript fundamentals for beginners",
      progress: 45,
    },
    {
      id: 3,
      title: "Data Structures & Algorithms",
      description: "Essential computer science concepts for coding interviews",
      progress: 30,
    },
    {
      id: 4,
      title: "Physics: Mechanics",
      description:
        "Understanding forces, motion, and energy in physical systems",
      progress: 60,
    },
    {
      id: 5,
      title: "English Literature",
      description: "Analysis of classic works and literary techniques",
      progress: 15,
    },
    {
      id: 6,
      title: "Organic Chemistry",
      description: "Structure, properties, and reactions of organic compounds",
      progress: 50,
    },
  ];

  // Filter modules based on search query
  const filteredModules = searchQuery
    ? modules.filter(
        (module) =>
          module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : modules;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRecord = () => {
    setIsRecordingModalOpen(true);
  };

  const handleSaveRecording = (recording: Blob, title: string) => {
    console.log("Saving recording:", { recording, title });
    // In a real app, you would upload the recording to a server
    // and create a new module based on the transcription

    // For demo purposes, we'll just show a success message
    alert(
      `Recording "${title}" processed successfully! A new learning module has been created.`,
    );
  };

  const handleCreateTopic = () => {
    setIsTopicModalOpen(true);
  };

  const handleSaveTopic = (topic: string, description: string) => {
    console.log("Creating new topic:", { topic, description });
    // In a real app, you would send this to the backend to generate content

    // For demo purposes, we'll just show a success message
    alert(
      `Topic "${topic}" created successfully! A new learning module has been generated.`,
    );
  };

  const handleContinueModule = (moduleId: number) => {
    setActiveModule(moduleId);
  };

  const handleViewNotes = () => {
    setShowNotesView(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navbar */}
        <div className="md:hidden">
          <Navbar />
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {showNotesView ? (
              <NotesView />
            ) : activeModule !== null ? (
              <ModuleView
                module={modules.find((m) => m.id === activeModule)!}
                onClose={() => setActiveModule(null)}
              />
            ) : (
              <>
                {/* Welcome Section */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Welcome back,{" "}
                    {userData?.name || user?.firstName || "Student"}!
                  </h1>
                  <p className="text-gray-600">
                    Continue your learning journey or start something new.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                  <SearchBar onSearch={handleSearch} onRecord={handleRecord} />
                </div>

                {/* Learning Modules */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Learning Modules
                    </h2>
                    <button className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors duration-200">
                      View All
                    </button>
                  </div>

                  {filteredModules.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredModules.slice(0, 6).map((module) => (
                        <ModuleCard
                          key={module.id}
                          title={module.title}
                          description={module.description}
                          progress={module.progress}
                          onContinue={() => handleContinueModule(module.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                      <div className="text-gray-400 mb-4">
                        <BookOpen className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No modules found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {searchQuery
                          ? `No results found for "${searchQuery}". Try a different search term.`
                          : "You don't have any learning modules yet. Create your first one!"}
                      </p>
                      <div className="flex justify-center gap-4">
                        <ActionButton
                          icon={<Plus />}
                          label="New Topic"
                          onClick={handleCreateTopic}
                        />
                        <ActionButton
                          icon={<Mic />}
                          label="Record Lecture"
                          onClick={handleRecord}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <ActionButton
                      icon={<Plus />}
                      label="New Topic"
                      onClick={handleCreateTopic}
                    />
                    <ActionButton
                      icon={<Mic />}
                      label="Record Lecture"
                      onClick={handleRecord}
                    />
                    <ActionButton
                      icon={<FileText />}
                      label="My Notes"
                      onClick={handleViewNotes}
                    />
                    <ActionButton
                      icon={<BookOpenCheck />}
                      label="Syllabus"
                      onClick={() => console.log("Syllabus")}
                    />
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h2>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="p-4 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-teal-100 rounded-full text-teal-600">
                            {item % 2 === 0 ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <BookOpen className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item % 2 === 0
                                ? "Created new notes"
                                : "Completed quiz"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item % 2 === 0
                                ? "Machine Learning Basics"
                                : "Data Structures Quiz #2"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item} {item === 1 ? "hour" : "hours"} ago
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        onSave={handleSaveRecording}
      />

      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onSave={handleSaveTopic}
      />
    </div>
  );
}
