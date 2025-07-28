export const BOOKMARK_CATEGORIES = {
  WORK: 'work',
  PERSONAL: 'personal',
  EDUCATION: 'education',
  ENTERTAINMENT: 'entertainment',
  NEWS: 'news',
  SHOPPING: 'shopping',
  SOCIAL: 'social',
  TECHNOLOGY: 'technology',
  OTHER: 'other',
};

export const CATEGORY_LABELS = {
  [BOOKMARK_CATEGORIES.WORK]: 'Work',
  [BOOKMARK_CATEGORIES.PERSONAL]: 'Personal',
  [BOOKMARK_CATEGORIES.EDUCATION]: 'Education',
  [BOOKMARK_CATEGORIES.ENTERTAINMENT]: 'Entertainment',
  [BOOKMARK_CATEGORIES.NEWS]: 'News',
  [BOOKMARK_CATEGORIES.SHOPPING]: 'Shopping',
  [BOOKMARK_CATEGORIES.SOCIAL]: 'Social',
  [BOOKMARK_CATEGORIES.TECHNOLOGY]: 'Technology',
  [BOOKMARK_CATEGORIES.OTHER]: 'Other',
};

export const CATEGORY_COLORS = {
  [BOOKMARK_CATEGORIES.WORK]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [BOOKMARK_CATEGORIES.PERSONAL]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [BOOKMARK_CATEGORIES.EDUCATION]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [BOOKMARK_CATEGORIES.ENTERTAINMENT]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  [BOOKMARK_CATEGORIES.NEWS]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [BOOKMARK_CATEGORIES.SHOPPING]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [BOOKMARK_CATEGORIES.SOCIAL]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [BOOKMARK_CATEGORIES.TECHNOLOGY]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  [BOOKMARK_CATEGORIES.OTHER]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 20,
};

export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'k',
  NEW_BOOKMARK: 'n',
  ESCAPE: 'Escape',
};

export const TOAST_DURATION = 3000;

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/v1';

export const THEME_STORAGE_KEY = 'bookmarks-theme';

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_URL: 'Please enter a valid URL',
  MAX_LENGTH: (max) => `Maximum ${max} characters allowed`,
  MIN_LENGTH: (min) => `Minimum ${min} characters required`,
};