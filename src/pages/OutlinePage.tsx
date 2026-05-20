import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateOutline, refineOutline, getPostsCount, getDocuments, getPosts } from '../lib/api';
import type { Document, Post, ChatMessage, OutlinePoint } from '../types';
import { isLimitReached, incrementUsage, getLimitMessage } from '../lib/dailyLimit';

type EditTarget = { mainIdx: number; subIdx: number | null } | null;

export default function OutlinePage() {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState(searchParams.get('title') ?? '');
  const [notes, setNotes] = useState('');
  const [recentPostsLimit, setRecentPostsLimit] = useState(3);
  const [maxPosts, setMaxPosts] = useState(0);
  const [docs, setDocs] = useState<Document[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [pastPosts, setPastPosts] = useState<Post[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  const [outline, setOutline] = useState<OutlinePoint[] | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [instruction, setInstruction] = useState('');
  const [editing, setEditing] = useState<EditTarget>(null);
  const [editingValue, setEditingValue] = useState('');

  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState('');
  const [limitPopup, setLimitPopup] = useState<{ emoji: string; title: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getPostsCount()
      .then(({ count }) => {
        setMaxPosts(count);
        setRecentPostsLimit(Math.min(3, count));
      })
      .catch(() => {});
    getDocuments().then(setDocs).catch(() => {});
    getPosts().then(setPastPosts).catch(() => {});
  }, []);

  async function handleGenerate(e: React.SyntheticEvent) {
    e.preventDefault();
    if (isLimitReached()) {
      setLimitPopup(getLimitMessage());
      return;
    }
    setLoading(true);
    setError('');
    setOutline(null);
    try {
      const res = await generateOutline({
        title,
        notes,
        recentPostsLimit,
        documentIds: selectedDocIds.length ? selectedDocIds : undefined,
        specificPostIds: selectedPostIds.length ? selectedPostIds : undefined,
      });
      setOutline(res.outline);
      setMessages(res.messages);
      incrementUsage();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function serializeOutline(o: OutlinePoint[]): string {
    return o
      .map((p, i) => {
        const subs = p.subs.map((s, j) => `   ${i + 1}.${j + 1} ${s}`).join('\n');
        return `${i + 1}. ${p.main}${subs ? '\n' + subs : ''}`;
      })
      .join('\n');
  }

  async function handleRefine(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!outline) return;
    setRefining(true);
    setError('');
    try {
      const currentBulletsMsg: ChatMessage = {
        role: 'user',
        content: `Current outline (after my edits):\n${serializeOutline(outline)}`,
      };
      const res = await refineOutline({
        messages: [...messages, currentBulletsMsg],
        instruction,
      });
      setOutline(res.outline);
      setMessages(res.messages);
      setInstruction('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRefining(false);
    }
  }

  function startEdit(mainIdx: number, subIdx: number | null) {
    if (!outline) return;
    setEditing({ mainIdx, subIdx });
    setEditingValue(subIdx === null ? outline[mainIdx].main : outline[mainIdx].subs[subIdx]);
  }
  function commitEdit() {
    if (!editing || !outline) return;
    const next = outline.map((p, i) => {
      if (i !== editing.mainIdx) return p;
      if (editing.subIdx === null) return { ...p, main: editingValue.trim() };
      const subs = p.subs.map((s, j) => (j === editing.subIdx ? editingValue.trim() : s));
      return { ...p, subs };
    });
    // Drop empty mains/subs
    const cleaned = next
      .filter(p => p.main.length > 0)
      .map(p => ({ ...p, subs: p.subs.filter(s => s.length > 0) }));
    setOutline(cleaned);
    setEditing(null);
    setEditingValue('');
  }
  function cancelEdit() {
    setEditing(null);
    setEditingValue('');
  }

  function deleteMain(mainIdx: number) {
    if (!outline) return;
    setOutline(outline.filter((_, i) => i !== mainIdx));
  }
  function deleteSub(mainIdx: number, subIdx: number) {
    if (!outline) return;
    setOutline(outline.map((p, i) =>
      i === mainIdx ? { ...p, subs: p.subs.filter((_, j) => j !== subIdx) } : p
    ));
  }
  function addMain() {
    setOutline([...(outline ?? []), { main: 'New main point — click to edit', subs: [] }]);
  }
  function addSub(mainIdx: number) {
    if (!outline) return;
    setOutline(outline.map((p, i) =>
      i === mainIdx ? { ...p, subs: [...p.subs, 'New sub-point — click to edit'] } : p
    ));
  }

  async function handleCopy() {
    if (!outline || outline.length === 0) return;
    try {
      await navigator.clipboard.writeText(serializeOutline(outline));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard');
    }
  }

  const isEditing = (mainIdx: number, subIdx: number | null) =>
    editing?.mainIdx === mainIdx && editing?.subIdx === subIdx;

  return (
    <div className="gen-page">
      {!outline && (
        <div className="gen-hero">
          <div className="gen-hero-badge">MGP Blogs — Outline</div>
          <h1 className="gen-hero-title">Sense-check the <span className="gen-hero-accent">angle</span> first</h1>
          <p className="gen-hero-sub">Generate a structured outline — main points with sub-point detail — then write the full post</p>
        </div>
      )}

      {error && <p className="error-msg gen-error">{error}</p>}

      {!outline && (
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

          {pastPosts.length > 0 && (
            <div className="gen-context-row">
              <div className="gen-context-label">
                <span>Specific posts (source material)</span>
                <span className="gen-context-hint">
                  {selectedPostIds.length === 0 ? 'None selected' : `${selectedPostIds.length} post${selectedPostIds.length > 1 ? 's' : ''} selected as source`}
                </span>
              </div>
              <div className="gen-doc-pills">
                {pastPosts.map(post => {
                  const selected = selectedPostIds.includes(post.id);
                  return (
                    <button
                      key={post.id}
                      type="button"
                      className={`gen-doc-pill${selected ? ' active' : ''}`}
                      onClick={() => setSelectedPostIds(prev =>
                        selected ? prev.filter(id => id !== post.id) : [...prev, post.id]
                      )}
                    >
                      {post.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                <button type="button" onClick={() => setRecentPostsLimit(v => Math.max(0, v - 1))} disabled={recentPostsLimit === 0}>−</button>
                <span className="gen-context-stepper-val">{recentPostsLimit}</span>
                <button type="button" onClick={() => setRecentPostsLimit(v => Math.min(maxPosts, v + 1))} disabled={recentPostsLimit === maxPosts}>+</button>
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
            {loading ? <><span className="spinner" /> Generating outline…</> : 'Generate Outline'}
          </button>
        </form>
      )}

      {outline && (
        <div className="gen-result">
          <div className="gen-result-header">
            <div>
              <div className="gen-result-label">Outline — sense-check before writing</div>
              <h2 className="gen-result-title">{title}</h2>
            </div>
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => { setOutline(null); setMessages([]); }}>Start Over</button>
              <button className="btn-success" onClick={handleCopy} disabled={outline.length === 0}>
                {copied ? 'Copied ✓' : 'Copy Outline'}
              </button>
            </div>
          </div>

          <ol className="outline-list">
            {outline.map((point, mIdx) => (
              <li key={mIdx} className="outline-main">
                <div className="outline-item">
                  <span className="outline-num">{mIdx + 1}</span>
                  {isEditing(mIdx, null) ? (
                    <textarea
                      className="outline-edit"
                      value={editingValue}
                      onChange={e => setEditingValue(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      rows={2}
                    />
                  ) : (
                    <button className="outline-text outline-text-main" onClick={() => startEdit(mIdx, null)} title="Click to edit">
                      {point.main}
                    </button>
                  )}
                  <button className="outline-delete" onClick={() => deleteMain(mIdx)} title="Remove main point">×</button>
                </div>

                <ul className="outline-subs">
                  {point.subs.map((sub, sIdx) => (
                    <li key={sIdx} className="outline-item outline-sub">
                      <span className="outline-sub-marker">{mIdx + 1}.{sIdx + 1}</span>
                      {isEditing(mIdx, sIdx) ? (
                        <textarea
                          className="outline-edit"
                          value={editingValue}
                          onChange={e => setEditingValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          autoFocus
                          rows={2}
                        />
                      ) : (
                        <button className="outline-text" onClick={() => startEdit(mIdx, sIdx)} title="Click to edit">
                          {sub}
                        </button>
                      )}
                      <button className="outline-delete" onClick={() => deleteSub(mIdx, sIdx)} title="Remove sub-point">×</button>
                    </li>
                  ))}
                  <li>
                    <button type="button" className="outline-add outline-add-sub" onClick={() => addSub(mIdx)}>+ Add sub-point</button>
                  </li>
                </ul>
              </li>
            ))}
          </ol>

          <button type="button" className="outline-add" onClick={addMain}>+ Add main point</button>

          <div className="gen-refine-bar">
            <form onSubmit={handleRefine} className="gen-refine-form">
              <span className="gen-refine-icon">AI</span>
              <input
                className="gen-refine-input"
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                placeholder="Refine outline… e.g. add a sub-point under 2 about timing, drop point 3, sharpen the contrast"
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
