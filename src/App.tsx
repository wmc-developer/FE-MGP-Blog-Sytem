import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import GeneratePage from './pages/GeneratePage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';
import GuidelinesPage from './pages/GuidelinesPage';
import BrandAssetsPage from './pages/BrandAssetsPage';
import './App.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">M</div>
        <div>
          <div className="brand-name">MGP Blogs</div>
          <div className="brand-sub">AI Writer</div>
        </div>
      </div>

      <div className="nav-section-label">Menu</div>
      <nav className="nav-links">
        <NavLink to="/generate">Generate</NavLink>
        <NavLink to="/posts">Posts</NavLink>
        <NavLink to="/guidelines">Guidelines</NavLink>
        <NavLink to="/brand-assets">Brand Assets</NavLink>
      </nav>

      <div className="sidebar-footer">MGP © 2025</div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/generate" replace />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/brand-assets" element={<BrandAssetsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
