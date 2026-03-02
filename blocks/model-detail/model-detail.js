import {
  div, span, h2, p,
} from '../../scripts/dom-helpers.js';
import { readBlockConfig, createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Get description HTML from block for richtext support (readBlockConfig only returns textContent).
 * @param {Element} block - The block element
 * @returns {string} HTML or empty string
 */
function getDescriptionHtml(block) {
  const rows = block.querySelectorAll(':scope > div');
  for (const row of rows) {
    const cols = [...row.children];
    if (cols.length >= 2) {
      const key = cols[0].textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (key === 'description') {
        const valueCell = cols[1];
        return valueCell.innerHTML?.trim() || valueCell.textContent?.trim() || '';
      }
    }
  }
  return '';
}

/**
 * Build spec row label + value.
 */
function specRow(label, value) {
  if (value == null || String(value).trim() === '') return null;
  return div({ class: 'model-detail-spec-row' },
    span({ class: 'model-detail-spec-label' }, label),
    span({ class: 'model-detail-spec-value' }, String(value).trim()),
  );
}

function emptyAsBlank(val) {
  if (val == null || val === '' || String(val).toLowerCase() === 'null' || String(val).toLowerCase() === 'undefined') return '';
  return String(val).trim();
}

/** Get value from block config; keys may be hyphenated (product-id) or underscore (product_id). */
function getConfig(config, key) {
  const hyphenated = key.replace(/_/g, '-');
  return config[key] ?? config[hyphenated] ?? '';
}

/** Get value from row by 1-based index (row 1 = product_id, row 2 = model_name, ...). */
function getValueFromRow(block, rowIndex) {
  const row = block.querySelector(`:scope > div:nth-child(${rowIndex})`);
  if (!row || !row.children || row.children.length < 2) return '';
  const valueCell = row.children[1];
  const anchor = valueCell.querySelector('a');
  const img = valueCell.querySelector('img');
  const p = valueCell.querySelector('p');
  if (anchor) return anchor.href || '';
  if (img) return img.src || '';
  if (p) return p.textContent?.trim() || '';
  return valueCell.textContent?.trim() || '';
}

/** Field order for position-based reading (must match model field order). */
const FIELD_ORDER = [
  'product_id', 'model_name', 'body_type', 'fuel_type', 'comfort_level',
  'price_range_tag', 'image_url', 'description', 'color',
];

/**
 * @param {Element} block
 */
export default function decorate(block) {
  const config = readBlockConfig(block);
  const descriptionHtml = getDescriptionHtml(block);

  const byPosition = FIELD_ORDER.map((_, i) => getValueFromRow(block, i + 1));

  const productId = emptyAsBlank(getConfig(config, 'product_id') || byPosition[0]);
  const modelName = emptyAsBlank(getConfig(config, 'model_name') || byPosition[1]);
  const bodyType = emptyAsBlank(getConfig(config, 'body_type') || byPosition[2]);
  const fuelType = emptyAsBlank(getConfig(config, 'fuel_type') || byPosition[3]);
  const comfortLevel = emptyAsBlank(getConfig(config, 'comfort_level') || byPosition[4]);
  const priceRangeTag = emptyAsBlank(getConfig(config, 'price_range_tag') || byPosition[5]);
  const imageUrl = emptyAsBlank(getConfig(config, 'image_url') || byPosition[6]);
  const description = descriptionHtml || emptyAsBlank(getConfig(config, 'description') || byPosition[7]);
  const color = emptyAsBlank(getConfig(config, 'color') || byPosition[8]);

  const specRows = [
    specRow('Body type', bodyType),
    specRow('Fuel type', fuelType),
    specRow('Comfort', comfortLevel),
    specRow('Color', color),
  ].filter(Boolean);

  const imageBlock = imageUrl
    ? (() => {
      const picture = createOptimizedPicture(imageUrl, modelName || 'Vehicle', false, [{ width: '900' }, { width: '600' }]);
      return div({ class: 'model-detail-image' }, picture);
    })()
    : div({ class: 'model-detail-image model-detail-image-placeholder' },
      span({ class: 'model-detail-placeholder-text' }, 'Add image in editor'),
    );

  const descriptionBlock = description
    ? (() => {
      const desc = div({ class: 'model-detail-description' });
      if (descriptionHtml) {
        desc.innerHTML = description;
      } else {
        desc.appendChild(p(description));
      }
      return desc;
    })()
    : null;

  const wrapper = div({ class: 'model-detail-wrapper' },
    div({ class: 'model-detail-main' },
      div({ class: 'model-detail-media' }, imageBlock),
      div({ class: 'model-detail-content' },
        productId ? span({ class: 'model-detail-product-id' }, productId) : null,
        modelName ? h2({ class: 'model-detail-title' }, modelName) : null,
        priceRangeTag ? p({ class: 'model-detail-price' }, priceRangeTag) : null,
        specRows.length ? div({ class: 'model-detail-specs' }, ...specRows) : null,
        descriptionBlock,
      ),
    ),
  );

  block.innerHTML = '';
  block.appendChild(wrapper);
}
