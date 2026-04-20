import { useEffect, useState } from 'react';
import { getGuidelines, addGuideline, deleteGuideline } from '../lib/api';
import type { Guideline } from '../types';
import RichEditor from '../components/RichEditor';

export default function GuidelinesPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Guideline | null>(null);

  useEffect(() => {
    getGuidelines()
      .then(setGuidelines)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPreview(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function handleAdd(e: React.SyntheticEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const g = await addGuideline({ title, content });
      setGuidelines(prev => [g, ...prev]);
      setTitle('');
      setContent('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this guideline?')) return;
    try {
      await deleteGuideline(id);
      setGuidelines(prev => prev.filter(g => g.id !== id));
      if (preview?.id === id) setPreview(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Guidelines</h1>
          <p>Rules the AI follows when writing posts</p>
        </div>
      </div>

      {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleAdd} className="form">
          <div className="field">
            <label>Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="e.g. Tone of Voice"
            />
          </div>
          <div className="field">
            <label>Content *</label>
            <RichEditor
              content={content}
              onChange={setContent}
              placeholder="Describe the guideline in detail…"
            />
          </div>
          <div className="btn-row">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" /> Adding…</> : '+ Add Guideline'}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
      ) : guidelines.length === 0 ? (
        <div className="empty-state">
          <p>No guidelines yet. Add one above.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {guidelines.map(g => (
            <div key={g.id} className="guideline-card" onClick={() => setPreview(g)} style={{ cursor: 'pointer' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="guideline-title">{g.title}</p>
                <p className="guideline-preview-hint">Click to preview</p>
              </div>
              <button className="btn-danger" onClick={e => { e.stopPropagation(); handleDelete(g.id); }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{preview.title}</h2>
              <button className="modal-close" onClick={() => setPreview(null)}>✕</button>
            </div>
            <div className="modal-body rich-view" dangerouslySetInnerHTML={{ __html: preview.content }} />
          </div>
        </div>
      )}
    </>
  );
}
