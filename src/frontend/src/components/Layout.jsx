import { useState, useEffect, useRef } from 'react';
import { Bookmark, Plus, Search, Home, Grid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import SearchBar from './SearchBar.jsx';
import { KEYBOARD_SHORTCUTS } from '../utils/constants.jsx';

const Layout = ({ children, onSearch, onNewBookmark, searchValue = '' }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchBarRef = useRef(null);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === KEYBOARD_SHORTCUTS.SEARCH) {
        e.preventDefault();
        // Focus the search input on desktop, or show mobile modal
        if (window.innerWidth >= 768) { // md breakpoint
          searchBarRef.current?.focus();
        } else {
          setIsSearchFocused(true);
        }
      }

      // Cmd/Ctrl + N for new bookmark
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === KEYBOARD_SHORTCUTS.NEW_BOOKMARK) {
        e.preventDefault();
        onNewBookmark?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNewBookmark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate('/bookmarks')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
                  <Bookmark className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Bookmarks
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Personal bookmark manager
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="hidden sm:flex items-center space-x-1">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => navigate('/bookmarks')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/bookmarks'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  <span>All Bookmarks</span>
                </button>
              </nav>
            </div>

            {/* Search Bar - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <SearchBar
                ref={searchBarRef}
                onSearch={onSearch}
                placeholder="Search bookmarks..."
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile search button */}
              <button
                onClick={() => setIsSearchFocused(true)}
                className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Add bookmark button */}
              <button
                onClick={onNewBookmark}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                title="Add new bookmark (Ctrl+D)"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Bookmark</span>
              </button>

              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-4">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search bookmarks..."
              className="w-full"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Bookmarks Manager. Built with React & Tailwind CSS.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono dark:border-gray-600">Ctrl</kbd>
                <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono dark:border-gray-600">K</kbd>
                <span>Search</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono dark:border-gray-600">Ctrl</kbd>
                <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-xs font-mono dark:border-gray-600">D</kbd>
                <span>New</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Search Modal for mobile - Could be expanded later */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSearchFocused(false)}
        >
          <div className="p-4">
            <SearchBar
              onSearch={(term) => {
                onSearch(term);
                setIsSearchFocused(false);
              }}
              placeholder="Search bookmarks..."
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
