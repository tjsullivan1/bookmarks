import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search bookmarks...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle real-time search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input pl-10 pr-10"
          autoComplete="off"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {!searchTerm && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
          <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono dark:border-gray-600">⌘</kbd>
          <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono dark:border-gray-600">K</kbd>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
