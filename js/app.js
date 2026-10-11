import { cloneStarter, loadProject, saveProject, loadSettings, saveSettings, saveRecovery, loadRecovery, clearRecovery, downloadProject, readProjectFile, readTextFile, extensionLanguage, makeId } from './storage.js';
import { highlight, languageLabel } from './syntax.js';

const state = {
  files: loadProject(),
  settings: loadSettings(),
  openTabs: ['index-html', 'styles-css', 'script-js'],
  activeId: null,
  dirty: new Set(),
  expanded: new Set(['folder-src']),
  searchMatches: [],
  searchIndex: 0,
  searchTimer: null
};

const $ = selector => document.querySelector(selector);
const els = {
  body: document.body, sidebar: $('#sidebar'), overlay: $('#mobile-overlay'), tree: $('#file-tree'), tabs: $('#tab-strip'), editor: $('#code-editor'), highlight: $('#code-highlight'), gutter: $('#gutter'), scroller: $('#code-scroller'), currentPath: $('#current-path'), language: $('#language-chip'), mode: $('#editor-mode'), saveStatus: $('#save-status'), cursor: $('#cursor-status'), indent: $('#indent-status'), wrap: $('#wrap-status'), fileCount: $('#file-count'), storageLabel: $('#storage-label'), sync: $('#sync-status'), searchPanel: $('#search-panel'), searchInput: $('#search-input'), replaceInput: $('#replace-input'), matchCount: $('#match-count'), preview: $('#preview-panel'), previewFrame: $('#preview-frame'), toastRegion: $('#toast-region'), modalBackdrop: $('#modal-backdrop'), modal: $('#modal')
};

function activeFile() { return state.files.find(file => file.id === state.activeId && file.kind === 'file') || null; }
function filesByParent(parentId) { return state.files.filter(file => (file.parentId || null) === parentId).sort((a, b) => a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'folder' ? -1 : 1); }
function findFile(name) { return state.files.find(file => file.name === name && file.kind === 'file'); }
function escapeAttribute(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char])); }

function toast(message, type = 'success') {
  const node = document.createElement('div'); node.className = `toast ${type}`; node.textContent = message; els.toastRegion.append(node);
  window.setTimeout(() => node.remove(), 3400);
}

function renderTree() {
  els.tree.replaceChildren();
  const addBranch = (parentId, depth = 0) => {
    filesByParent(parentId).forEach(file => {
      const row = document.createElement('div');
      row.className = `tree-row ${file.kind} ${file.id === state.activeId ? 'active' : ''}`;
      row.style.setProperty('--indent', `${depth * 16}px`);
      row.dataset.id = file.id;
      const indent = document.createElement('span'); indent.className = 'tree-indent'; row.append(indent);
      const icon = document.createElement('span'); icon.className = 'tree-icon'; icon.textContent = file.kind === 'folder' ? (state.expanded.has(file.id) ? '⌄' : '›') : fileIcon(file.name); row.append(icon);
      const name = document.createElement('span'); name.className = 'tree-name'; name.textContent = file.name; row.append(name);
      if (file.kind === 'file') { const ext = document.createElement('span'); ext.className = 'file-ext'; ext.textContent = languageLabel(file.language || extensionLanguage(file.name)); row.append(ext); }
      const action = document.createElement('button'); action.className = 'row-action'; action.type = 'button'; action.title = 'More actions'; action.textContent = '⋯'; action.dataset.action = 'context'; row.append(action);
      row.addEventListener('click', event => {
        if (event.target.closest('[data-action="context"]')) return;
        if (file.kind === 'folder') { state.expanded.has(file.id) ? state.expanded.delete(file.id) : state.expanded.add(file.id); renderTree(); }
        else openFile(file.id);
      });
      row.addEventListener('dblclick', event => { if (file.kind === 'file' && !event.target.closest('[data-action]')) openRenameModal(file.id); });
      els.tree.append(row);
      if (file.kind === 'folder' && state.expanded.has(file.id)) addBranch(file.id, depth + 1);
    });
  };
  addBranch(null);
  const count = state.files.filter(file => file.kind === 'file').length;
  els.fileCount.textContent = `${count} file${count === 1 ? '' : 's'}`;
}

function fileIcon(name) {
  const language = extensionLanguage(name);
  return ({ html: '◇', css: '#', javascript: 'JS', json: '{}', markdown: 'M', text: '·' })[language] || '·';
}

function renderTabs() {
  els.tabs.replaceChildren();
  state.openTabs.forEach(id => {
    const file = state.files.find(item => item.id === id);
    if (!file || file.kind !== 'file') return;
    const tab = document.createElement('div'); tab.className = `tab ${id === state.activeId ? 'active' : ''}`; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', id === state.activeId ? 'true' : 'false');
    const icon = document.createElement('span'); icon.className = 'tree-icon'; icon.textContent = fileIcon(file.name); tab.append(icon);
    if (state.dirty.has(id)) { const dot = document.createElement('i'); dot.className = 'dirty-dot'; dot.title = 'Unsaved changes'; tab.append(dot); }
    const name = document.createElement('span'); name.className = 'tab-name'; name.textContent = file.name; tab.append(name);
    const close = document.createElement('button'); close.className = 'tab-close'; close.type = 'button'; close.textContent = '×'; close.title = 'Close tab'; close.addEventListener('click', event => { event.stopPropagation(); closeTab(id); }); tab.append(close);
    tab.addEventListener('click', () => openFile(id));
    els.tabs.append(tab);
  });
}

function openFile(id) {
  const file = state.files.find(item => item.id === id && item.kind === 'file');
  if (!file) return;
  if (!state.openTabs.includes(id)) state.openTabs.push(id);
  state.activeId = id;
  els.editor.value = file.content || '';
  updateEditor();
  renderTree(); renderTabs();
  els.sidebar.classList.remove('open');
  els.currentPath.textContent = file.name;
  els.language.textContent = languageLabel(file.language || extensionLanguage(file.name));
  els.mode.textContent = state.dirty.has(id) ? 'Unsaved changes' : 'Editing locally';
  els.emptyState?.setAttribute('hidden', '');
}

function closeTab(id) {
  if (state.dirty.has(id) && !window.confirm('မသိမ်းရသေးသော ပြင်ဆင်ချက်များ ရှိပါသည်။ Tab ပိတ်မည်လား?')) return;
  const index = state.openTabs.indexOf(id); if (index >= 0) state.openTabs.splice(index, 1);
  if (state.activeId === id) {
    const next = state.openTabs[index] || state.openTabs[index - 1] || state.files.find(file => file.kind === 'file')?.id;
    state.activeId = null; if (next) openFile(next); else clearEditor();
  }
  renderTabs(); renderTree();
}

function clearEditor() {
  els.editor.value = ''; els.highlight.innerHTML = ' '; els.gutter.textContent = '1'; els.currentPath.textContent = 'No file selected'; els.language.textContent = 'TXT';
}

function updateEditor() {
  const file = activeFile(); if (!file) return clearEditor();
  const language = file.language || extensionLanguage(file.name);
  els.highlight.innerHTML = highlight(els.editor.value, language);
  const lines = Math.max(1, els.editor.value.split('\n').length);
  els.gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  els.codeLayer?.classList.toggle('wrap', state.settings.wordWrap);
  updateCursor();
}

function updateCursor() {
  const value = els.editor.value.slice(0, els.editor.selectionStart || 0);
  const lines = value.split('\n');
  els.cursor.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
  els.indent.textContent = `Spaces: ${state.settings.tabSize}`;
  els.wrap.textContent = `Wrap: ${state.settings.wordWrap ? 'on' : 'off'}`;
}

function markDirty() {
  const file = activeFile(); if (!file) return;
  file.content = els.editor.value;
  state.dirty.add(file.id);
  els.mode.textContent = 'Unsaved changes'; els.saveStatus.textContent = 'Unsaved changes'; els.saveStatus.style.color = 'var(--amber)';
  if (state.settings.autosave) {
    window.clearTimeout(state.searchTimer);
    state.searchTimer = window.setTimeout(() => { saveCurrent(false); }, 1200);
  }
  saveRecovery(state.files); renderTabs(); renderTree();
}

function saveCurrent(showToast = true) {
  const file = activeFile(); if (!file) return;
  file.content = els.editor.value; state.dirty.delete(file.id); saveProject(state.files); saveRecovery(state.files);
  els.mode.textContent = 'Editing locally'; els.saveStatus.textContent = 'Saved locally'; els.saveStatus.style.color = 'var(--lime)';
  els.sync.innerHTML = '<i></i> Saved'; els.storageLabel.textContent = 'Autosave recovery active';
  renderTabs(); renderTree();
  if (showToast) toast(`${file.name} ကို local workspace ထဲ သိမ်းပြီးပါပြီ။`);
}

function saveAll() {
  const file = activeFile(); if (file) file.content = els.editor.value;
  state.dirty.clear(); saveProject(state.files); saveRecovery(state.files);
  els.saveStatus.textContent = 'All changes saved'; els.saveStatus.style.color = 'var(--lime)'; renderTabs(); renderTree(); toast('ပြင်ဆင်ချက်များအားလုံး သိမ်းပြီးပါပြီ။');
}

function buildPreview() {
  const htmlFile = findFile('index.html') || state.files.find(file => file.kind === 'file' && file.language === 'html');
  if (!htmlFile) return '<!doctype html><p style="font:16px sans-serif;padding:24px">index.html မတွေ့ပါ။</p>';
  let html = htmlFile.content || '';
  const css = findFile('styles.css'); const js = findFile('script.js');
  if (css) {
    html = html.replace(/<link\b[^>]*href=["'](?:\.\/)?styles\.css["'][^>]*>/i, `<style>\n${css.content}\n</style>`);
    if (!html.includes('<style>')) html = html.replace('</head>', `<style>\n${css.content}\n</style>\n</head>`);
  }
  if (js) html = html.replace(/<script\b[^>]*src=["'](?:\.\/)?script\.js["'][^>]*><\/script>/i, `<script>\n${js.content}\n<\/script>`);
  return html;
}

function openPreview() { saveCurrent(false); els.preview.hidden = false; els.previewFrame.srcdoc = buildPreview(); }
function refreshPreview() { els.previewFrame.srcdoc = buildPreview(); toast('Preview ကို refresh လုပ်ပြီးပါပြီ။'); }

function openSearch() { els.searchPanel.hidden = false; els.searchInput.focus(); els.searchInput.select(); updateMatches(); }
function closeSearch() { els.searchPanel.hidden = true; els.searchMatches = []; els.matchCount.textContent = '0/0'; }
function updateMatches() {
  const query = els.searchInput.value; const value = els.editor.value; state.searchMatches = [];
  if (query) { let start = 0; while ((start = value.toLowerCase().indexOf(query.toLowerCase(), start)) !== -1) { state.searchMatches.push(start); start += query.length || 1; } }
  state.searchIndex = Math.min(state.searchIndex, Math.max(state.searchMatches.length - 1, 0));
  els.matchCount.textContent = state.searchMatches.length ? `${state.searchIndex + 1}/${state.searchMatches.length}` : '0/0';
  const match = state.searchMatches[state.searchIndex]; if (match !== undefined) { els.editor.focus(); els.editor.setSelectionRange(match, match + query.length); }
}
function moveMatch(direction) { if (!state.searchMatches.length) return; state.searchIndex = (state.searchIndex + direction + state.searchMatches.length) % state.searchMatches.length; updateMatches(); }
function replaceCurrent() {
  const query = els.searchInput.value; if (!query) return;
  const start = els.editor.selectionStart; const selected = els.editor.value.slice(start, els.editor.selectionEnd);
  if (selected.toLowerCase() !== query.toLowerCase()) { updateMatches(); return; }
  els.editor.setRangeText(els.replaceInput.value, start, els.editor.selectionEnd, 'end'); markDirty(); updateEditor(); updateMatches();
}
function replaceAll() {
  const query = els.searchInput.value; if (!query) return;
  const value = els.editor.value; const replacement = els.replaceInput.value; const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); const next = value.replace(regex, replacement);
  if (next === value) return toast('ရှာဖွေသောစာသား မတွေ့ပါ။', 'error');
  els.editor.value = next; markDirty(); updateEditor(); updateMatches(); toast('စာသားအားလုံးကို အစားထိုးပြီးပါပြီ။');
}

function openRenameModal(id) {
  const file = state.files.find(item => item.id === id); if (!file) return;
  showModal(`<h2>Rename ${file.kind === 'folder' ? 'folder' : 'file'}</h2><p>ဖိုင်အမည်အသစ်ကို ထည့်ပါ။</p><div class="form-field"><label for="modal-name">Name</label><input id="modal-name" value="${escapeAttribute(file.name)}" /></div><div class="modal-actions"><button data-modal-cancel>Cancel</button><button class="primary-btn" id="modal-submit">Rename</button></div>`);
  $('#modal-submit').onclick = () => { const next = $('#modal-name').value.trim(); if (!next) return toast('အမည်ထည့်ပါ။', 'error'); file.name = next; file.language = file.kind === 'file' ? extensionLanguage(next) : undefined; closeModal(); renderTree(); renderTabs(); if (state.activeId === id) { els.currentPath.textContent = next; els.language.textContent = languageLabel(file.language); } saveProject(state.files); clearRecovery(); toast('အမည်ပြောင်းပြီးပါပြီ။'); };
  $('#modal-name').focus(); $('#modal-name').select();
}

function openNewModal() {
  showModal(`<h2>Create new</h2><p>Workspace ထဲတွင် ဖိုင် သို့မဟုတ် folder အသစ် ဖန်တီးပါ။</p><div class="form-field"><label>Type</label><select id="modal-type"><option value="file">File</option><option value="folder">Folder</option></select></div><div class="form-field"><label for="modal-name">Name</label><input id="modal-name" placeholder="components / app.js" /></div><div class="form-field"><label>Parent folder</label><select id="modal-parent"><option value="">Workspace root</option>${state.files.filter(file => file.kind === 'folder').map(folder => `<option value="${escapeAttribute(folder.id)}">${escapeAttribute(folder.name)}</option>`).join('')}</select></div><div class="modal-actions"><button data-modal-cancel>Cancel</button><button class="primary-btn" id="modal-submit">Create</button></div>`);
  $('#modal-submit').onclick = () => { const name = $('#modal-name').value.trim(); const kind = $('#modal-type').value; if (!name || /[\\/]/.test(name)) return toast('အမည်မှန်မှန်ထည့်ပါ။', 'error'); const parentId = $('#modal-parent').value || null; const file = { id: makeId(kind), name, kind, parentId, content: kind === 'file' ? starterFor(name) : '' }; if (kind === 'file') file.language = extensionLanguage(name); state.files.push(file); if (parentId) state.expanded.add(parentId); closeModal(); renderTree(); if (kind === 'file') openFile(file.id); saveProject(state.files); clearRecovery(); toast(`${name} ကို ဖန်တီးပြီးပါပြီ။`); };
  $('#modal-name').focus();
}

function starterFor(name) {
  const language = extensionLanguage(name);
  if (language === 'html') return '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>New page</title>\n  </head>\n  <body>\n    <h1>Hello Future Light</h1>\n  </body>\n</html>';
  if (language === 'css') return ':root {\n  color: #eef7e4;\n}\n';
  if (language === 'javascript') return "console.log('Future Light');\n";
  if (language === 'json') return '{\n  "name": "future-light"\n}\n';
  return '';
}

function openContextModal(id) {
  const file = state.files.find(item => item.id === id); if (!file) return;
  showModal(`<h2>${escapeAttribute(file.name)}</h2><p>ဒီ item အတွက် လုပ်ဆောင်ချက်တစ်ခု ရွေးပါ။</p><div class="context-list"><button id="context-rename">✎ Rename</button><button id="context-delete">⌫ Delete</button></div><div class="modal-actions"><button data-modal-cancel>Close</button></div>`);
  $('#context-rename').onclick = () => openRenameModal(id);
  $('#context-delete').onclick = () => { closeModal(); deleteItem(id); };
}

function deleteItem(id) {
  const target = state.files.find(file => file.id === id); if (!target) return;
  const ids = new Set([id]); const collect = parent => state.files.filter(file => file.parentId === parent).forEach(child => { ids.add(child.id); if (child.kind === 'folder') collect(child.id); });
  if (target.kind === 'folder') collect(id);
  if (!window.confirm(`${target.name} ကို ဖျက်မည်လား?`)) return;
  state.files = state.files.filter(file => !ids.has(file.id));
  state.openTabs = state.openTabs.filter(tab => !ids.has(tab));
  state.dirty = new Set([...state.dirty].filter(item => !ids.has(item)));
  if (ids.has(state.activeId)) { state.activeId = null; const next = state.files.find(file => file.kind === 'file'); if (next) openFile(next.id); else clearEditor(); }
  saveProject(state.files); clearRecovery(); renderTree(); renderTabs(); toast(`${target.name} ကို ဖျက်ပြီးပါပြီ။`);
}

function showModal(markup) { els.modal.innerHTML = markup; els.modalBackdrop.hidden = false; els.modal.querySelector('[data-modal-cancel]')?.addEventListener('click', closeModal); els.modalBackdrop.onclick = event => { if (event.target === els.modalBackdrop) closeModal(); }; }
function closeModal() { els.modalBackdrop.hidden = true; els.modal.replaceChildren(); }

function openSettings() {
  showModal(`<h2>Editor settings</h2><p>ဖုန်းမျက်နှာပြင်နှင့် သင့်ရေးသားပုံအတွက် editor ကို ချိန်ညှိပါ။</p><div class="form-field"><label for="font-size">Font size — <strong id="font-size-value">${state.settings.fontSize}px</strong></label><input id="font-size" type="range" min="12" max="22" value="${state.settings.fontSize}" /></div><div class="form-field"><label for="tab-size">Indent size</label><select id="tab-size"><option value="2" ${state.settings.tabSize === 2 ? 'selected' : ''}>2 spaces</option><option value="4" ${state.settings.tabSize === 4 ? 'selected' : ''}>4 spaces</option><option value="8" ${state.settings.tabSize === 8 ? 'selected' : ''}>8 spaces</option></select></div><label class="check-row"><span>Word wrap</span><input id="word-wrap" type="checkbox" ${state.settings.wordWrap ? 'checked' : ''} /></label><label class="check-row"><span>Autosave after typing</span><input id="autosave" type="checkbox" ${state.settings.autosave ? 'checked' : ''} /></label><div class="modal-actions"><button data-modal-cancel>Close</button><button class="primary-btn" id="settings-save">Apply</button></div>`);
  $('#font-size').oninput = event => { $('#font-size-value').textContent = `${event.target.value}px`; };
  $('#settings-save').onclick = () => { state.settings.fontSize = Number($('#font-size').value); state.settings.tabSize = Number($('#tab-size').value); state.settings.wordWrap = $('#word-wrap').checked; state.settings.autosave = $('#autosave').checked; applySettings(); saveSettings(state.settings); closeModal(); toast('Editor settings ကို အသုံးချပြီးပါပြီ။'); };
}

function applySettings() { els.body.dataset.theme = state.settings.theme; document.documentElement.style.setProperty('--editor-size', `${state.settings.fontSize}px`); document.documentElement.style.setProperty('--tab-size', state.settings.tabSize); els.codeLayer?.classList.toggle('wrap', state.settings.wordWrap); updateCursor(); }

async function copySelection(cut = false) {
  const selected = els.editor.value.slice(els.editor.selectionStart, els.editor.selectionEnd);
  if (!selected) return toast('အရင် select လုပ်ပါ။', 'error');
  try { await navigator.clipboard.writeText(selected); if (cut) els.editor.setRangeText('', els.editor.selectionStart, els.editor.selectionEnd, 'end'); toast(cut ? 'Cut ပြီးပါပြီ။' : 'Copy ပြီးပါပြီ။'); if (cut) { markDirty(); updateEditor(); } }
  catch { document.execCommand(cut ? 'cut' : 'copy'); if (cut) { markDirty(); updateEditor(); } toast(cut ? 'Cut ပြီးပါပြီ။' : 'Copy ပြီးပါပြီ။'); }
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    if (!text) return toast('Clipboard ထဲတွင် စာသားမရှိပါ။', 'error');
    els.editor.setRangeText(text, els.editor.selectionStart, els.editor.selectionEnd, 'end');
    markDirty(); updateEditor(); toast('Paste ပြီးပါပြီ။');
  } catch { toast('Browser permission ကြောင့် Paste မလုပ်နိုင်ပါ။ Ctrl/Cmd + V ကို အသုံးပြုပါ။', 'error'); }
}

function importTextFiles(files) {
  Promise.all([...files].map(async file => ({ name: file.name, kind: 'file', id: makeId('file'), parentId: null, language: extensionLanguage(file.name), content: await readTextFile(file) }))).then(items => { state.files.push(...items); saveProject(state.files); clearRecovery(); renderTree(); openFile(items[0].id); toast(`${items.length} ဖိုင် import လုပ်ပြီးပါပြီ။`); }).catch(error => toast(error.message, 'error'));
}

function toggleTheme() { state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark'; applySettings(); saveSettings(state.settings); toast(`${state.settings.theme === 'dark' ? 'Dark' : 'Light'} theme သို့ ပြောင်းပြီးပါပြီ။`); }
function toggleSidebar() { els.sidebar.classList.toggle('open'); }

function bindEvents() {
  $('#mobile-menu-btn').onclick = toggleSidebar; els.overlay.onclick = () => els.sidebar.classList.remove('open');
  $('#new-item-btn').onclick = openNewModal; $('#open-file-btn').onclick = () => $('#file-input').click(); $('#import-project-btn').onclick = () => $('#project-input').click(); $('#export-btn').onclick = () => downloadProject(state.files);
  $('#file-input').onchange = event => { importTextFiles(event.target.files); event.target.value = ''; };
  $('#project-input').onchange = event => { const file = event.target.files[0]; if (!file) return; readProjectFile(file).then(files => { state.files = files; state.openTabs = []; state.activeId = null; state.dirty.clear(); saveProject(files); clearRecovery(); renderTree(); const first = files.find(item => item.kind === 'file'); if (first) openFile(first.id); toast('Project backup ကို restore လုပ်ပြီးပါပြီ။'); }).catch(error => toast(error.message, 'error')); event.target.value = ''; };
  $('#save-btn').onclick = saveAll; $('#theme-btn').onclick = toggleTheme; $('#search-btn').onclick = openSearch; $('#preview-btn').onclick = openPreview; $('#close-preview').onclick = () => { els.preview.hidden = true; }; $('#refresh-preview').onclick = refreshPreview;
  $('#undo-btn').onclick = () => { els.editor.focus(); document.execCommand('undo'); updateEditor(); markDirty(); }; $('#redo-btn').onclick = () => { els.editor.focus(); document.execCommand('redo'); updateEditor(); markDirty(); }; $('#settings-btn').onclick = openSettings;
  $('#select-all-btn').onclick = () => { els.editor.focus(); els.editor.select(); }; $('#copy-btn').onclick = () => copySelection(false); $('#cut-btn').onclick = () => copySelection(true); $('#paste-btn').onclick = pasteFromClipboard;
  $('#close-search').onclick = closeSearch; $('#search-prev').onclick = () => moveMatch(-1); $('#search-next').onclick = () => moveMatch(1); $('#replace-btn').onclick = replaceCurrent; $('#replace-all-btn').onclick = replaceAll; els.searchInput.oninput = () => { state.searchIndex = 0; updateMatches(); };
  $('#bottom-files').onclick = toggleSidebar; $('#bottom-editor').onclick = () => els.sidebar.classList.remove('open'); $('#bottom-preview').onclick = openPreview; $('#bottom-settings').onclick = openSettings;
  els.editor.addEventListener('input', () => { updateEditor(); markDirty(); }); els.editor.addEventListener('click', updateCursor); els.editor.addEventListener('keyup', updateCursor); els.editor.addEventListener('select', updateCursor);
  els.editor.addEventListener('keydown', event => {
    if (event.key === 'Tab') { event.preventDefault(); const start = els.editor.selectionStart; const end = els.editor.selectionEnd; const spaces = ' '.repeat(state.settings.tabSize); els.editor.setRangeText(spaces, start, end, 'end'); updateEditor(); markDirty(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveCurrent(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') { event.preventDefault(); openSearch(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') { event.preventDefault(); openPreview(); }
  });
  els.scroller.addEventListener('scroll', () => { els.gutter.scrollTop = els.scroller.scrollTop; });
  window.addEventListener('beforeunload', event => { if (state.dirty.size) { event.preventDefault(); event.returnValue = ''; } });
  window.addEventListener('keydown', event => { if (event.key === 'Escape') { if (!els.modalBackdrop.hidden) closeModal(); else if (!els.searchPanel.hidden) closeSearch(); } });
}

function initRecovery() {
  const recovery = loadRecovery();
  if (recovery && recovery.files && recovery.files.length && JSON.stringify(recovery.files) !== JSON.stringify(state.files)) {
    showModal(`<h2>Recovery snapshot found</h2><p>မသိမ်းရသေးသော local recovery snapshot တစ်ခု ရှိနေပါသည်။ ပြန်ယူလိုပါသလား?</p><div class="modal-actions"><button id="discard-recovery">Discard</button><button class="primary-btn" id="restore-recovery">Restore</button></div>`);
    $('#discard-recovery').onclick = () => { clearRecovery(); closeModal(); }; $('#restore-recovery').onclick = () => { state.files = recovery.files; state.dirty.clear(); saveProject(state.files); clearRecovery(); closeModal(); renderTree(); const first = state.files.find(file => file.kind === 'file'); if (first) openFile(first.id); toast('Recovery snapshot ကို ပြန်ယူပြီးပါပြီ။'); };
  }
}

els.codeLayer = document.querySelector('.code-layer');
applySettings(); bindEvents(); renderTree();
const firstFile = state.files.find(file => file.kind === 'file'); if (firstFile) openFile(state.activeId || firstFile.id);
initRecovery();
