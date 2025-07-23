import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { BOOKMARK_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/constants.jsx';

const CategoryFilter = ({ selectedCategory, onCategoryChange, categoryCounts = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories', count: Object.values(categoryCounts).reduce((sum, count) => sum + count, 0) },
    ...Object.values(BOOKMARK_CATEGORIES).map(category => ({
      value: category,
      label: CATEGORY_LABELS[category],
      count: categoryCounts[category] || 0,
    })),
  ];

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory) || categories[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Filter className="h-4 w-4" />
        <span>{selectedCategoryData.label}</span>
        {selectedCategoryData.count > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {selectedCategoryData.count}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
          <div className="py-1">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategorySelect(category.value)}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedCategory === category.value
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {category.value !== 'all' && (
                    <div className={`h-3 w-3 rounded-full ${CATEGORY_COLORS[category.value]?.split(' ')[0] || 'bg-gray-400'}`} />
                  )}
                  <span>{category.label}</span>
                </div>
                {category.count > 0 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default CategoryFilter;