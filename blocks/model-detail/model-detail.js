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

/**
 * @param {Element} block
 */
export default function decorate(block) {
  const config = readBlockConfig(block);
  const descriptionHtml = getDescriptionHtml(block);

  const productId = emptyAsBlank(config.product_id);
  const modelName = emptyAsBlank(config.model_name);
  const bodyType = emptyAsBlank(config.body_type);
  const fuelType = emptyAsBlank(config.fuel_type);
  const comfortLevel = emptyAsBlank(config.comfort_level);
  const priceRangeTag = emptyAsBlank(config.price_range_tag);
  const imageUrl = emptyAsBlank(config.image_url);
  const description = descriptionHtml || emptyAsBlank(config.description);
  const color = emptyAsBlank(config.color);

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
