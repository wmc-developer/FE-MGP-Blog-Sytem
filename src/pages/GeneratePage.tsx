import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generatePost, refinePost, savePost, getPostsCount, getDocuments } from '../lib/api';
import type { GenerateResponse, Document } from '../types';
import RichEditor from '../components/RichEditor';
import { markdownToHtml } from '../lib/markdown';
import { isLimitReached, incrementUsage, getLimitMessage } from '../lib/dailyLimit';

function normalize(res: GenerateResponse): GenerateResponse {
  return { ...res, content: markdownToHtml(res.content) };
}

export default function GeneratePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState(searchParams.get('title') ?? '');
  const [notes, setNotes] = useState('');
  const [recentPostsLimit, setRecentPostsLimit] = useState(3);
  const [maxPosts, setMaxPosts] = useState(0);
  const [docs, setDocs] = useState<Document[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [limitPopup, setLimitPopup] = useState<{ emoji: string; title: string; body: string } | null>(null);

  useEffect(() => {
    getPostsCount()
      .then(({ count }) => {
        setMaxPosts(count);
        setRecentPostsLimit(Math.min(3, count));
      })
      .catch(() => {});
    getDocuments().then(setDocs).catch(() => {});
  }, []);

  async function handleGenerate(e: React.SyntheticEvent) {
    e.preventDefault();
    if (isLimitReached()) {
      setLimitPopup(getLimitMessage());
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(normalize(await generatePost({ title, notes, recentPostsLimit, documentIds: selectedDocIds.length ? selectedDocIds : undefined })));
      incrementUsage();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefine(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!result) return;
    setRefining(true);
    setError('');
    try {
      setResult(normalize(await refinePost({ messages: result.messages, instruction })));
      setInstruction('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRefining(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    setError('');
    try {
      await savePost({ title: result.title, content: result.content, notes });
      navigate('/posts');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="gen-page">
      {!result && (
        <div className="gen-hero">
          <div className="gen-hero-badge">MGP Blogs — AI Writer</div>
          <h1 className="gen-hero-title">What do you want<br /><span className="gen-hero-accent">MGP</span> to write today?</h1>
          <p className="gen-hero-sub">Give your post a title and optional notes — AI handles the rest</p>
        </div>
      )}

      {error && <p className="error-msg gen-error">{error}</p>}

      {!result && (
        <form onSubmit={handleGenerate} className="gen-form">
          <div className="gen-topic-wrap">
            <input
              className="gen-topic-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Post title…"
            />
          </div>

          <div className="field">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any specific points, tone, or instructions for the AI…"
              rows={3}
            />
          </div>

          {maxPosts > 0 && (
            <div className="gen-context-row">
              <div className="gen-context-label">
                <span>Style reference</span>
                <span className="gen-context-hint">
                  {recentPostsLimit === 0
                    ? 'No previous posts used'
                    : `Using last ${recentPostsLimit} of ${maxPosts} posts as tone reference`}
                </span>
              </div>
              <div className="gen-context-stepper">
                <button
                  type="button"
                  onClick={() => setRecentPostsLimit(v => Math.max(0, v - 1))}
                  disabled={recentPostsLimit === 0}
                >−</button>
                <span className="gen-context-stepper-val">{recentPostsLimit}</span>
                <button
                  type="button"
                  onClick={() => setRecentPostsLimit(v => Math.min(maxPosts, v + 1))}
                  disabled={recentPostsLimit === maxPosts}
                >+</button>
              </div>
            </div>
          )}

          {docs.length > 0 && (
            <div className="gen-context-row">
              <div className="gen-context-label">
                <span>Brand Assets</span>
                <span className="gen-context-hint">
                  {selectedDocIds.length === 0 ? 'None selected' : `${selectedDocIds.length} document${selectedDocIds.length > 1 ? 's' : ''} selected`}
                </span>
              </div>
              <div className="gen-doc-pills">
                {docs.map(doc => {
                  const selected = selectedDocIds.includes(doc.id);
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      className={`gen-doc-pill${selected ? ' active' : ''}`}
                      onClick={() => setSelectedDocIds(prev =>
                        selected ? prev.filter(id => id !== doc.id) : [...prev, doc.id]
                      )}
                    >
                      {doc.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button type="submit" className="gen-submit-btn" disabled={loading}>
            {loading ? <><span className="spinner" /> Generating…</> : 'Generate Post'}
          </button>
        </form>
      )}

      {result && (
        <div className="gen-result">
          <div className="gen-result-header">
            <div>
              <div className="gen-result-label">Generated Post</div>
              <h2 className="gen-result-title">{result.title}</h2>
            </div>
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setResult(null)}>New Post</button>
              <button className="btn-success" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="spinner" /> Saving…</> : 'Save Post'}
              </button>
            </div>
          </div>

          <div className="gen-content-area">
            <RichEditor
              content={result.content}
              onChange={content => setResult(r => r ? { ...r, content } : r)}
              placeholder="Generated content will appear here…"
            />
          </div>

          <div className="gen-refine-bar">
            <form onSubmit={handleRefine} className="gen-refine-form">
              <span className="gen-refine-icon">AI</span>
              <input
                className="gen-refine-input"
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                placeholder="Ask AI to refine… e.g. make it shorter, add a CTA, change tone"
                required
              />
              <button type="submit" className="gen-refine-btn" disabled={refining}>
                {refining ? <span className="spinner" /> : 'Refine'}
              </button>
            </form>
          </div>
        </div>
      )}

      {limitPopup && (
        <div className="limit-modal-overlay" onClick={() => setLimitPopup(null)}>
          <div className="limit-modal" onClick={e => e.stopPropagation()}>
            <div className="limit-modal-emoji">{limitPopup.emoji}</div>
            <h3 className="limit-modal-title">{limitPopup.title}</h3>
            <p className="limit-modal-body">{limitPopup.body}</p>
            <button className="btn-primary" onClick={() => setLimitPopup(null)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
