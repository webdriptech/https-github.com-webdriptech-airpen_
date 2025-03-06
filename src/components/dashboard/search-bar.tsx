import { Search, Mic } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onRecord?: () => void;
}

export function SearchBar({
  placeholder = "Enter a study topic or upload a lecture recording...",
  onSearch,
  onRecord,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    if (onSearch) onSearch(input.value);
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          name="search"
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-16 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <button
          type="button"
          onClick={onRecord}
          className="absolute right-3 top-2.5 bg-teal-600 text-white p-1.5 rounded-lg hover:bg-teal-700 transition-colors duration-200"
        >
          <Mic className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
