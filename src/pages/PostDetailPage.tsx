import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost, deletePost } from '../lib/api';
import type { Post } from '../types';
import RichEditor from '../components/RichEditor';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getPost(id)
      .then(p => { setPost(p); setTitle(p.title); setContent(p.content); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!id) return;
    setSaving(true);
    try {
      const updated = await updatePost(id, { title, content });
      setPost(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id || !confirm('Delete this post?')) return;
    await deletePost(id);
    navigate('/posts');
  }

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading…</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!post) return <p className="error-msg">Post not found.</p>;

  return (
    <>
      <div className="page-header">
        <div className="page-title" style={{ flex: 1 }}>
          {editing ? (
            <input
              className="title-edit"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          ) : (
            <h1>{post.title}</h1>
          )}
        </div>
        <div className="btn-row">
          {editing ? (
            <>
              <button className="btn-success" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="spinner" /> Saving…</> : 'Save'}
              </button>
              <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>

      <div className="detail-meta">
        <span className="meta-date">{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <div className="card">
        {editing ? (
          <RichEditor content={content} onChange={setContent} />
        ) : (
          <div
            className="rich-view"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </div>
    </>
  );
}
