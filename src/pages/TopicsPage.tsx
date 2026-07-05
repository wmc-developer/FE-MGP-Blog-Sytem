import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { generateTopics } from '../lib/api';
import type { TopicSuggestion } from '../types';
import './TopicsPage.css';

export default function TopicsPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  async function handleFetch() {
    setLoading(true);
    setError('');
    try {
      const res = await generateTopics();
      setTopics(res.topics);
      setFetched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function useTopicForOutline(title: string) {
    navigate(`/outline?title=${encodeURIComponent(title)}`);
  }

  function handleDownloadPdf() {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    function ensureSpace(needed: number) {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    }

    function addWrapped(
      text: string,
      fontSize: number,
      fontStyle: 'normal' | 'bold' | 'italic',
      color: [number, number, number],
      lineGap = 4,
    ) {
      doc.setFont('helvetica', fontStyle);
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize * 1.25;
      for (const line of lines) {
        ensureSpace(lineHeight);
        doc.text(line, margin, y);
        y += lineHeight;
      }
      y += lineGap;
    }

    // Title
    addWrapped('MGP Blog — Topic Ideas', 22, 'bold', [17, 24, 39], 2);
    addWrapped(
      `Generated ${new Date().toLocaleString()}`,
      10,
      'normal',
      [107, 114, 128],
      12,
    );

    const sections: { label: string; items: TopicSuggestion[] }[] = [
      { label: 'Hot right now — based on this week’s news', items: hotTopics },
      { label: 'Content gaps — topics not yet covered', items: regularTopics },
    ];

    for (const section of sections) {
      if (section.items.length === 0) continue;
      ensureSpace(30);
      addWrapped(section.label, 13, 'bold', [37, 99, 235], 6);

      section.items.forEach((t, i) => {
        ensureSpace(40);
        addWrapped(`${i + 1}. ${t.title}`, 13, 'bold', [17, 24, 39], 2);
        addWrapped(t.why, 11, 'normal', [55, 65, 81], 4);
        if (t.isHot) {
          if (t.newsSource) {
            addWrapped(`Source: ${t.newsSource}`, 9, 'italic', [107, 114, 128], 1);
          }
          if (t.newsHeadline) {
            addWrapped(`Headline: ${t.newsHeadline}`, 9, 'italic', [107, 114, 128], 1);
          }
          if (t.newsUrl) {
            addWrapped(t.newsUrl, 9, 'normal', [37, 99, 235], 1);
          }
        }
        y += 8;
      });
    }

    const stamp = new Date().toISOString().slice(0, 10);
    doc.save(`mgp-topic-ideas-${stamp}.pdf`);
  }

  const hotTopics = topics.filter((t) => t.isHot);
  const regularTopics = topics.filter((t) => !t.isHot);

  return (
    <div className="topics-page">
      <div className="topics-hero">
        <div className="topics-badge">Topic Ideas</div>
        <h1 className="topics-title">What should MGP write about next?</h1>
        <p className="topics-sub">
          Checks your existing posts and scans live Australian property news — then suggests 5 fresh topics
          you haven't covered yet, including hot topics tied to this week's news.
        </p>
        <button
          className="topics-fetch-btn"
          onClick={handleFetch}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="topics-spinner" />
              Scanning news &amp; past posts…
            </>
          ) : fetched ? (
            'Refresh ideas'
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              Get topic ideas
            </>
          )}
        </button>

      </div>

      {error && <div className="topics-error">{error}</div>}

      {topics.length > 0 && (
        <div className="topics-results">
          <div className="topics-download-bar">
            <div className="topics-download-info">
              <span className="topics-download-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
              </span>
              <div className="topics-download-text">
                <span className="topics-download-title">Export topic report</span>
                <span className="topics-download-sub">
                  {topics.length} topic{topics.length === 1 ? '' : 's'} with reasoning &amp; news sources as a PDF
                </span>
              </div>
            </div>
            <button className="topics-download-btn" onClick={handleDownloadPdf}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
          </div>

          {hotTopics.length > 0 && (
            <section className="topics-section">
              <div className="topics-section-label hot">
                <span className="hot-flame">🔥</span> Hot right now — based on this week's news
              </div>
              <div className="topics-grid">
                {hotTopics.map((t, i) => (
                  <TopicCard key={i} topic={t} onOutline={useTopicForOutline} />
                ))}
              </div>
            </section>
          )}

          {regularTopics.length > 0 && (
            <section className="topics-section">
              <div className="topics-section-label">
                Content gaps — topics not yet covered
              </div>
              <div className="topics-grid">
                {regularTopics.map((t, i) => (
                  <TopicCard key={i} topic={t} onOutline={useTopicForOutline} />
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}

function TopicCard({
  topic,
  onOutline,
}: {
  topic: TopicSuggestion;
  onOutline: (title: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(topic.title);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className={`topic-card ${topic.isHot ? 'topic-card--hot' : ''}`}>
      {topic.isHot && (
        <div className="topic-hot-badge">
          🔥 Hot — {topic.newsSource}
        </div>
      )}
      {topic.isHot && topic.newsHeadline && (
        <div className="topic-card-headline">
          {topic.newsUrl ? (
            <a href={topic.newsUrl} target="_blank" rel="noopener noreferrer">
              {topic.newsHeadline}
            </a>
          ) : (
            topic.newsHeadline
          )}
        </div>
      )}
      <h3 className="topic-card-title">{topic.title}</h3>
      <p className="topic-card-why">{topic.why}</p>
      <div className="topic-card-actions">
        <button className="topic-btn topic-btn--outline" onClick={() => onOutline(topic.title)}>
          Start outline
        </button>
        <button className="topic-btn topic-btn--generate" onClick={handleCopy}>
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
