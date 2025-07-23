import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.jsx';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-16 items-center justify-center rounded-full bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-800"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span
        className={`absolute inset-0 flex h-full w-8 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out dark:bg-gray-700 ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;