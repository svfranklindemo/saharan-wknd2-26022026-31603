import { loadCSS } from '../../scripts/aem.js';

const MOUNT_ID = 'brand-concierge-mount';
const BC_SELECTOR = '#brand-concierge-mount';
const LOG_PREFIX = '[bcview]';

const INPUT_PLACEHOLDER =
  'Ask a question to get instant answers about our tools and solutions.';

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

const PILL_SPARK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v4m0 12v4M4 12h4m8 0h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/><path d="m12 7 1 3.2 3.2 1-3.2 1L12 16l-1-3.8L7.8 12 11 10.8 12 7z" fill="currentColor" opacity=".85"/></svg>';

function showError(host, message) {
  host.textContent = message;
  host.hidden = false;
}

async function ensureConversationReady() {
  if (!window.alloy || !window.adobe?.concierge?.bootstrap) {
    throw new Error(
      'Brand Concierge scripts are unavailable. Ensure alloy and main.js are loaded in head.html.',
    );
  }

  try {
    await window.alloy('sendEvent', {});
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`${LOG_PREFIX} sendEvent failed`, error);
  }
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  loadCSS(`${window.hlx.codeBasePath}/blocks/brandconcierge/brandconcierge.css`);

  let bcInitialized = false;
  let bootstrapping = false;
  let minimized = false;

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
    btn.dataset.prompt = card.title;

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
    pill.dataset.prompt = card.title;
    pill.innerHTML = `<span class="bcview__pill-icon">${PILL_SPARK_SVG}</span><span class="bcview__pill-text"></span>`;
    pill.querySelector('.bcview__pill-text').textContent = card.title;
    pills.append(pill);
  });

  const composerSection = document.createElement('div');
  composerSection.className = 'bcview__composer-section';
  composerSection.innerHTML = `
    <div class="bcview__chat-bar-inline">
      <button type="button" class="bcview__ai-icon" title="Ask AI">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10 2 L11.5 7 L10 12 L8.5 7 Z" fill="white"></path>
          <path d="M6 4 L10 5.5 L14 4 L10 6.5 Z" fill="white"></path>
          <path d="M10 2 L12 5 L10 8 L8 5 Z" fill="white" opacity="0.9"></path>
          <path d="M7 3.5 L10 5 L13 3.5 L10 6.5 Z" fill="white" opacity="0.9"></path>
          <path d="M14 8 L16 14 L14 20 L12 14 Z" fill="white"></path>
          <path d="M8 14 L14 12 L20 14 L14 16 Z" fill="white"></path>
          <path d="M5 14 L6 17 L5 20 L4 17 Z" fill="white" opacity="0.7"></path>
          <path d="M3 17 L5 16 L7 17 L5 18 Z" fill="white" opacity="0.7"></path>
        </svg>
      </button>
      <div class="bcview__input-wrap">
        <input type="text" class="bcview__input" placeholder="${INPUT_PLACEHOLDER}" autocomplete="off" aria-label="Message input">
        <button type="button" class="bcview__send" title="Send" aria-label="Send">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  const error = document.createElement('div');
  error.className = 'bcview__error';
  error.hidden = true;

  const httpsWarning = document.createElement('div');
  httpsWarning.className = 'bcview__https-warning';
  httpsWarning.hidden = true;
  httpsWarning.innerHTML =
    '<strong>HTTPS required:</strong> Brand Concierge requires HTTPS to communicate with Adobe Edge services.';

  const floating = document.createElement('button');
  floating.type = 'button';
  floating.className = 'bcview__floating-icon';
  floating.setAttribute('aria-label', 'Open chat');
  floating.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"></path>
      <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"></path>
    </svg>
  `;

  const backdrop = document.createElement('div');
  backdrop.className = 'bcview__backdrop';

  const modal = document.createElement('div');
  modal.className = 'bcview__modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="bcview__modal-header">
      <div class="bcview__modal-title-wrap">
        <span class="bcview__modal-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"></path>
          </svg>
        </span>
        <span class="bcview__modal-title">Carvelo Concierge</span>
      </div>
      <div class="bcview__modal-controls">
        <button type="button" class="bcview__ctrl-btn" data-role="minimize" title="Minimize">&minus;</button>
        <button type="button" class="bcview__ctrl-btn bcview__ctrl-btn--close" data-role="close" title="Close">&times;</button>
      </div>
    </div>
    <div class="bcview__modal-body">
      <div id="${MOUNT_ID}" class="brandconcierge"></div>
    </div>
  `;

  const confirmOverlay = document.createElement('div');
  confirmOverlay.className = 'bcview__confirm-overlay';
  confirmOverlay.innerHTML = `
    <div class="bcview__confirm-dialog">
      <h3 class="bcview__confirm-title">End Chat</h3>
      <p class="bcview__confirm-text">
        Closing this window clears your chat history and ends your session. Are you sure you want to end this chat?
      </p>
      <div class="bcview__confirm-buttons">
        <button type="button" class="bcview__confirm-btn bcview__confirm-btn--no" data-role="confirm-no">No</button>
        <button type="button" class="bcview__confirm-btn bcview__confirm-btn--yes" data-role="confirm-yes">Yes</button>
      </div>
    </div>
  `;

  chat.append(intro, cardsSection, pills, composerSection);
  shell.append(chat);
  root.append(shell, httpsWarning, error, floating, backdrop, modal, confirmOverlay);
  block.replaceChildren(root);

  const dom = {
    input: root.querySelector('.bcview__input'),
    send: root.querySelector('.bcview__send'),
    cards: root.querySelectorAll('.bcview__bc-card'),
    pills: root.querySelectorAll('.bcview__pill'),
    floating,
    backdrop,
    modal,
    mount: root.querySelector(BC_SELECTOR),
    confirmOverlay,
    confirmNo: root.querySelector('[data-role="confirm-no"]'),
    confirmYes: root.querySelector('[data-role="confirm-yes"]'),
    close: root.querySelector('[data-role="close"]'),
    minimize: root.querySelector('[data-role="minimize"]'),
    error,
  };

  function setModalVisible(visible) {
    dom.modal.classList.toggle('bcview__modal--visible', visible);
    dom.backdrop.classList.toggle('bcview__backdrop--visible', visible);
    dom.floating.classList.toggle('bcview__floating-icon--visible', minimized && !visible);
  }

  function destroyBC() {
    dom.mount.innerHTML = '';
    dom.mount.removeAttribute('data-initial-message');
    bcInitialized = false;
    minimized = false;
  }

  async function bootstrapBC(initialMessage) {
    if (bcInitialized || bootstrapping) return;

    bootstrapping = true;
    dom.error.hidden = true;

    try {
      await ensureConversationReady();
      if (initialMessage) {
        dom.mount.setAttribute('data-initial-message', initialMessage);
      } else {
        dom.mount.removeAttribute('data-initial-message');
      }

      window.adobe.concierge.bootstrap({
        instanceName: 'alloy',
        stylingConfigurations: window.styleConfiguration || {},
        selector: BC_SELECTOR,
        stickySession: false,
      });

      bcInitialized = true;
    } catch (err) {
      showError(
        dom.error,
        'Unable to start Brand Concierge right now. Please check Adobe scripts/configuration.',
      );
      // eslint-disable-next-line no-console
      console.error(`${LOG_PREFIX} bootstrap failed`, err);
    } finally {
      bootstrapping = false;
    }
  }

  async function openChatWithMessage(message) {
    const prompt = String(message || '').trim();
    if (!prompt) return;

    dom.input.value = '';
    minimized = false;
    await bootstrapBC(prompt);
    if (!bcInitialized) return;
    setModalVisible(true);
  }

  function requestClose() {
    dom.confirmOverlay.classList.add('bcview__confirm-overlay--visible');
  }

  function cancelClose() {
    dom.confirmOverlay.classList.remove('bcview__confirm-overlay--visible');
  }

  function confirmClose() {
    cancelClose();
    setModalVisible(false);
    destroyBC();
  }

  dom.send.addEventListener('click', async () => {
    await openChatWithMessage(dom.input.value);
  });

  dom.input.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await openChatWithMessage(dom.input.value);
    }
  });

  dom.cards.forEach((button) => {
    button.addEventListener('click', async () => {
      await openChatWithMessage(button.dataset.prompt);
    });
  });

  dom.pills.forEach((button) => {
    button.addEventListener('click', async () => {
      await openChatWithMessage(button.dataset.prompt);
    });
  });

  dom.minimize.addEventListener('click', () => {
    minimized = true;
    setModalVisible(false);
  });

  dom.floating.addEventListener('click', () => {
    minimized = false;
    setModalVisible(true);
  });

  dom.close.addEventListener('click', requestClose);
  dom.confirmNo.addEventListener('click', cancelClose);
  dom.confirmYes.addEventListener('click', confirmClose);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (dom.confirmOverlay.classList.contains('bcview__confirm-overlay--visible')) {
      cancelClose();
      return;
    }
    if (dom.modal.classList.contains('bcview__modal--visible')) {
      requestClose();
    }
  });

  if (window.location.protocol !== 'https:') {
    httpsWarning.hidden = false;
  }
}
