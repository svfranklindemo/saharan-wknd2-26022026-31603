/**
 * Bcview — Brand concierge style UI, built entirely in JS (static demo content).
 * Authoring model fields remain in _bcview.json for future use; this block does not read them.
 */

const INPUT_PLACEHOLDER = "Tell us what you'd like to do or create";

const TERMS_HREF = 'https://www.adobe.com/legal/licenses-terms/adobe-gen-ai-user-guidelines.html';

/** @type {{ title: string; subheading: string; cards: { title: string; image: string }[] }} */
const STATIC = {
  title: 'Explore what you can do with carvelo.',
  subheading:
    "Choose an option or tell us what interests you and we'll point you in the right direction.",
  cards: [
    {
      title: 'Explore our vehicle lineup',
      image:
        'https://carvelo.adobedemosystem.com/en/models/media_12fddf2e4fe309d58bebd165ca936d9169fb1df98.png?width=900&format=webply&optimize=medium',
    },
    {
      title: 'Financing & leasing options',
      image:
        'https://carvelo.adobedemosystem.com/en/media_1d6c9b590cebe19daf009f0ae4ccccedb368754a3.png?width=2000&format=webply&optimize=medium',
    },
    {
      title: 'Schedule a test drive',
      image:
        'https://carvelo.adobedemosystem.com/en/models/media_12d5bc10ec95f78c1de050f1aa2e2c70ee2081df8.png?width=900&format=webply&optimize=medium',
    },
    {
      title: 'Accessories & parts',
      image:
        'https://carvelo.adobedemosystem.com/en/accessory/media_15098d07f6b69517f4f9b132a647d651db4a436f4.jpg?width=900&format=webply&optimize=medium',
    },
  ],
};

const SEND_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M18.6485 9.9735C18.6482 9.67899 18.4769 9.41106 18.2059 9.29056L4.05752 2.93282C3.80133 2.8175 3.50129 2.85583 3.28171 3.03122C3.06178 3.20765 2.95889 3.49146 3.01516 3.76733L4.28678 10.008L3.06488 16.2384C3.0162 16.4852 3.09492 16.738 3.27031 16.9134C3.29068 16.9337 3.31278 16.9531 3.33522 16.9714C3.55619 17.1454 3.85519 17.182 4.11069 17.066L18.2086 10.6578C18.4773 10.5356 18.6489 10.268 18.6485 9.9735ZM14.406 9.22716L5.66439 9.25379L4.77705 4.90084L14.406 9.22716ZM4.81711 15.0973L5.6694 10.7529L14.4323 10.7264L4.81711 15.0973Z"/></svg>';

const PILL_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.2 9.35 5.2h4.2l-3.4 2.45L11.4 12 8 9.55 4.6 12l1.25-4.35-3.4-2.45h4.2L8 1.2z" fill="currentColor" opacity=".9"/><path d="M4.2 13.2c-.35 0-.65-.25-.75-.55l-.35-1.2-1.15-.95c-.2-.15-.25-.4-.1-.6.15-.2.4-.3.65-.25l1.2.2.95-1.15c.15-.2.45-.25.65-.1.2.15.3.4.25.65l-.2 1.2 1.15.95c.15.2.1.45-.1.6-.15.2-.4.25-.6.2l-1.2-.2-.95 1.15c-.1.15-.25.2-.4.2z" fill="currentColor" opacity=".55"/></svg>';

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
  intro.className = 'bcview__intro';
  const title = document.createElement('h2');
  title.className = 'bcview__title';
  title.textContent = STATIC.title;
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
    btn.className = 'bcview__bc-card bcview__bc-card--image';
    btn.setAttribute('aria-label', card.title);

    const img = document.createElement('div');
    img.className = 'bcview__bc-card-image';
    img.style.backgroundImage = `url(${JSON.stringify(card.image)})`;

    const cap = document.createElement('div');
    cap.className = 'bcview__bc-card-text';
    cap.textContent = card.title;

    btn.append(img, cap);
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
    pill.className = 'bcview__pill';
    pill.setAttribute('aria-label', card.title);
    pill.innerHTML = `<span class="bcview__pill-icon">${PILL_ICON_SVG}</span><span class="bcview__pill-text"></span>`;
    pill.querySelector('.bcview__pill-text').textContent = card.title;
    pills.append(pill);
  });

  const history = document.createElement('div');
  history.className = 'bcview__history';
  history.setAttribute('aria-live', 'polite');
  history.setAttribute('aria-label', 'Messages will appear here');

  const composerSection = document.createElement('div');
  composerSection.className = 'bcview__composer-section';

  const composerRow = document.createElement('div');
  composerRow.className = 'bcview__composer-row';

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
  composerRow.append(inputWrap, send);

  const legal = document.createElement('p');
  legal.className = 'bcview__legal';
  legal.append(
    document.createTextNode('AI responses may be inaccurate. Check answers and sources. '),
  );
  const terms = document.createElement('a');
  terms.className = 'bcview__legal-link';
  terms.href = TERMS_HREF;
  terms.target = '_blank';
  terms.rel = 'noopener noreferrer';
  terms.textContent = 'Terms';
  legal.append(terms);

  composerSection.append(composerRow, legal);

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
