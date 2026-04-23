import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const INPUT_PLACEHOLDER = "Tell us what you'd like to do or create";

/**
 * @param {Element} row
 * @returns {string}
 */
function rowPlainText(row) {
  if (!row) return '';
  const cell = row.querySelector(':scope > div') || row;
  const p = cell.querySelector('p');
  const source = p || cell;
  return source.textContent.replace(/\s+/g, ' ').trim();
}

/**
 * @param {Element} li
 * @returns {{ src: string, title: string, itemCssId: string, alt: string, sourceEl: Element }}
 */
function parseCardLi(li) {
  const imgEl = li.querySelector('img');
  const src = imgEl?.currentSrc || imgEl?.src || '';
  const alt = (imgEl?.getAttribute('alt') || '').trim();

  let title = '';
  let itemCssId = '';

  const byTitle = li.querySelector('[data-aue-prop="title"]');
  const byId = li.querySelector('[data-aue-prop="itemCssId"], [data-aue-prop="itemcssid"]');
  if (byTitle) title = byTitle.textContent.trim();
  if (byId) itemCssId = byId.textContent.trim();

  if (!title || !itemCssId) {
    const ps = [...li.querySelectorAll(':scope p')];
    if (!title && ps[0]) title = ps[0].textContent.trim();
    if (!itemCssId && ps[1]) itemCssId = ps[1].textContent.trim();
  }

  return {
    src,
    title,
    itemCssId,
    alt: alt || title,
    sourceEl: li,
  };
}

/**
 * @param {Element} block
 * @returns {ReturnType<typeof parseCardLi>[]}
 */
function readCards(block) {
  const ul = block.querySelector(':scope ul');
  if (!ul) return [];
  return [...ul.querySelectorAll(':scope > li')].map(parseCardLi);
}

/**
 * @param {string} raw
 * @returns {string}
 */
function sanitizeHtmlId(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (!/^[A-Za-z][\w-]*$/.test(s)) return '';
  return s;
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const headingRow = rows[0];
  const subheadingRow = rows[1];

  const headingEl = headingRow?.querySelector('[data-aue-prop="heading"]')
    || headingRow?.querySelector('p, div');
  const subheadingEl = subheadingRow?.querySelector('[data-aue-prop="subheading"]')
    || subheadingRow?.querySelector('p, div');

  const headingText = headingEl?.textContent.replace(/\s+/g, ' ').trim() || rowPlainText(headingRow);
  const subheadingText = subheadingEl?.textContent.replace(/\s+/g, ' ').trim() || rowPlainText(subheadingRow);

  const cards = readCards(block);
  const usedIds = new Set();

  const root = document.createElement('div');
  root.className = 'bcview__root';

  const header = document.createElement('header');
  header.className = 'bcview__header';

  const h2 = document.createElement('h2');
  h2.className = 'bcview__heading';
  h2.textContent = headingText;
  if (headingEl) moveInstrumentation(headingEl, h2);

  const sub = document.createElement('p');
  sub.className = 'bcview__subheading';
  sub.textContent = subheadingText;
  if (subheadingEl) moveInstrumentation(subheadingEl, sub);

  header.append(h2, sub);

  const grid = document.createElement('div');
  grid.className = 'bcview__grid';
  grid.setAttribute('role', 'list');

  cards.forEach((card, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bcview__card';
    btn.setAttribute('role', 'listitem');
    const label = card.title || `Option ${index + 1}`;
    btn.setAttribute('aria-label', label);

    if (card.sourceEl) moveInstrumentation(card.sourceEl, btn);

    const rawId = sanitizeHtmlId(card.itemCssId);
    if (rawId && !usedIds.has(rawId)) {
      btn.id = rawId;
      usedIds.add(rawId);
    }

    const media = document.createElement('div');
    media.className = 'bcview__card-media';
    if (card.src) {
      const pic = createOptimizedPicture(card.src, card.alt || label, false, [{ width: '900' }]);
      media.append(pic);
    }

    const cap = document.createElement('span');
    cap.className = 'bcview__card-label';
    cap.textContent = card.title;

    btn.append(media, cap);
    grid.append(btn);
  });

  const footer = document.createElement('footer');
  footer.className = 'bcview__footer';

  const composer = document.createElement('div');
  composer.className = 'bcview__composer';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'bcview__input';
  input.placeholder = INPUT_PLACEHOLDER;
  input.setAttribute('aria-label', 'Message input');

  const send = document.createElement('button');
  send.type = 'button';
  send.className = 'bcview__send';
  send.disabled = true;
  send.setAttribute('aria-label', 'Send message');
  send.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M18.6485 9.9735C18.6482 9.67899 18.4769 9.41106 18.2059 9.29056L4.05752 2.93282C3.80133 2.8175 3.50129 2.85583 3.28171 3.03122C3.06178 3.20765 2.95889 3.49146 3.01516 3.76733L4.28678 10.008L3.06488 16.2384C3.0162 16.4852 3.09492 16.738 3.27031 16.9134C3.29068 16.9337 3.31278 16.9531 3.33522 16.9714C3.55619 17.1454 3.85519 17.182 4.11069 17.066L18.2086 10.6578C18.4773 10.5356 18.6489 10.268 18.6485 9.9735ZM14.406 9.22716L5.66439 9.25379L4.77705 4.90084L14.406 9.22716ZM4.81711 15.0973L5.6694 10.7529L14.4323 10.7264L4.81711 15.0973Z"/></svg>';

  input.addEventListener('input', () => {
    send.disabled = !input.value.trim();
  });

  composer.append(input, send);

  const disc = document.createElement('p');
  disc.className = 'bcview__disclaimer';
  disc.append(
    document.createTextNode('AI responses may be inaccurate. Check answers and sources. '),
  );
  const terms = document.createElement('a');
  terms.className = 'bcview__disclaimer-link';
  terms.href = 'https://www.adobe.com/legal/licenses-terms/adobe-gen-ai-user-guidelines.html';
  terms.target = '_blank';
  terms.rel = 'noopener noreferrer';
  terms.textContent = 'Terms';
  disc.append(terms);

  footer.append(composer, disc);

  root.append(header, grid, footer);
  block.replaceChildren(root);
}
