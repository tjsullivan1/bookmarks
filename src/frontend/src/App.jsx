import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookmarkManager from './pages/BookmarkManager.jsx';
import { useTheme } from './hooks/useTheme.jsx';

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Navigate to bookmarks page when searching
    if (term && location.pathname !== '/bookmarks') {
      navigate('/bookmarks');
    }
  };

  const handleNewBookmark = () => {
    // Navigate to bookmarks page when adding new bookmark
    if (location.pathname !== '/bookmarks') {
      navigate('/bookmarks');
    }
  };

  return (
    <Layout
      onSearch={handleSearch}
      onNewBookmark={handleNewBookmark}
      searchValue={searchTerm}
    >
      <Routes>
        {/* Default route - show bookmarks manager as main page */}
        <Route path="/" element={<Navigate to="/bookmarks" replace />} />

        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Bookmarks management route */}
        <Route
          path="/bookmarks"
          element={
            <BookmarkManager
              searchTerm={searchTerm}
              onNewBookmark={handleNewBookmark}
            />
          }
        />

        {/* Catch all route - redirect to bookmarks */}
        <Route path="*" element={<Navigate to="/bookmarks" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={theme}>
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
