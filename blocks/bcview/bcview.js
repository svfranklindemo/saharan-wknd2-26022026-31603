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
 * @param {Element} root
 * @returns {{ src: string, alt: string }}
 */
function resolveImageSrc(root) {
  const imgEl = root.querySelector('img');
  if (imgEl) {
    const src = imgEl.currentSrc || imgEl.src || '';
    if (src) {
      return { src, alt: (imgEl.getAttribute('alt') || '').trim() };
    }
  }
  const ref = root.querySelector('[data-aue-prop="image"]');
  if (ref) {
    if (ref.tagName === 'A' && ref.href) {
      return { src: ref.href, alt: ref.textContent.replace(/\s+/g, ' ').trim() };
    }
    const link = ref.querySelector('a[href]');
    if (link?.href) {
      return { src: link.href, alt: link.textContent.replace(/\s+/g, ' ').trim() };
    }
  }
  const dm = root.querySelector('a[href*="dynamicmedia"], a[href*="scene7"], a[href*="delivery-p"]');
  if (dm?.href) return { src: dm.href, alt: (dm.textContent || '').trim() };
  return { src: '', alt: '' };
}

/**
 * @param {Element} root Card row, packed card cell, or legacy list item (`li`)
 * @returns {{ src: string, title: string, itemCssId: string, alt: string, sourceEl: Element }}
 */
function parseCardEl(root) {
  const { src, alt: imgAlt } = resolveImageSrc(root);

  let title = '';
  let itemCssId = '';

  const byTitle = root.querySelector('[data-aue-prop="title"]');
  const byId = root.querySelector('[data-aue-prop="itemCssId"], [data-aue-prop="itemcssid"]');
  if (byTitle) title = byTitle.textContent.replace(/\s+/g, ' ').trim();
  if (byId) itemCssId = byId.textContent.replace(/\s+/g, ' ').trim();

  const cells = [...root.children].filter((n) => n.nodeType === 1);
  if (!title || !itemCssId) {
    if (cells.length >= 3) {
      if (!title) title = (cells[1].textContent || '').replace(/\s+/g, ' ').trim();
      if (!itemCssId) itemCssId = (cells[2].textContent || '').replace(/\s+/g, ' ').trim();
    } else if (cells.length === 2) {
      if (!title) title = (cells[1].textContent || '').replace(/\s+/g, ' ').trim();
    }
  }

  if (!title || !itemCssId) {
    const ps = [...root.querySelectorAll(':scope p')].filter((p) => p.textContent.trim());
    if (!title && ps[0]) title = ps[0].textContent.replace(/\s+/g, ' ').trim();
    if (!itemCssId && ps[1]) itemCssId = ps[1].textContent.replace(/\s+/g, ' ').trim();
  }

  const alt = (imgAlt || title || '').trim();

  return {
    src,
    title,
    itemCssId,
    alt: alt || title,
    sourceEl: root,
  };
}

/**
 * @param {ReturnType<typeof parseCardEl>} c
 */
function cardHasContent(c) {
  return Boolean(c.title?.trim() || c.src?.trim());
}

/**
 * When UE packs multiple card instances into one wrapper, split into per-card roots.
 * @param {Element} el
 * @returns {Element[]}
 */
function expandPackedCardHosts(el) {
  if (el.tagName === 'UL' || el.tagName === 'LI') return [el];
  let layer = el;
  const onlyWrapper = el.children.length === 1
    && el.firstElementChild?.classList?.contains('default-content-wrapper');
  if (onlyWrapper) {
    layer = /** @type {Element} */ (el.firstElementChild);
  }
  const kids = [...layer.children].filter((n) => n.nodeType === 1);
  if (kids.length < 2) return [el];
  const cardish = kids.filter((c) => (
    c.querySelector('[data-aue-prop="title"]')
    || c.querySelector('[data-aue-prop="image"]')
    || c.querySelector('picture, img')
    || c.querySelector('a[href*="dynamicmedia"], a[href*="scene7"]')
  ));
  if (cardish.length >= 2) return cardish;
  return [el];
}

/**
 * @param {Element} row
 */
function isLikelyCardRow(row) {
  return !!(row?.querySelector?.('[data-aue-prop="title"], [data-aue-prop="image"]')
    || row?.querySelector?.('picture, img')
    || row?.querySelector?.('a[href*="dynamicmedia"], a[href*="scene7"]'));
}

/**
 * First block-level index where quick-action cards start (after heading / subheading rows).
 * @param {Element[]} kids
 */
function cardHostStartIndex(kids) {
  if (!kids.length) return 0;
  const hi = kids.findIndex((k) => k.querySelector('[data-aue-prop="heading"]'));
  const si = kids.findIndex((k) => k.querySelector('[data-aue-prop="subheading"]'));
  if (hi >= 0) {
    if (si > hi) return si + 1;
    const next = kids[hi + 1];
    if (!next) return hi + 1;
    if (!isLikelyCardRow(next)) return hi + 2;
    return hi + 1;
  }
  return Math.min(2, kids.length);
}

/**
 * @param {Element} block
 * @returns {Element[]}
 */
function collectCardHostElements(block) {
  const kids = [...block.children];
  const start = cardHostStartIndex(kids);
  return kids.slice(start);
}

/**
 * @param {Element[]} hosts
 * @returns {Element[]}
 */
function hostsToCardRoots(hosts) {
  const out = [];
  hosts.forEach((h) => {
    if (h.tagName === 'UL') {
      out.push(...h.querySelectorAll(':scope > li'));
    } else {
      out.push(...expandPackedCardHosts(h));
    }
  });
  return out;
}

/**
 * Card rows sometimes omit block-level wrappers; gather nearest block-child ancestor per title field.
 * @param {Element} block
 * @returns {Element[]}
 */
function cardRootsFromTitleProps(block) {
  const titles = [...block.querySelectorAll('[data-aue-prop="title"]')];
  const seen = new Set();
  const roots = [];
  titles.forEach((t) => {
    let row = t;
    while (row?.parentElement && row.parentElement !== block) {
      row = row.parentElement;
    }
    if (!row || seen.has(row)) return;
    if (row.querySelector('[data-aue-prop="heading"]')) return;
    seen.add(row);
    roots.push(row);
  });
  return roots;
}

/**
 * @param {Element} block
 * @returns {ReturnType<typeof parseCardEl>[]}
 */
function readCards(block) {
  const hosts = collectCardHostElements(block);
  const roots = hostsToCardRoots(hosts);
  let parsed = roots.map(parseCardEl).filter(cardHasContent);
  if (parsed.length) return parsed;
  parsed = cardRootsFromTitleProps(block).map(parseCardEl).filter(cardHasContent);
  if (parsed.length) return parsed;
  const rows = [...block.querySelectorAll(':scope > div')];
  return rows.slice(2).map(parseCardEl).filter(cardHasContent);
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
  const kids = [...block.children];
  const hi = kids.findIndex((k) => k.querySelector('[data-aue-prop="heading"]'));
  const si = kids.findIndex((k) => k.querySelector('[data-aue-prop="subheading"]'));
  const headingRow = hi >= 0 ? kids[hi] : kids[0];
  let subheadingRow = si >= 0 ? kids[si] : (hi < 0 && kids.length > 1 ? kids[1] : null);
  if (subheadingRow && !subheadingRow.querySelector('[data-aue-prop="subheading"]')
      && subheadingRow.querySelector('[data-aue-prop="title"]')) {
    subheadingRow = null;
  }

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

  const footer = document.createElement('div');
  footer.className = 'bcview__footer';
  footer.setAttribute('role', 'region');
  footer.setAttribute('aria-label', 'Message composer');

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
