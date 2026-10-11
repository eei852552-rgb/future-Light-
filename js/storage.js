const PROJECT_KEY = 'future-light-project-v1';
const SETTINGS_KEY = 'future-light-settings-v1';
const RECOVERY_KEY = 'future-light-recovery-v1';

const starterFiles = [
  { id: 'folder-src', name: 'src', kind: 'folder', parentId: null, content: '' },
  { id: 'index-html', name: 'index.html', kind: 'file', parentId: null, language: 'html', content: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Future Light demo</title>\n    <link rel="stylesheet" href="styles.css" />\n  </head>\n  <body>\n    <main class="demo-card">\n      <span class="eyebrow">FUTURE LIGHT / PREVIEW</span>\n      <h1>Build in the light.</h1>\n      <p>Edit <strong>index.html</strong>, <strong>styles.css</strong> or <strong>script.js</strong>, then open Preview.</p>\n      <button id="pulse">Test interaction</button>\n      <p id="message" class="message">Ready for your next idea.</p>\n    </main>\n    <script src="script.js"></script>\n  </body>\n</html>` },
  { id: 'styles-css', name: 'styles.css', kind: 'file', parentId: null, language: 'css', content: `:root {\n  color-scheme: dark;\n  font-family: Inter, ui-sans-serif, system-ui, sans-serif;\n  background: #0b1728;\n  color: #eef7e4;\n}\n\nbody {\n  min-height: 100vh;\n  margin: 0;\n  display: grid;\n  place-items: center;\n  background: radial-gradient(circle at 10% 10%, #1b3551, transparent 45%), #0b1728;\n}\n\n.demo-card {\n  width: min(86vw, 620px);\n  padding: 42px;\n  border: 1px solid rgba(199, 243, 107, .28);\n  border-radius: 28px;\n  background: rgba(20, 39, 61, .82);\n  box-shadow: 0 24px 80px rgba(0, 0, 0, .28);\n}\n\n.eyebrow { color: #c7f36b; font: 700 .72rem ui-monospace, monospace; letter-spacing: .14em; }\nh1 { margin: 18px 0 12px; font-size: clamp(2.3rem, 7vw, 4.8rem); letter-spacing: -.06em; }\np { color: #a9b9c7; line-height: 1.7; }\nbutton { border: 0; border-radius: 999px; padding: 13px 20px; background: #c7f36b; color: #0b1728; font-weight: 800; cursor: pointer; }\n.message { color: #f6b656; }` },
  { id: 'script-js', name: 'script.js', kind: 'file', parentId: null, language: 'javascript', content: `const button = document.querySelector('#pulse');\nconst message = document.querySelector('#message');\n\nbutton?.addEventListener('click', () => {\n  message.textContent = 'Nice — the preview is interactive.';\n  button.textContent = 'It works';\n});` },
  { id: 'readme-md', name: 'README.md', kind: 'file', parentId: null, language: 'text', content: `# Future Light demo\n\nThis starter project is stored locally in your browser.\n\n- Edit the files in the explorer.\n- Use Save or wait for autosave.\n- Open Preview to see HTML, CSS and JavaScript together.` },
  { id: 'notes-txt', name: 'notes.txt', kind: 'file', parentId: 'folder-src', language: 'text', content: `Ideas for the next build:\n- Add a component\n- Keep the interface clear\n` }
];

export function cloneStarter() {
  return starterFiles.map(file => ({ ...file }));
}

export function loadProject() {
  try {
    const raw = localStorage.getItem(PROJECT_KEY);
    if (!raw) return cloneStarter();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : cloneStarter();
  } catch {
    return cloneStarter();
  }
}

export function saveProject(files) {
  try { localStorage.setItem(PROJECT_KEY, JSON.stringify(files)); return true; }
  catch (error) { console.warn('Future Light project storage unavailable', error); return false; }
}

export function loadSettings() {
  const defaults = { theme: 'dark', fontSize: 14, tabSize: 2, wordWrap: true, autosave: true };
  try { return { ...defaults, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) }; }
  catch { return defaults; }
}

export function saveSettings(settings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); return true; }
  catch (error) { console.warn('Future Light settings storage unavailable', error); return false; }
}

export function saveRecovery(files) {
  try { localStorage.setItem(RECOVERY_KEY, JSON.stringify({ savedAt: Date.now(), files })); return true; }
  catch (error) { console.warn('Future Light recovery storage unavailable', error); return false; }
}

export function loadRecovery() {
  try { return JSON.parse(localStorage.getItem(RECOVERY_KEY) || 'null'); }
  catch { return null; }
}

export function clearRecovery() { localStorage.removeItem(RECOVERY_KEY); }

export function downloadProject(files) {
  const payload = { app: 'Future Light', version: '1.0.0', exportedAt: new Date().toISOString(), files };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `future-light-project-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function readProjectFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const files = Array.isArray(parsed) ? parsed : parsed.files;
        if (!Array.isArray(files) || !files.length) throw new Error('ဖိုင်ပုံစံ မမှန်ပါ။');
        resolve(files.map(item => ({ ...item, kind: item.kind === 'folder' ? 'folder' : 'file' })));
      } catch (error) { reject(error); }
    };
    reader.onerror = () => reject(new Error('ဖိုင်ကို ဖတ်မရပါ။'));
    reader.readAsText(file);
  });
}

export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('ဖိုင်ကို ဖတ်မရပါ။'));
    reader.readAsText(file);
  });
}

export function extensionLanguage(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  return ({ html: 'html', htm: 'html', css: 'css', js: 'javascript', mjs: 'javascript', json: 'json', md: 'markdown', txt: 'text' })[ext] || 'text';
}

export function makeId(prefix = 'item') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
