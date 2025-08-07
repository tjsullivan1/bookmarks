// Simple test for the search functionality
import { api } from '../src/services/api.jsx';

describe('Search Functionality', () => {
  // Mock data similar to what the backend returns
  const mockBookmarks = [
    {
      id: '1',
      title: 'React Documentation',
      description: 'Official React documentation for learning React',
      url: 'https://reactjs.org/docs',
      category: 'technology',
      tags: ['react', 'javascript', 'frontend']
    },
    {
      id: '2', 
      title: 'Python Tutorial',
      description: 'Learn Python programming basics',
      url: 'https://python.org/tutorial',
      category: 'education',
      tags: ['python', 'programming', 'tutorial']
    },
    {
      id: '3',
      title: 'News Site',
      description: 'Daily news and updates',
      url: 'https://news.example.com',
      category: 'news',
      tags: ['news', 'current events']
    }
  ];

  beforeEach(() => {
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should filter bookmarks by search term in title', async () => {
    // Mock the API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: mockBookmarks,
        total: mockBookmarks.length,
        page: 1,
        page_size: 20
      })
    });

    const result = await api.bookmarks.getAll({ search: 'React' });

    expect(result.bookmarks).toHaveLength(1);
    expect(result.bookmarks[0].title).toBe('React Documentation');
    expect(result.total).toBe(1);
  });

  test('should filter bookmarks by search term in description', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: mockBookmarks,
        total: mockBookmarks.length,
        page: 1,
        page_size: 20
      })
    });

    const result = await api.bookmarks.getAll({ search: 'Python programming' });

    expect(result.bookmarks).toHaveLength(1);
    expect(result.bookmarks[0].title).toBe('Python Tutorial');
  });

  test('should filter bookmarks by search term in tags', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: mockBookmarks,
        total: mockBookmarks.length,
        page: 1,
        page_size: 20
      })
    });

    const result = await api.bookmarks.getAll({ search: 'javascript' });

    expect(result.bookmarks).toHaveLength(1);
    expect(result.bookmarks[0].title).toBe('React Documentation');
  });

  test('should return empty results for non-matching search', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: mockBookmarks,
        total: mockBookmarks.length,
        page: 1,
        page_size: 20
      })
    });

    const result = await api.bookmarks.getAll({ search: 'xyz nonexistent' });

    expect(result.bookmarks).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  test('should handle pagination correctly with search results', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bookmarks: mockBookmarks,
        total: mockBookmarks.length,
        page: 1,
        page_size: 20
      })
    });

    const result = await api.bookmarks.getAll({ search: 'tutorial', page: 1, pageSize: 1 });

    expect(result.bookmarks).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
  });
});