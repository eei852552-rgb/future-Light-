const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

const keywords = new Set('const let var function return if else for while new class extends import from export async await try catch throw true false null undefined this public private color background display grid flex margin padding border width height font-size'.split(' '));

function tokenClass(word) {
  if (/^\d/.test(word)) return 'tok-number';
  if (keywords.has(word)) return 'tok-keyword';
  if (/^(log|querySelector|addEventListener|map|filter|setTimeout)$/.test(word)) return 'tok-function';
  return '';
}

function highlightGeneric(code) {
  let html = '';
  let i = 0;
  while (i < code.length) {
    const two = code.slice(i, i + 2);
    if (two === '//' || two === '/*') {
      const end = two === '//' ? code.indexOf('\n', i) : code.indexOf('*/', i + 2);
      const stop = end < 0 ? code.length : (two === '//' ? end : end + 2);
      html += `<span class="tok-comment">${escapeHtml(code.slice(i, stop))}</span>`;
      i = stop;
      continue;
    }
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i]; let j = i + 1;
      while (j < code.length) { if (code[j] === '\\') j += 2; else if (code[j] === quote) { j += 1; break; } else j += 1; }
      html += `<span class="tok-string">${escapeHtml(code.slice(i, j))}</span>`;
      i = j;
      continue;
    }
    const match = code.slice(i).match(/^[A-Za-z_$][\w$-]*|^\d+(?:\.\d+)?/);
    if (match) {
      const word = match[0];
      const cls = tokenClass(word);
      html += cls ? `<span class="${cls}">${escapeHtml(word)}</span>` : escapeHtml(word);
      i += word.length;
      continue;
    }
    html += escapeHtml(code[i]);
    i += 1;
  }
  return html;
}

function highlightHtml(code) {
  let html = escapeHtml(code);
  html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-comment">$1</span>');
  html = html.replace(/(&lt;\/?)([\w:-]+)([\s\S]*?)(\/??&gt;)/g, (_, open, tag, attrs, close) => {
    const coloredAttrs = attrs.replace(/([\w:-]+)(=)(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="tok-attr">$1</span>$2<span class="tok-string">$3</span>');
    return `<span class="tok-punct">${open}</span><span class="tok-tag">${tag}</span>${coloredAttrs}<span class="tok-punct">${close}</span>`;
  });
  return html;
}

export function highlight(code, language) {
  if (!code) return ' ';
  if (language === 'html') return highlightHtml(code);
  return highlightGeneric(code);
}

export function languageLabel(language = 'text') {
  return ({ javascript: 'JS', html: 'HTML', css: 'CSS', json: 'JSON', markdown: 'MD', text: 'TXT' })[language] || 'TXT';
}
