const KEY = 'mgp_daily_generations';
export const DAILY_LIMIT = 2;

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function read(): { date: string; count: number } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { date: todayStr(), count: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayStr()) return { date: todayStr(), count: 0 };
    return parsed;
  } catch {
    return { date: todayStr(), count: 0 };
  }
}

export function getUsedToday(): number {
  return read().count;
}

export function isLimitReached(): boolean {
  return getUsedToday() >= DAILY_LIMIT;
}

export function incrementUsage(): void {
  const cur = read();
  localStorage.setItem(KEY, JSON.stringify({ date: cur.date, count: cur.count + 1 }));
}

const FUNNY_MESSAGES = [
  { emoji: '☕', title: "That's your two for today!", body: "You've used both of today's generations. Take a little break — fresh ones are waiting for you tomorrow." },
  { emoji: '🌙', title: "See you tomorrow!", body: "Today's 2 generations are all done. Your creativity refills at midnight — sweet dreams till then." },
  { emoji: '🎉', title: "Two posts, nicely done!", body: "You've made the most of today's limit. Come back tomorrow for two more fresh ideas." },
  { emoji: '🌱', title: "Give it a moment to grow.", body: "Both of today's generations are used up. A new batch will be ready for you tomorrow." },
  { emoji: '✨', title: "Daily limit reached.", body: "You've used today's 2 generations. Check back tomorrow — we'll be ready when you are." },
];

export function getLimitMessage() {
  return FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)];
}
