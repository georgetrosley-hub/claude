const STORAGE_KEYS = {
  activities: 'gtm_activities',
  signals: 'gtm_signals',
  lastUpdated: 'gtm_last_updated',
  theme: 'gtm_theme',
  claudeApiKey: 'gtm_claude_api_key',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStored(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  document.getElementById('lastUpdated').textContent = formatDate(new Date());
  localStorage.setItem(STORAGE_KEYS.lastUpdated, new Date().toISOString());
}

// Render Account Cards (Cortex-style feature cards)
function renderAccountCards() {
  const container = document.getElementById('accountCards');
  container.innerHTML = ACCOUNTS.map(
    (a) => `
    <div class="account-card feature-card ${a.id}">
      <h4 class="feature-card-title">${a.name} <span class="priority p${a.priority}">P${a.priority}</span></h4>
      <p class="feature-card-desc">${a.hypothesis} First workload: ${a.firstWorkload}.</p>
      <p class="feature-card-proof">Proof point: ${a.proofPoint}</p>
      <span class="feature-card-cta">→ ${a.nextAction}</span>
    </div>
  `
  ).join('');
}

// Render Next 7 Days
function renderNext7Days() {
  const container = document.getElementById('next7Days');
  container.innerHTML = NEXT_7_DAYS.map(
    (item) => `
    <li>
      <span class="day">${item.day}</span>
      <span class="account-tag ${item.account}">${item.account === 'usfintech' ? 'US Fin Tech' : item.account.charAt(0).toUpperCase() + item.account.slice(1)}</span>
      <span>${item.action}</span>
    </li>
  `
  ).join('');
}

// Render Activity Feed
function renderActivityFeed(activities) {
  const container = document.getElementById('activityFeed');
  container.innerHTML = activities
    .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    .map(
      (item) => `
    <div class="activity-item">
      <span class="timestamp">${item.timestamp}</span>
      <span class="account-tag ${item.account}">${item.account === 'usfintech' ? 'US Fin Tech' : item.account.charAt(0).toUpperCase() + item.account.slice(1)}</span>
      <span>${item.text}</span>
    </div>
  `
    )
    .join('');
}

// Render Signal Tracker
function renderSignalTracker(signals) {
  const container = document.getElementById('signalTracker');
  container.innerHTML = signals
    .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    .map(
      (item) => `
    <div class="signal-item">
      <span class="timestamp">${item.timestamp}</span>
      <span class="account-tag ${item.account}">${item.account === 'usfintech' ? 'US Fin Tech' : item.account.charAt(0).toUpperCase() + item.account.slice(1)}</span>
      <span>${item.text}</span>
    </div>
  `
    )
    .join('');
}

// Render Consumption Snapshot
function renderConsumption() {
  const container = document.getElementById('consumptionSnapshot');
  container.innerHTML = CONSUMPTION_MOCK.map(
    (c) => `
    <div class="consumption-card">
      <h4>${c.account}</h4>
      <div class="value">${c.value}</div>
      <div class="trend ${c.trend}">${c.label}</div>
    </div>
  `
  ).join('');
}

// Add Activity
function setupActivityForm() {
  const form = document.getElementById('addActivityForm');
  const input = document.getElementById('activityInput');
  const accountSelect = document.getElementById('activityAccount');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const activities = getStored(STORAGE_KEYS.activities, DEFAULT_ACTIVITIES);
    activities.unshift({
      timestamp: new Date().toISOString().slice(0, 10),
      account: accountSelect.value,
      text: input.value.trim(),
    });
    setStored(STORAGE_KEYS.activities, activities);
    renderActivityFeed(activities);
    input.value = '';
  });
}

// Add Signal
function setupSignalForm() {
  const form = document.getElementById('addSignalForm');
  const input = document.getElementById('signalInput');
  const accountSelect = document.getElementById('signalAccount');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const signals = getStored(STORAGE_KEYS.signals, DEFAULT_SIGNALS);
    signals.unshift({
      timestamp: new Date().toISOString().slice(0, 10),
      account: accountSelect.value,
      text: input.value.trim(),
    });
    setStored(STORAGE_KEYS.signals, signals);
    renderSignalTracker(signals);
    input.value = '';
  });
}

// Theme toggle
function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  document.documentElement.setAttribute('data-theme', stored);

  const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
  });
}

// Cortex AI Sidebar
function initSidebar() {
  const sidebar = document.getElementById('cortexSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');

  function open() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-visible');
    sidebar.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
  }
  function close() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    sidebar.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
}

// API Key
function initApiKey() {
  const input = document.getElementById('claudeApiKey');
  const saveBtn = document.getElementById('saveApiKey');
  const status = document.getElementById('apiKeyStatus');

  const stored = localStorage.getItem(STORAGE_KEYS.claudeApiKey);
  if (stored) {
    input.placeholder = '••••••••••••••••';
    status.textContent = 'Key saved';
    status.classList.add('saved');
  }

  saveBtn.addEventListener('click', () => {
    const key = input.value.trim();
    if (!key) {
      status.textContent = 'Enter an API key first';
      status.classList.remove('saved');
      status.classList.add('error');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.claudeApiKey, key);
    input.value = '';
    input.placeholder = '••••••••••••••••';
    status.textContent = 'Key saved';
    status.classList.add('saved');
    status.classList.remove('error');
  });
}

// Claude API strategy
function buildTerritoryContext() {
  const activities = getStored(STORAGE_KEYS.activities, DEFAULT_ACTIVITIES);
  const signals = getStored(STORAGE_KEYS.signals, DEFAULT_SIGNALS);
  return `
## Priority Accounts
${ACCOUNTS.map(a => `- **${a.name}** (P${a.priority}): ${a.hypothesis}. Next: ${a.nextAction}`).join('\n')}

## This Week's Priorities
${NEXT_7_DAYS.map(i => `- ${i.day} (${i.account}): ${i.action}`).join('\n')}

## Recent Activity
${activities.slice(0, 8).map(a => `- ${a.timestamp} [${a.account}]: ${a.text}`).join('\n')}

## Recent Signals
${signals.slice(0, 8).map(s => `- ${s.timestamp} [${s.account}]: ${s.text}`).join('\n')}
`;
}

async function askClaudeForStrategy(prompt) {
  const apiKey = localStorage.getItem(STORAGE_KEYS.claudeApiKey);
  if (!apiKey) {
    throw new Error('No API key. Add and save your Claude API key first.');
  }

  const territoryContext = buildTerritoryContext();
  const systemPrompt = `You are a strategic advisor for a Snowflake Enterprise Account Executive. You help prioritize outreach, suggest next actions, and identify risks. Use the territory context below to give concise, actionable advice.`;
  const userMessage = `${territoryContext}\n\n---\n\nUser question: ${prompt}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('No response from Claude');
  return text;
}

function initStrategy() {
  const promptEl = document.getElementById('strategyPrompt');
  const outputEl = document.getElementById('strategyOutput');
  const btn = document.getElementById('askStrategy');

  btn.addEventListener('click', async () => {
    const prompt = promptEl.value.trim();
    if (!prompt) {
      outputEl.textContent = 'Enter a strategy question first.';
      outputEl.classList.remove('loading');
      return;
    }

    outputEl.innerHTML = '<span class="loading-spinner"><img src="assets/snowflake-logo.png" alt=""></span> Thinking...';
    outputEl.classList.add('loading');
    btn.disabled = true;

    try {
      const text = await askClaudeForStrategy(prompt);
      outputEl.textContent = text;
      outputEl.classList.remove('loading');
    } catch (err) {
      outputEl.textContent = `Error: ${err.message}`;
      outputEl.classList.remove('loading');
    } finally {
      btn.disabled = false;
    }
  });
}

// Init
function init() {
  initTheme();
  initSidebar();
  initApiKey();
  initStrategy();

  const lastUpdated = localStorage.getItem(STORAGE_KEYS.lastUpdated);
  document.getElementById('lastUpdated').textContent = lastUpdated
    ? formatDate(lastUpdated)
    : formatDate(new Date());

  renderAccountCards();
  renderNext7Days();
  renderConsumption();

  const activities = getStored(STORAGE_KEYS.activities, DEFAULT_ACTIVITIES);
  const signals = getStored(STORAGE_KEYS.signals, DEFAULT_SIGNALS);
  renderActivityFeed(activities);
  renderSignalTracker(signals);

  setupActivityForm();
  setupSignalForm();
}

init();
