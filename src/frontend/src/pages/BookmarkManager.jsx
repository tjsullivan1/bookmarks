import { useState, useEffect, useCallback } from 'react';
import { Grid, List, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api.jsx';
import BookmarkCard from '../components/BookmarkCard.jsx';
import BookmarkForm from '../components/BookmarkForm.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import { DEFAULT_PAGINATION } from '../utils/constants.jsx';

const BookmarkManager = ({ searchTerm = '', onNewBookmark }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGINATION.pageSize,
    total: 0,
    totalPages: 0,
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load bookmarks
  const loadBookmarks = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm,
        page: options.page || pagination.page,
        pageSize: pagination.pageSize,
      };

      const data = await api.bookmarks.getAll(params);
      setBookmarks(data.bookmarks);
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      });

      // Update category counts for the filter
      const stats = await api.stats.getOverview();
      setCategoryCounts(stats.categoryCounts);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, pagination.page, pagination.pageSize]);

  // Load bookmarks when dependencies change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Handle bookmark actions
  const handleSaveBookmark = async (bookmarkData) => {
    try {
      if (editingBookmark) {
        await api.bookmarks.update(editingBookmark.id, bookmarkData);
      } else {
        await api.bookmarks.create(bookmarkData);
      }

      setShowForm(false);
      setEditingBookmark(null);
      loadBookmarks();
    } catch (error) {
      console.error('Failed to save bookmark:', error);
      throw error;
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      await api.bookmarks.delete(bookmarkId);
      loadBookmarks();
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setShowForm(true);
  };

  const handleNewBookmark = () => {
    setEditingBookmark(null);
    setShowForm(true);
    onNewBookmark?.();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => loadBookmarks()}
          className="btn-primary btn-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {searchTerm ? `Search Results: "${searchTerm}"` : 'All Bookmarks'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `${pagination.total} bookmark${pagination.total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View mode toggle */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Add bookmark button */}
          <button
            onClick={handleNewBookmark}
            className="btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bookmark
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categoryCounts={categoryCounts}
        />

        {/* Results info */}
        {!loading && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.totalPages > 1 && (
              <>
                Page {pagination.page} of {pagination.totalPages}
                {' • '}
              </>
            )}
            Showing {bookmarks.length} of {pagination.total} bookmarks
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="loading-spinner h-8 w-8 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading bookmarks...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && bookmarks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Grid className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No bookmarks found' : 'No bookmarks yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first bookmark.'
            }
          </p>
          <button
            onClick={handleNewBookmark}
            className="btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Bookmark
          </button>
        </div>
      )}

      {/* Bookmarks Grid/List */}
      {!loading && bookmarks.length > 0 && (
        <>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={handleEditBookmark}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Bookmark Form Modal */}
      <BookmarkForm
        bookmark={editingBookmark}
        onSave={handleSaveBookmark}
        onCancel={() => {
          setShowForm(false);
          setEditingBookmark(null);
        }}
        isOpen={showForm}
      />
    </div>
  );
};

export default BookmarkManager;
