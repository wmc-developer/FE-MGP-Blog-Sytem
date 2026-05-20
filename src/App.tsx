import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import GeneratePage from './pages/GeneratePage';
import OutlinePage from './pages/OutlinePage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';
import GuidelinesPage from './pages/GuidelinesPage';
import BrandAssetsPage from './pages/BrandAssetsPage';
import TopicsPage from './pages/TopicsPage';
import { ServerWakeProvider } from './context/ServerWakeContext';
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
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/topics">Topic Ideas</NavLink>
        <NavLink to="/outline">Outline</NavLink>
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
      <ServerWakeProvider>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/outline" element={<OutlinePage />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/brand-assets" element={<BrandAssetsPage />} />
            <Route path="/topics" element={<TopicsPage />} />
          </Routes>
        </div>
      </div>
      </ServerWakeProvider>
    </BrowserRouter>
  );
}
