/**
 * Bcview — polished brand-concierge style UI (static demo content).
 * Authoring model in _bcview.json reserved for future use.
 */

const INPUT_PLACEHOLDER = "Tell us what you'd like to do or create…";

const TERMS_HREF = 'https://www.adobe.com/legal/licenses-terms/adobe-gen-ai-user-guidelines.html';

/** @typedef {'blue' | 'teal' | 'purple' | 'orange'} BcviewTheme */

/**
 * @type {{
 *   titleBefore: string;
 *   titleBrand: string;
 *   titleAfter: string;
 *   subheading: string;
 *   cards: { title: string; description: string; image: string; theme: BcviewTheme; icon: 'car' | 'finance' | 'calendar' | 'wrench' }[];
 * }}
 */
const STATIC = {
  titleBefore: 'Explore what you can do with ',
  titleBrand: 'carvelo',
  titleAfter: '.',
  subheading:
    "Choose an option or tell us what interests you and we'll point you in the right direction.",
  cards: [
    {
      title: 'Explore vehicles',
      description: 'Browse models, trims, and features tailored to you.',
      image:
        'https://carvelo.adobedemosystem.com/en/models/media_12fddf2e4fe309d58bebd165ca936d9169fb1df98.png?width=900&format=webply&optimize=medium',
      theme: 'blue',
      icon: 'car',
    },
    {
      title: 'Financing & leasing',
      description: 'Flexible plans and tools to match your budget.',
      image:
        'https://carvelo.adobedemosystem.com/en/media_1d6c9b590cebe19daf009f0ae4ccccedb368754a3.png?width=2000&format=webply&optimize=medium',
      theme: 'teal',
      icon: 'finance',
    },
    {
      title: 'Schedule a test drive',
      description: 'Pick a time and location that works for your calendar.',
      image:
        'https://carvelo.adobedemosystem.com/en/models/media_12d5bc10ec95f78c1de050f1aa2e2c70ee2081df8.png?width=900&format=webply&optimize=medium',
      theme: 'purple',
      icon: 'calendar',
    },
    {
      title: 'Accessories & parts',
      description: 'Gear up with genuine accessories and components.',
      image:
        'https://carvelo.adobedemosystem.com/en/accessory/media_15098d07f6b69517f4f9b132a647d651db4a436f4.jpg?width=900&format=webply&optimize=medium',
      theme: 'orange',
      icon: 'wrench',
    },
  ],
};

const ICONS = {
  car: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-.4-2.2-.3c-.4.1-.7.3-1 .6l-1.5 1.6c-.4.4-.9.6-1.4.6H9"/><path d="M5 17H3c-.6 0-1-.4-1-1v-3c0-.9.7-1.7 1.5-1.9C4.3 10.6 7 10 7 10s1.3-.4 2.2-.3c.4.1.7.3 1 .6l1.5 1.6c.4.4.9.6 1.4.6H15"/><circle cx="7.5" cy="17.5" r="1.75"/><circle cx="16.5" cy="17.5" r="1.75"/></svg>',
  finance:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  calendar:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  wrench:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
};

const ARROW_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

const SEND_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M18.6485 9.9735C18.6482 9.67899 18.4769 9.41106 18.2059 9.29056L4.05752 2.93282C3.80133 2.8175 3.50129 2.85583 3.28171 3.03122C3.06178 3.20765 2.95889 3.49146 3.01516 3.76733L4.28678 10.008L3.06488 16.2384C3.0162 16.4852 3.09492 16.738 3.27031 16.9134C3.29068 16.9337 3.31278 16.9531 3.33522 16.9714C3.55619 17.1454 3.85519 17.182 4.11069 17.066L18.2086 10.6578C18.4773 10.5356 18.6489 10.268 18.6485 9.9735ZM14.406 9.22716L5.66439 9.25379L4.77705 4.90084L14.406 9.22716ZM4.81711 15.0973L5.6694 10.7529L14.4323 10.7264L4.81711 15.0973Z"/></svg>';

const AI_SPARKLE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v2.5M12 18.5V21M4.5 12H2M22 12h-2.5" stroke="#a5b4fc" stroke-width="1.35" stroke-linecap="round" opacity=".9"/><path d="M12 7.2 13 10.8 16.8 12 13 13.2 12 16.8l-1-3.6L7.2 12l3.8-1.2 1-3.6z" fill="#818cf8"/><path d="m7 7 .6.6M17 17l-.6.6M17 7l-.6.6M7 17l.6-.6" stroke="#22d3ee" stroke-width="1.1" stroke-linecap="round" opacity=".55"/></svg>';

const SHIELD_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';

const PILL_SPARK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v4m0 12v4M4 12h4m8 0h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/><path d="m12 7 1 3.2 3.2 1-3.2 1L12 16l-1-3.8L7.8 12 11 10.8 12 7z" fill="currentColor" opacity=".85"/></svg>';

/**
 * @param {HTMLInputElement} input
 * @param {HTMLButtonElement} send
 * @param {string} text
 */
function applyPrompt(input, send, text) {
  const t = text.trim();
  input.value = t;
  send.disabled = !t;
  input.focus();
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  const root = document.createElement('div');
  root.className = 'bcview__root';

  const shell = document.createElement('div');
  shell.className = 'bcview__shell';

  const chat = document.createElement('div');
  chat.className = 'bcview__chat';

  const intro = document.createElement('div');
  intro.className = 'bcview__intro bcview__intro--decor';

  const title = document.createElement('h2');
  title.className = 'bcview__title';
  const tBefore = document.createElement('span');
  tBefore.className = 'bcview__title-line';
  tBefore.textContent = STATIC.titleBefore;
  const tBrand = document.createElement('span');
  tBrand.className = 'bcview__title-brand';
  tBrand.textContent = STATIC.titleBrand;
  const tAfter = document.createElement('span');
  tAfter.className = 'bcview__title-line';
  tAfter.textContent = STATIC.titleAfter;
  title.append(tBefore, tBrand, tAfter);

  const subtitle = document.createElement('p');
  subtitle.className = 'bcview__subtitle';
  subtitle.textContent = STATIC.subheading;
  intro.append(title, subtitle);

  const cardsSection = document.createElement('div');
  cardsSection.className = 'bcview__cards-section';
  const grid = document.createElement('div');
  grid.className = 'bcview__card-grid';
  grid.dataset.cardCount = '4';
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', 'Quick actions');

  STATIC.cards.forEach((card) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `bcview__bc-card bcview__bc-card--theme-${card.theme}`;
    btn.setAttribute('aria-label', `${card.title}. ${card.description}`);

    const visual = document.createElement('div');
    visual.className = 'bcview__bc-card-visual';

    const bg = document.createElement('div');
    bg.className = 'bcview__bc-card-bg';
    bg.style.backgroundImage = `url(${JSON.stringify(card.image)})`;

    const scrim = document.createElement('div');
    scrim.className = 'bcview__bc-card-scrim';
    scrim.setAttribute('aria-hidden', 'true');

    const badge = document.createElement('span');
    badge.className = 'bcview__bc-card-badge';
    badge.setAttribute('aria-hidden', 'true');
    badge.innerHTML = ICONS[card.icon];

    const arrow = document.createElement('span');
    arrow.className = 'bcview__bc-card-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = ARROW_SVG;

    visual.append(bg, scrim, badge, arrow);

    const body = document.createElement('div');
    body.className = 'bcview__bc-card-body';
    const ct = document.createElement('span');
    ct.className = 'bcview__bc-card-title';
    ct.textContent = card.title;
    const cd = document.createElement('span');
    cd.className = 'bcview__bc-card-desc';
    cd.textContent = card.description;
    body.append(ct, cd);

    btn.append(visual, body);
    grid.append(btn);
  });
  cardsSection.append(grid);

  const pills = document.createElement('div');
  pills.className = 'bcview__pills';
  pills.setAttribute('role', 'group');
  pills.setAttribute('aria-label', 'Suggested prompts');

  STATIC.cards.forEach((card) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = `bcview__pill bcview__pill--theme-${card.theme}`;
    pill.setAttribute('aria-label', card.title);
    pill.innerHTML = `<span class="bcview__pill-icon">${PILL_SPARK_SVG}</span><span class="bcview__pill-text"></span>`;
    pill.querySelector('.bcview__pill-text').textContent = card.title;
    pills.append(pill);
  });

  const history = document.createElement('div');
  history.className = 'bcview__history';
  history.setAttribute('aria-live', 'polite');
  history.setAttribute('aria-label', 'Messages will appear here');

  const composerSection = document.createElement('div');
  composerSection.className = 'bcview__composer-section';

  const composerPanel = document.createElement('div');
  composerPanel.className = 'bcview__composer-panel';

  const composerInner = document.createElement('div');
  composerInner.className = 'bcview__composer-inner';

  const aiMark = document.createElement('span');
  aiMark.className = 'bcview__composer-ai';
  aiMark.setAttribute('aria-hidden', 'true');
  aiMark.innerHTML = AI_SPARKLE_SVG;

  const inputWrap = document.createElement('div');
  inputWrap.className = 'bcview__input-wrap';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'bcview__chat-input';
  input.placeholder = INPUT_PLACEHOLDER;
  input.autocomplete = 'off';
  input.setAttribute('aria-label', 'Message input');

  const send = document.createElement('button');
  send.type = 'button';
  send.className = 'bcview__send-btn';
  send.disabled = true;
  send.setAttribute('aria-label', 'Send message');
  send.innerHTML = SEND_SVG;

  inputWrap.append(input);
  composerInner.append(aiMark, inputWrap, send);
  composerPanel.append(composerInner);

  const legal = document.createElement('p');
  legal.className = 'bcview__legal';
  const shield = document.createElement('span');
  shield.className = 'bcview__legal-ico';
  shield.innerHTML = SHIELD_SVG;
  legal.append(
    shield,
    document.createTextNode(' AI responses may be inaccurate. Check answers and sources. '),
  );
  const terms = document.createElement('a');
  terms.className = 'bcview__legal-link';
  terms.href = TERMS_HREF;
  terms.target = '_blank';
  terms.rel = 'noopener noreferrer';
  terms.textContent = 'Terms';
  legal.append(terms);

  composerSection.append(composerPanel, legal);

  chat.append(intro, cardsSection, pills, history, composerSection);
  shell.append(chat);
  root.append(shell);
  block.replaceChildren(root);

  const syncSend = () => {
    send.disabled = !input.value.trim();
  };

  input.addEventListener('input', syncSend);

  grid.querySelectorAll('button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      applyPrompt(input, send, STATIC.cards[i].title);
    });
  });
  pills.querySelectorAll('button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      applyPrompt(input, send, STATIC.cards[i].title);
    });
  });

  send.addEventListener('click', () => {
    const msg = input.value.trim();
    if (!msg) return;
    const bubble = document.createElement('div');
    bubble.className = 'bcview__msg bcview__msg--user';
    bubble.textContent = msg;
    history.append(bubble);
    history.scrollTop = history.scrollHeight;
    input.value = '';
    syncSend();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send.click();
    }
  });
}
