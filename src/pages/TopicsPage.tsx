import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateTopics } from '../lib/api';
import type { TopicSuggestion, NewsHeadline } from '../types';
import './TopicsPage.css';

export default function TopicsPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [headlines, setHeadlines] = useState<NewsHeadline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  async function handleFetch() {
    setLoading(true);
    setError('');
    try {
      const res = await generateTopics();
      setTopics(res.topics);
      setHeadlines(res.newsHeadlines);
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

const hotTopics = topics.filter((t) => t.isHot);
  const regularTopics = topics.filter((t) => !t.isHot);
  const sourcesUsed = [...new Set(headlines.map((h) => h.source))];

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

        {sourcesUsed.length > 0 && (
          <p className="topics-sources-line">
            Live news from: {sourcesUsed.join(' · ')}
          </p>
        )}
      </div>

      {error && <div className="topics-error">{error}</div>}

      {topics.length > 0 && (
        <div className="topics-results">
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

          {headlines.length > 0 && (
            <details className="topics-news-drawer">
              <summary>View {headlines.length} news headlines used</summary>
              <ul className="topics-news-list">
                {headlines.map((h, i) => (
                  <li key={i}>
                    <span className="topics-news-source">{h.source}</span>
                    {h.title}
                  </li>
                ))}
              </ul>
            </details>
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
