import { useState, useEffect } from 'react';
import { X, Save, Link, Hash } from 'lucide-react';
import { BOOKMARK_CATEGORIES, CATEGORY_LABELS, VALIDATION_MESSAGES } from '../utils/constants.jsx';

const BookmarkForm = ({ bookmark, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: BOOKMARK_CATEGORIES.OTHER,
    tags: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title || '',
        url: bookmark.url || '',
        description: bookmark.description || '',
        category: bookmark.category || BOOKMARK_CATEGORIES.OTHER,
        tags: bookmark.tags || [],
      });
    } else {
      setFormData({
        title: '',
        url: '',
        description: '',
        category: BOOKMARK_CATEGORIES.OTHER,
        tags: [],
      });
    }
    setErrors({});
    setTagInput('');
  }, [bookmark, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = VALIDATION_MESSAGES.REQUIRED;
    } else if (formData.title.length > 200) {
      newErrors.title = VALIDATION_MESSAGES.MAX_LENGTH(200);
    }

    if (!formData.url.trim()) {
      newErrors.url = VALIDATION_MESSAGES.REQUIRED;
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = VALIDATION_MESSAGES.INVALID_URL;
      }
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = VALIDATION_MESSAGES.MAX_LENGTH(500);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save bookmark:', error);
      // You could set a general error here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleUrlValidation = (url) => {
    // Auto-add https:// if no protocol specified
    if (url && !url.match(/^https?:\/\//)) {
      return `https://${url}`;
    }
    return url;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {bookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
            </h2>
            <button
              onClick={onCancel}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter bookmark title"
                maxLength={200}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL *
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  id="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  onBlur={(e) => handleInputChange('url', handleUrlValidation(e.target.value))}
                  className={`input pl-10 ${errors.url ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="https://example.com"
                />
              </div>
              {errors.url && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`textarea ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Optional description"
                rows={3}
                maxLength={500}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                ) : (
                  <div />
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="select"
              >
                {Object.values(BOOKMARK_CATEGORIES).map(category => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagAdd}
                    className="input pl-10"
                    placeholder="Type a tag and press Enter"
                  />
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press Enter or comma to add tags
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="btn-outline btn-md"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary btn-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner h-4 w-4" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>{bookmark ? 'Update' : 'Save'} Bookmark</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookmarkForm;
