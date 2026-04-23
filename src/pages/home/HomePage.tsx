import { Link, useNavigate } from 'react-router-dom';
import GenerateDemo from './GenerateDemo';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-hero hero-stage">
        <div className="hero-blobs">
          <svg className="hero-blob b1" width="320" height="320" viewBox="0 0 200 200">
            <path fill="#6366f1" d="M40,-60C52,-52,62,-42,68,-29C74,-16,76,-1,72,12C68,25,58,37,45,48C32,59,16,69,0,69C-16,69,-32,59,-46,48C-60,37,-72,25,-74,11C-76,-3,-68,-17,-58,-28C-48,-39,-36,-47,-24,-55C-12,-63,0,-71,13,-72C26,-73,38,-68,40,-60Z" transform="translate(100 100)" />
          </svg>
          <svg className="hero-blob b2" width="280" height="280" viewBox="0 0 200 200">
            <path fill="#a855f7" d="M45,-70C56,-60,60,-43,65,-27C70,-11,77,4,74,18C71,32,58,45,44,55C30,65,15,72,-1,73C-17,74,-34,69,-46,58C-58,47,-65,30,-68,13C-71,-4,-70,-22,-62,-35C-54,-48,-39,-56,-25,-62C-11,-68,2,-72,14,-72C26,-72,34,-80,45,-70Z" transform="translate(100 100)" />
          </svg>
          <svg className="hero-blob b3" width="300" height="300" viewBox="0 0 200 200">
            <path fill="#ec4899" d="M38,-58C48,-48,54,-35,61,-22C68,-9,76,5,73,17C70,29,57,39,45,49C33,59,20,69,5,70C-10,71,-25,63,-39,54C-53,45,-65,35,-70,21C-75,7,-73,-11,-66,-26C-59,-41,-47,-53,-34,-61C-21,-69,-6,-73,6,-72C18,-71,28,-68,38,-58Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="home-header">
          <div className="home-badge">
            <span className="home-badge-dot" />
            MGP Blog Studio
          </div>
          <h1 className="home-title hero-title-anim">
            Blog posts in the MGP voice — on demand.
          </h1>
        </div>

        <div className="home-split">
          <div className="home-split-left">
            <p className="home-sub">
              Add MGP's brand assets and guidelines once. Then just pick a topic —
              the AI drafts a full blog post that sounds like MGP, every time.
              Polished, on-brand, ready to publish.
            </p>

            <div className="hero-btn-wrap home-cta-single">
              <button type="button" className="home-cta-btn home-cta-big" onClick={() => navigate('/generate')}>
                Ready to Generate
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="home-quick-links">
              <Link to="/posts" className="home-quick-link">View saved posts</Link>
              <Link to="/guidelines" className="home-quick-link">Guidelines</Link>
              <Link to="/brand-assets" className="home-quick-link">Brand assets</Link>
            </div>
          </div>

          <div className="home-split-right">
            <GenerateDemo />
          </div>
        </div>
      </div>

      <div className="home-features">
        <div className="home-feature">
          <div className="home-feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>
          <h3>Built for MGP's voice</h3>
          <p>Uses your past posts, style guidelines, and brand documents so every draft sounds like MGP.</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>Refine with a chat</h3>
          <p>Shorten, switch tone, add a CTA, rewrite a section — just tell the AI what you want.</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h6v6H9z"/>
            </svg>
          </div>
          <h3>Library that learns</h3>
          <p>Every saved post joins the reference library — the more you publish, the sharper the AI gets.</p>
        </div>
      </div>
    </div>
  );
}
