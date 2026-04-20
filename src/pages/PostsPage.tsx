import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost, savePost } from '../lib/api';
import type { Post } from '../types';
import RichEditor from '../components/RichEditor';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleAdd(e: React.SyntheticEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const post = await savePost({ title: newTitle, content: newContent });
      setPosts(prev => [post, ...prev]);
      setNewTitle('');
      setNewContent('');
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Saved Posts</h1>
          <p>{posts.length} post{posts.length !== 1 ? 's' : ''} saved</p>
        </div>
        <div className="btn-row">
          <button className="btn-secondary" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancel' : 'Add Post'}
          </button>
          <Link to="/generate" className="btn btn-primary">Generate with AI</Link>
        </div>
      </div>

      {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={handleAdd} className="form">
            <div className="field">
              <label>Title *</label>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                placeholder="Post title"
              />
            </div>
            <div className="field">
              <label>Content *</label>
              <RichEditor
                content={newContent}
                onChange={setNewContent}
                placeholder="Write your post content here…"
              />
            </div>
            {formError && <p className="error-msg">{formError}</p>}
            <div className="btn-row">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? <><span className="spinner" /> Saving…</> : 'Save Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. <Link to="/generate">Generate your first one</Link>.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-card-info">
                <Link to={`/posts/${post.id}`} className="post-card-title">{post.title}</Link>
                <div className="post-card-meta">
                  <span className="meta-date">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
