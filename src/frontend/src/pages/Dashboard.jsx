import { useState, useEffect } from 'react';
import { Bookmark, TrendingUp, Clock, Folder, Plus, Search } from 'lucide-react';
import { api } from '../services/api.jsx';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/constants.jsx';

const Dashboard = ({ onEditBookmark, onDeleteBookmark }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.stats.getOverview();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={loadStats}
          className="mt-4 btn-primary btn-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  const topCategories = Object.entries(stats.categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Your Bookmarks
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Organize and manage your favorite links with ease. Search, categorize, and access your bookmarks from anywhere.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookmarks */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Bookmarks
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalBookmarks}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Bookmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories Used
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Object.values(stats.categoryCounts).filter(count => count > 0).length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Folder className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Most Active Category */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Top Category
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {topCategories.length > 0
                  ? CATEGORY_LABELS[topCategories[0][0]]
                  : 'None'
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {topCategories.length > 0 ? `${topCategories[0][1]} bookmarks` : ''}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Recent Activity
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.recentBookmarks.length > 0 ? 'Active' : 'Quiet'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.recentBookmarks.length} recent bookmarks
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${CATEGORY_COLORS[category]?.split(' ')[0] || 'bg-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {CATEGORY_LABELS[category]}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full dark:bg-blue-500"
                      style={{
                        width: `${(count / stats.totalBookmarks) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {topCategories.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No bookmarks yet. Start by adding some!
              </p>
            )}
          </div>
        </div>

        {/* Recent Bookmarks */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Bookmarks
          </h3>
          <div className="space-y-4">
            {stats.recentBookmarks.length > 0 ? (
              stats.recentBookmarks.map((bookmark) => (
                <div key={bookmark.id} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {bookmark.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`badge ${CATEGORY_COLORS[bookmark.category] || CATEGORY_COLORS.other}`}>
                      {CATEGORY_LABELS[bookmark.category] || 'Other'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(bookmark.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {bookmark.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {bookmark.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No recent bookmarks found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Bookmark
            </span>
          </button>

          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
            <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Search All
            </span>
          </button>

          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
            <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Browse Categories
            </span>
          </button>

          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              View Analytics
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
