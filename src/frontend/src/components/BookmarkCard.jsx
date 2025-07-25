import { useState } from 'react';
import { Edit2, Trash2, ExternalLink, Calendar, Tags } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/constants.jsx';

const BookmarkCard = ({ bookmark, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      setIsDeleting(true);
      try {
        await onDelete(bookmark.id);
      } catch (error) {
        console.error('Failed to delete bookmark:', error);
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    onEdit(bookmark);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateDescription = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="card group p-6 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:underline"
            >
              <span className="truncate">{bookmark.title}</span>
              <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-50" />
            </a>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {getDomainFromUrl(bookmark.url)}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            title="Edit bookmark"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50"
            title="Delete bookmark"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {bookmark.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          {truncateDescription(bookmark.description)}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Category Badge */}
          <span className={`badge ${CATEGORY_COLORS[bookmark.category] || CATEGORY_COLORS.other}`}>
            {CATEGORY_LABELS[bookmark.category] || 'Other'}
          </span>

          {/* Tags */}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tags className="h-3 w-3 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {bookmark.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
                {bookmark.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{bookmark.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(bookmark.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;