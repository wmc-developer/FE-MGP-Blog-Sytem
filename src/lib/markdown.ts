function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function markdownToHtml(src: string): string {
  if (/<\/?(p|h[1-6]|ul|ol|li|strong|em|blockquote|br|hr)\b/i.test(src)) {
    return src;
  }

  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let i = 0;
  let para: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      out.push(`<${list.type}>${list.items.map(it => `<li>${inline(it)}</li>`).join('')}</${list.type}>`);
      list = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushPara();
      flushList();
      i++;
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushPara();
      flushList();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^(\*\*|__).+(\*\*|__)$/.test(trimmed) && !/\s/.test(trimmed.slice(2, -2).trim()) === false) {
      const inner = trimmed.replace(/^(\*\*|__)|(\*\*|__)$/g, '');
      if (inner.length < 80) {
        flushPara();
        flushList();
        out.push(`<h3>${inline(inner)}</h3>`);
        i++;
        continue;
      }
    }

    const ul = trimmed.match(/^[-*]\s+(.*)$/);
    const ol = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const type = ul ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((ul ?? ol)![1]);
      i++;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushPara();
      flushList();
      out.push('<hr>');
      i++;
      continue;
    }

    flushList();
    para.push(trimmed);
    i++;
  }

  flushPara();
  flushList();
  return out.join('\n');
}
