import { BOOKMARK_CATEGORIES } from '../utils/constants.jsx';

// Mock data
const MOCK_BOOKMARKS = [
  {
    id: '1',
    title: 'React Documentation',
    url: 'https://react.dev/',
    description: 'The new React documentation with hooks and modern React patterns.',
    category: BOOKMARK_CATEGORIES.TECHNOLOGY,
    tags: ['react', 'javascript', 'frontend', 'documentation'],
    user_id: 'default_user',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    description: 'A utility-first CSS framework for rapidly building custom user interfaces.',
    category: BOOKMARK_CATEGORIES.TECHNOLOGY,
    tags: ['css', 'tailwind', 'design', 'frontend'],
    user_id: 'default_user',
    created_at: '2024-01-14T09:15:00Z',
    updated_at: '2024-01-14T09:15:00Z',
  },
  {
    id: '3',
    title: 'GitHub',
    url: 'https://github.com/',
    description: 'The world\'s leading software development platform.',
    category: BOOKMARK_CATEGORIES.WORK,
    tags: ['git', 'development', 'collaboration', 'code'],
    user_id: 'default_user',
    created_at: '2024-01-13T14:20:00Z',
    updated_at: '2024-01-13T14:20:00Z',
  },
  {
    id: '4',
    title: 'Netflix',
    url: 'https://netflix.com/',
    description: 'Watch TV shows and movies anytime, anywhere.',
    category: BOOKMARK_CATEGORIES.ENTERTAINMENT,
    tags: ['streaming', 'movies', 'tv-shows'],
    user_id: 'default_user',
    created_at: '2024-01-12T20:45:00Z',
    updated_at: '2024-01-12T20:45:00Z',
  },
  {
    id: '5',
    title: 'Coursera',
    url: 'https://coursera.org/',
    description: 'Online courses and degrees from top universities and companies.',
    category: BOOKMARK_CATEGORIES.EDUCATION,
    tags: ['learning', 'courses', 'education', 'skills'],
    user_id: 'default_user',
    created_at: '2024-01-11T11:00:00Z',
    updated_at: '2024-01-11T11:00:00Z',
  },
  {
    id: '6',
    title: 'Amazon',
    url: 'https://amazon.com/',
    description: 'Online shopping for electronics, apparel, computers, books, and more.',
    category: BOOKMARK_CATEGORIES.SHOPPING,
    tags: ['shopping', 'ecommerce', 'products'],
    user_id: 'default_user',
    created_at: '2024-01-10T16:30:00Z',
    updated_at: '2024-01-10T16:30:00Z',
  },
  {
    id: '7',
    title: 'BBC News',
    url: 'https://bbc.com/news',
    description: 'Breaking news, sport, TV, radio and a whole lot more.',
    category: BOOKMARK_CATEGORIES.NEWS,
    tags: ['news', 'current-events', 'world'],
    user_id: 'default_user',
    created_at: '2024-01-09T08:00:00Z',
    updated_at: '2024-01-09T08:00:00Z',
  },
  {
    id: '8',
    title: 'Twitter',
    url: 'https://twitter.com/',
    description: 'Social networking service for sharing thoughts and updates.',
    category: BOOKMARK_CATEGORIES.SOCIAL,
    tags: ['social', 'networking', 'communication'],
    user_id: 'default_user',
    created_at: '2024-01-08T12:15:00Z',
    updated_at: '2024-01-08T12:15:00Z',
  },
  {
    id: '9',
    title: 'Personal Portfolio',
    url: 'https://johndoe.dev/',
    description: 'My personal portfolio website showcasing projects and skills.',
    category: BOOKMARK_CATEGORIES.PERSONAL,
    tags: ['portfolio', 'personal', 'projects'],
    user_id: 'default_user',
    created_at: '2024-01-07T19:45:00Z',
    updated_at: '2024-01-07T19:45:00Z',
  },
  {
    id: '10',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com/',
    description: 'The largest online community for programmers to learn and share knowledge.',
    category: BOOKMARK_CATEGORIES.TECHNOLOGY,
    tags: ['programming', 'questions', 'community', 'help'],
    user_id: 'default_user',
    created_at: '2024-01-06T13:30:00Z',
    updated_at: '2024-01-06T13:30:00Z',
  },
  {
    id: '11',
    title: 'Notion',
    url: 'https://notion.so/',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases.',
    category: BOOKMARK_CATEGORIES.WORK,
    tags: ['productivity', 'notes', 'workspace', 'organization'],
    user_id: 'default_user',
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z',
  },
  {
    id: '12',
    title: 'YouTube',
    url: 'https://youtube.com/',
    description: 'Share your videos with friends, family, and the world.',
    category: BOOKMARK_CATEGORIES.ENTERTAINMENT,
    tags: ['videos', 'streaming', 'content'],
    user_id: 'default_user',
    created_at: '2024-01-04T15:20:00Z',
    updated_at: '2024-01-04T15:20:00Z',
  },
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Mock API functions
export const api = {
  bookmarks: {
    // Get all bookmarks with optional filtering and pagination
    getAll: async ({ category, search, tags, page = 1, pageSize = 20 } = {}) => {
      await delay(300); // Simulate network delay

      let filtered = [...MOCK_BOOKMARKS];

      // Filter by category
      if (category && category !== 'all') {
        filtered = filtered.filter(bookmark => bookmark.category === category);
      }

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(bookmark =>
          bookmark.title.toLowerCase().includes(searchLower) ||
          bookmark.description?.toLowerCase().includes(searchLower) ||
          bookmark.url.toLowerCase().includes(searchLower) ||
          bookmark.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Filter by tags
      if (tags && tags.length > 0) {
        filtered = filtered.filter(bookmark =>
          tags.some(tag => bookmark.tags.includes(tag))
        );
      }

      // Sort by updated_at (most recent first)
      filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      // Pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const bookmarks = filtered.slice(startIndex, endIndex);

      return {
        bookmarks,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      };
    },

    // Get a single bookmark by ID
    getById: async (id) => {
      await delay(200);
      const bookmark = MOCK_BOOKMARKS.find(b => b.id === id);
      if (!bookmark) {
        throw new Error('Bookmark not found');
      }
      return bookmark;
    },

    // Create a new bookmark
    create: async (bookmarkData) => {
      await delay(400);
      
      // Validate required fields
      if (!bookmarkData.title || !bookmarkData.url) {
        throw new Error('Title and URL are required');
      }

      const newBookmark = {
        id: generateId(),
        ...bookmarkData,
        tags: bookmarkData.tags || [],
        user_id: 'default_user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      MOCK_BOOKMARKS.unshift(newBookmark);
      return newBookmark;
    },

    // Update an existing bookmark
    update: async (id, updateData) => {
      await delay(400);
      
      const index = MOCK_BOOKMARKS.findIndex(b => b.id === id);
      if (index === -1) {
        throw new Error('Bookmark not found');
      }

      const updatedBookmark = {
        ...MOCK_BOOKMARKS[index],
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      MOCK_BOOKMARKS[index] = updatedBookmark;
      return updatedBookmark;
    },

    // Delete a bookmark
    delete: async (id) => {
      await delay(300);
      
      const index = MOCK_BOOKMARKS.findIndex(b => b.id === id);
      if (index === -1) {
        throw new Error('Bookmark not found');
      }

      MOCK_BOOKMARKS.splice(index, 1);
      return { success: true };
    },
  },

  // Get all available categories
  categories: {
    getAll: async () => {
      await delay(100);
      return Object.values(BOOKMARK_CATEGORIES);
    },
  },

  // Get statistics
  stats: {
    getOverview: async () => {
      await delay(200);
      
      const totalBookmarks = MOCK_BOOKMARKS.length;
      const categoryCounts = {};
      
      Object.values(BOOKMARK_CATEGORIES).forEach(category => {
        categoryCounts[category] = MOCK_BOOKMARKS.filter(b => b.category === category).length;
      });

      const recentBookmarks = MOCK_BOOKMARKS
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