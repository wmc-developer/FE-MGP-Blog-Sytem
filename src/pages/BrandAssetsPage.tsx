import { useEffect, useState } from 'react';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../lib/api';
import type { Document } from '../types';
import RichEditor from '../components/RichEditor';

type View = 'list' | 'new' | 'read' | 'edit';

export default function BrandAssetsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<View>('list');
  const [active, setActive] = useState<Document | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getDocuments()
      .then(setDocs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function openNew() {
    setFormTitle('');
    setFormContent('');
    setFormError('');
    setActive(null);
    setView('new');
  }

  function openRead(doc: Document) {
    setActive(doc);
    setView('read');
  }

  function openEdit(doc: Document) {
    setFormTitle(doc.title);
    setFormContent(doc.content);
    setFormError('');
    setActive(doc);
    setView('edit');
  }

  async function handleAdd(e: React.SyntheticEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const doc = await addDocument({ title: formTitle, content: formContent });
      setDocs(prev => [doc, ...prev]);
      setView('list');
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!active) return;
    setSaving(true);
    setFormError('');
    try {
      const doc = await updateDocument(active.id, { title: formTitle, content: formContent });
      setDocs(prev => prev.map(d => d.id === doc.id ? doc : d));
      setActive(doc);
      setView('read');
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this asset?')) return;
    try {
      await deleteDocument(id);
      setDocs(prev => prev.filter(d => d.id !== id));
      setView('list');
      setActive(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <h1>Brand Assets</h1>
          <p>{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="btn-row">
          {view !== 'list' && (
            <button className="btn-secondary" onClick={() => setView('list')}>Back</button>
          )}
          {view === 'list' && (
            <button className="btn-primary" onClick={openNew}>+ New Asset</button>
          )}
        </div>
      </div>

      {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

      {/* LIST */}
      {view === 'list' && (
        loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : docs.length === 0 ? (
          <div className="empty-state">
            <p>No brand assets yet. Add your first one.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {docs.map(doc => (
              <div key={doc.id} className="post-card" style={{ cursor: 'pointer' }} onClick={() => openRead(doc)}>
                <div className="post-card-info">
                  <span className="post-card-title">{doc.title}</span>
                  <div className="post-card-meta">
                    <span className="meta-date">{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="btn-danger" onClick={e => { e.stopPropagation(); handleDelete(doc.id); }}>Delete</button>
              </div>
            ))}
          </div>
        )
      )}

      {/* NEW */}
      {view === 'new' && (
        <div className="card">
          <form onSubmit={handleAdd} className="form">
            <div className="field">
              <label>Title *</label>
              <input
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                required
                placeholder="e.g. Brand Voice, Logo Guidelines…"
              />
            </div>
            <div className="field">
              <label>Content *</label>
              <RichEditor content={formContent} onChange={setFormContent} placeholder="Write your brand asset content…" />
            </div>
            {formError && <p className="error-msg">{formError}</p>}
            <div className="btn-row">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? <><span className="spinner" /> Saving…</> : 'Save Asset'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* READ */}
      {view === 'read' && active && (
        <>
          <div className="page-header" style={{ marginBottom: '1rem' }}>
            <div className="page-title" style={{ flex: 1 }}>
              <h2 style={{ margin: 0 }}>{active.title}</h2>
              <span className="meta-date">{new Date(active.created_at).toLocaleDateString()}</span>
            </div>
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => openEdit(active)}>Edit</button>
              <button className="btn-danger" onClick={() => handleDelete(active.id)}>Delete</button>
            </div>
          </div>
          <div className="card">
            <div className="rich-view" dangerouslySetInnerHTML={{ __html: active.content }} />
          </div>
        </>
      )}

      {/* EDIT */}
      {view === 'edit' && active && (
        <div className="card">
          <form onSubmit={handleUpdate} className="form">
            <div className="field">
              <label>Title *</label>
              <input
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Content *</label>
              <RichEditor content={formContent} onChange={setFormContent} />
            </div>
            {formError && <p className="error-msg">{formError}</p>}
            <div className="btn-row">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? <><span className="spinner" /> Saving…</> : 'Update Asset'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setView('read')}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
