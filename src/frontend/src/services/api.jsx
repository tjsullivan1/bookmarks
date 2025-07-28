import { BOOKMARK_CATEGORIES } from '../utils/constants.jsx';


const API_BASE = '/api/v1';

export const api = {
  bookmarks: {
    // Get all bookmarks with optional filtering and pagination
    getAll: async ({ category, search, tags, page = 1, pageSize = 20 } = {}) => {
      const params = new URLSearchParams();
      params.append('user_id', 'default_user');
      if (category && category !== 'all') params.append('category', category);
      if (tags && tags.length > 0) params.append('tags', tags.join(','));
      if (page) params.append('page', page);
      if (pageSize) params.append('page_size', pageSize);
      // No direct search param in backend, so filter client-side after fetch if needed
      const res = await fetch(`${API_BASE}/bookmarks?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch bookmarks');
      const data = await res.json();
      let bookmarks = data.bookmarks;
      if (search) {
        const searchLower = search.toLowerCase();
        bookmarks = bookmarks.filter(bookmark =>
          bookmark.title.toLowerCase().includes(searchLower) ||
          (bookmark.description?.toLowerCase().includes(searchLower)) ||
          bookmark.url.toLowerCase().includes(searchLower) ||
          (bookmark.tags && bookmark.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      return {
        bookmarks,
        total: bookmarks.length,
        page: data.page,
        pageSize: data.page_size,
        totalPages: Math.ceil(data.total / data.page_size),
      };
    },

    // Get a single bookmark by ID
    getById: async (id) => {
      const params = new URLSearchParams();
      params.append('user_id', 'default_user');
      const res = await fetch(`${API_BASE}/bookmarks/${id}?${params.toString()}`);
      if (!res.ok) throw new Error('Bookmark not found');
      return await res.json();
    },

    // Create a new bookmark
    create: async (bookmarkData) => {
      const res = await fetch(`${API_BASE}/bookmarks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookmarkData, user_id: 'default_user' }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to create bookmark');
      }
      return await res.json();
    },

    // Update an existing bookmark
    update: async (id, updateData) => {
      const params = new URLSearchParams();
      params.append('user_id', 'default_user');
      const res = await fetch(`${API_BASE}/bookmarks/${id}?${params.toString()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to update bookmark');
      }
      return await res.json();
    },

    // Delete a bookmark
    delete: async (id) => {
      const params = new URLSearchParams();
      params.append('user_id', 'default_user');
      const res = await fetch(`${API_BASE}/bookmarks/${id}?${params.toString()}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to delete bookmark');
      }
      return { success: true };
    },
  },

  categories: {
    getAll: async () => {
      const params = new URLSearchParams();
      params.append('user_id', 'default_user');
      const res = await fetch(`${API_BASE}/bookmarks/categories/?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data.categories;
    },
  },

  stats: {
    getOverview: async () => {
      // No direct stats endpoint in backend, so compute client-side after fetching all bookmarks
      const { bookmarks } = await api.bookmarks.getAll();
      const totalBookmarks = bookmarks.length;
      const categoryCounts = {};
      Object.values(BOOKMARK_CATEGORIES).forEach(category => {
        categoryCounts[category] = bookmarks.filter(b => b.category === category).length;
      });
      const recentBookmarks = bookmarks
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      return {
        totalBookmarks,
        categoryCounts,
        recentBookmarks,
      };
    },
  },
};

export default api;