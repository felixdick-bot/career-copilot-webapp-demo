const toggle = document.getElementById('copilotToggle');
const panel = document.getElementById('copilotPanel');
const closeBtn = document.getElementById('copilotClose');
const form = document.getElementById('copilotForm');
const input = document.getElementById('copilotText');
const messages = document.getElementById('copilotMessages');

function openPanel() {
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  toggle.setAttribute('aria-expanded', 'true');
  input.focus();
}

function closePanel() {
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
  panel.classList.contains('open') ? closePanel() : openPanel();
});

closeBtn.addEventListener('click', closePanel);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const userBubble = document.createElement('div');
  userBubble.className = 'msg user';
  userBubble.textContent = text;
  messages.appendChild(userBubble);

  const placeholder = document.createElement('div');
  placeholder.className = 'msg bot';
  placeholder.textContent = 'Danke! Chat-Backend wird von dir in Python angebunden.';
  messages.appendChild(placeholder);

  messages.scrollTop = messages.scrollHeight;
  input.value = '';
});
