import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { pingUntilAlive } from '../lib/api';

const ServerWakeContext = createContext(false);

export function useServerReady() {
  return useContext(ServerWakeContext);
}

const steps = [
  { icon: '😴', text: 'AI agent is waking up from a nap…' },
  { icon: '☕', text: 'Brewing a coffee. Agents need caffeine too.' },
  { icon: '🧠', text: 'Loading neurons… 60% complete.' },
  { icon: '📚', text: 'Reading the internet real quick.' },
  { icon: '👔', text: 'Putting on a suit. Gotta look professional.' },
  { icon: '🚀', text: 'Almost there… agent is tying its shoelaces.' },
  { icon: '🎯', text: 'Final checks… making sure the AI looks smart.' },
];

export function ServerWakeProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    pingUntilAlive().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) return;
    const interval = setInterval(() => {
      setStepIndex(i => (i + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ready]);

  const step = steps[stepIndex];

  return (
    <ServerWakeContext.Provider value={ready}>
      {!ready && (
        <div className="server-wake-overlay">
          <div className="server-wake-box">
            <div className="server-wake-icon">{step.icon}</div>
            <p className="server-wake-title">{step.text}</p>
            <p className="server-wake-sub">Free-tier server waking up — usually takes 30–60 seconds.</p>
            <div className="server-wake-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}
      {children}
    </ServerWakeContext.Provider>
  );
}
