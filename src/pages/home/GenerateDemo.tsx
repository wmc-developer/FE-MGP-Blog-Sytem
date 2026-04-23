import './GenerateDemo.css';

export default function GenerateDemo() {
  return (
    <div className="demo-wrap" aria-hidden="true">
      <svg className="demo-svg" viewBox="0 0 520 440" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="demoBtn" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="demoCard" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2230" />
            <stop offset="100%" stopColor="#151822" />
          </linearGradient>
          <linearGradient id="assetBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="assetPink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
          <linearGradient id="assetGreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <filter id="demoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Brand asset cards flying into the generator */}
        <g className="demo-asset a1">
          <rect width="72" height="86" rx="8" fill="url(#assetBlue)" />
          <rect x="10" y="12" width="40" height="5" rx="2" fill="rgba(255,255,255,0.6)" />
          <rect x="10" y="24" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <rect x="10" y="32" width="48" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <rect x="10" y="40" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <text x="36" y="74" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600" fontFamily="system-ui" textAnchor="middle">BRAND KIT</text>
        </g>
        <g className="demo-asset a2">
          <rect width="72" height="86" rx="8" fill="url(#assetPink)" />
          <rect x="10" y="12" width="40" height="5" rx="2" fill="rgba(255,255,255,0.6)" />
          <rect x="10" y="24" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <rect x="10" y="32" width="48" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <rect x="10" y="40" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <text x="36" y="74" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600" fontFamily="system-ui" textAnchor="middle">GUIDELINES</text>
        </g>
        <g className="demo-asset a3">
          <rect width="72" height="86" rx="8" fill="url(#assetGreen)" />
          <rect x="10" y="12" width="40" height="5" rx="2" fill="rgba(255,255,255,0.6)" />
          <rect x="10" y="24" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <rect x="10" y="32" width="48" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <rect x="10" y="40" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
          <text x="36" y="74" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="600" fontFamily="system-ui" textAnchor="middle">TONE</text>
        </g>

        {/* Central generator machine */}
        <g className="demo-machine">
          <rect x="160" y="70" width="200" height="90" rx="16" fill="#1a1d26" stroke="#2a2f3d" />
          <text x="260" y="96" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="system-ui" letterSpacing="1.5" textAnchor="middle">TOPIC</text>
          <text x="260" y="125" fill="#e2e8f0" fontSize="14" fontWeight="500" fontFamily="system-ui" textAnchor="middle">
            <tspan className="demo-typed">What MGP can do for you</tspan>
          </text>
          <rect x="180" y="135" width="160" height="2" rx="1" fill="#2a2f3d" className="demo-underline" />
        </g>

        {/* Generate button */}
        <g className="demo-btn">
          <rect className="demo-btn-glow" x="200" y="180" width="120" height="46" rx="12" fill="url(#demoBtn)" filter="url(#demoShadow)" opacity="0.5" />
          <rect x="200" y="180" width="120" height="46" rx="12" fill="url(#demoBtn)" />
          <text x="260" y="209" fill="white" fontSize="14" fontWeight="600" fontFamily="system-ui" textAnchor="middle">
            Generate
          </text>
          <circle className="demo-ripple" cx="260" cy="203" r="8" fill="none" stroke="#fff" strokeWidth="2" opacity="0" />
        </g>

        {/* Output post card */}
        <g className="demo-card">
          <rect x="70" y="260" width="380" height="160" rx="14" fill="url(#demoCard)" stroke="#2a2f3d" />
          <circle cx="94" cy="286" r="6" fill="#22c55e" />
          <text x="110" y="291" fill="#22c55e" fontSize="11" fontWeight="600" fontFamily="system-ui" letterSpacing="0.5">
            MGP BLOG POST
          </text>
          <rect x="90" y="300" width="180" height="12" rx="3" fill="#e2e8f0" opacity="0.9" className="demo-title-bar" />

          <rect className="demo-line l1" x="90" y="326" width="0" height="8" rx="2" fill="#94a3b8" />
          <rect className="demo-line l2" x="90" y="344" width="0" height="8" rx="2" fill="#64748b" />
          <rect className="demo-line l3" x="90" y="362" width="0" height="8" rx="2" fill="#64748b" />
          <rect className="demo-line l4" x="90" y="380" width="0" height="8" rx="2" fill="#64748b" />
          <rect className="demo-line l5" x="90" y="398" width="0" height="8" rx="2" fill="#475569" />
        </g>

        {/* Sparkles */}
        <g className="demo-sparks">
          <path className="spark s1" d="M50 250 l4 -4 l4 4 l-4 4 z" fill="#a855f7" />
          <path className="spark s2" d="M470 270 l5 -5 l5 5 l-5 5 z" fill="#60a5fa" />
          <path className="spark s3" d="M460 410 l4 -4 l4 4 l-4 4 z" fill="#ec4899" />
        </g>
      </svg>
    </div>
  );
}
