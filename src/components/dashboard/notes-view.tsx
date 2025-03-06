import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Plus, Trash2, Edit, Save } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
}

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Machine Learning Basics",
      content:
        "Neural networks are composed of layers of interconnected nodes...",
      date: "2023-06-15",
      tags: ["AI", "Machine Learning"],
    },
    {
      id: 2,
      title: "Web Development Frameworks",
      content: "React is a JavaScript library for building user interfaces...",
      date: "2023-06-10",
      tags: ["Web Dev", "React"],
    },
    {
      id: 3,
      title: "Data Structures Overview",
      content:
        "Arrays, linked lists, stacks, and queues are fundamental data structures...",
      date: "2023-06-05",
      tags: ["Programming", "Computer Science"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "New Note",
      content: "Start typing your notes here...",
      date: new Date().toISOString().split("T")[0],
      tags: ["New"],
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditMode(true);
    setEditedContent(newNote.content);
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
      setEditMode(false);
    }
  };

  const handleSaveNote = () => {
    if (activeNote) {
      setNotes(
        notes.map((note) =>
          note.id === activeNote.id
            ? {
                ...note,
                content: editedContent,
                date: new Date().toISOString().split("T")[0],
              }
            : note,
        ),
      );
      setActiveNote({ ...activeNote, content: editedContent });
      setEditMode(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="bg-teal-600 p-4 text-white">
        <h2 className="text-xl font-semibold">My Notes</h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Notes List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="p-3 border-b border-gray-200">
            <Button
              onClick={handleCreateNote}
              className="w-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${activeNote?.id === note.id ? "bg-teal-50" : ""}`}
                    onClick={() => {
                      setActiveNote(note);
                      setEditMode(false);
                      setEditedContent(note.content);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{note.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {note.content}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-1">
                        {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(note.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>No notes found</p>
                <p className="text-sm mt-1">
                  Try a different search term or create a new note
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 flex flex-col">
          {activeNote ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{activeNote.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(activeNote.date)}
                  </p>
                </div>

                {editMode ? (
                  <Button
                    onClick={handleSaveNote}
                    variant="outline"
                    className="text-teal-600 border-teal-600 hover:bg-teal-50 flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditMode(true);
                      setEditedContent(activeNote.content);
                    }}
                    variant="outline"
                    className="text-teal-600 border-teal-600 hover:bg-teal-50 flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {editMode ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <div className="prose max-w-none">
                    {activeNote.content.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6 text-gray-500">
              <div>
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  No Note Selected
                </h3>
                <p>Select a note from the list or create a new one</p>
                <Button
                  onClick={handleCreateNote}
                  className="mt-4 bg-teal-600 hover:bg-teal-700"
                >
                  Create New Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
