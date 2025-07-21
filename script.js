let tabs = [];
let currentTab = 0;

function addTab(content = "") {
  tabs.push(content);
  renderTabs();
  switchTab(tabs.length - 1);
}

function switchTab(id) {
  if (id < 0 || id >= tabs.length) return;
  tabs[currentTab] = document.getElementById('editor').value;
  currentTab = id;
  renderTabs();
  document.getElementById('editor').value = tabs[id] || '';
  updateCounter();
  saveToLocal();
}

function closeTab(id) {
  if (tabs.length === 1) {
    tabs[0] = '';
    document.getElementById('editor').value = '';
  } else {
    tabs.splice(id, 1);
    if (currentTab >= id) currentTab = Math.max(0, currentTab - 1);
  }
  renderTabs();
  document.getElementById('editor').value = tabs[currentTab] || '';
  updateCounter();
  saveToLocal();
}

function renderTabs() {
  const tabList = document.getElementById('tabList');
  tabList.innerHTML = '';
  tabs.forEach((_, i) => {
    const tab = document.createElement('div');
    tab.className = 'tab';
    if (i === currentTab) tab.classList.add('active');
    tab.innerHTML = `Tab ${i + 1} <span class="close-tab" onclick="closeTab(${i})">✕</span>`;
    tab.onclick = (e) => {
      if (!e.target.classList.contains('close-tab')) switchTab(i);
    };
    tabList.appendChild(tab);
  });
}

function updateCounter() {
  const text = document.getElementById('editor').value;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  document.getElementById('counter').textContent = `Words: ${words} | Characters: ${chars}`;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

function changeFont() {
  const font = document.getElementById('fontSelect').value;
  document.getElementById('editor').style.fontFamily = font;
  localStorage.setItem('selectedFont', font);
}

function changeFontSize() {
  const size = document.getElementById('fontSize').value;
  document.getElementById('editor').style.fontSize = size;
  localStorage.setItem('fontSize', size);
}

function changeFontColor() {
  const color = document.getElementById('fontColor').value;
  document.getElementById('editor').style.color = color;
  localStorage.setItem('fontColor', color);
}

function toggleSpellCheck() {
  const enabled = document.getElementById('spellCheckToggle').checked;
  document.getElementById('editor').setAttribute('spellcheck', enabled);
  localStorage.setItem('spellCheck', enabled);
}

function printContent() {
  const content = document.getElementById('editor').value;
  const win = window.open('', '', 'width=800,height=600');
  win.document.write('<pre>' + content.replace(/</g, "&lt;") + '</pre>');
  win.document.close();
  win.print();
}

function exportToPDF() {
  const content = document.getElementById('editor').value;
  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`
    <html><head><title>Export</title></head><body>
    <pre style="font-family: Consolas, monospace;">${content.replace(/</g, "&lt;")}</pre>
    </body></html>`);
  win.document.close();
  win.print();
}

function findText() {
  const text = document.getElementById('editor').value;
  const find = document.getElementById('findText').value;
  const index = text.indexOf(find);
  if (index !== -1) {
    document.getElementById('editor').focus();
    document.getElementById('editor').setSelectionRange(index, index + find.length);
  } else {
    alert("Text not found.");
  }
}

function replaceText() {
  const editor = document.getElementById('editor');
  const find = document.getElementById('findText').value;
  const replace = document.getElementById('replaceText').value;
  editor.value = editor.value.replaceAll(find, replace);
  updateCounter();
  saveToLocal();
}

function saveToLocal() {
  tabs[currentTab] = document.getElementById('editor').value;
  localStorage.setItem('tabs', JSON.stringify(tabs));
  localStorage.setItem('currentTab', currentTab);
}

function loadFromLocal() {
  const savedTabs = JSON.parse(localStorage.getItem('tabs') || '[""]');
  const savedCurrentTab = parseInt(localStorage.getItem('currentTab')) || 0;
  tabs = savedTabs;
  currentTab = Math.min(savedCurrentTab, tabs.length - 1);
  renderTabs();
  document.getElementById('editor').value = tabs[currentTab] || '';
  updateCounter();

  document.getElementById('fontSelect').value = localStorage.getItem('selectedFont') || 'Consolas';
  changeFont();

  document.getElementById('fontSize').value = localStorage.getItem('fontSize') || '14px';
  changeFontSize();

  document.getElementById('fontColor').value = localStorage.getItem('fontColor') || '#000000';
  changeFontColor();

  const darkPref = localStorage.getItem('darkMode');
  if (darkPref === null || darkPref === 'true') {
    document.body.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }

  const spellCheck = localStorage.getItem('spellCheck') !== 'false';
  document.getElementById('spellCheckToggle').checked = spellCheck;
  document.getElementById('editor').setAttribute('spellcheck', spellCheck);
}

document.getElementById('editor').addEventListener('keyup', () => {
  updateCounter();
  saveToLocal();
});

window.onload = loadFromLocal;
