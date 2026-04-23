const MOUNT_ID = 'brand-concierge-mount';
const BC_SELECTOR = '#brand-concierge-mount';
const INPUT_PLACEHOLDER =
  'Ask a question to get instant answers about our tools and solutions.';

const STATE = {
  CHATBAR: 'chatbar',
  HIDDEN: 'hidden',
  MODAL: 'modal',
  MINIMIZED: 'minimized',
};

const LOG_PREFIX = '[bcview]';

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
    // sendEvent can fail temporarily; bootstrap can still proceed in many cases.
    // eslint-disable-next-line no-console
    console.warn(`${LOG_PREFIX} sendEvent failed`, error);
  }
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  let currentState = STATE.CHATBAR;
  let bcInitialized = false;
  let bootstrapping = false;

  const root = document.createElement('div');
  root.className = 'bcview__root';

  root.innerHTML = `
    <div class="bcview__https-warning" hidden>
      <strong>HTTPS required:</strong> Brand Concierge requires HTTPS to communicate with Adobe Edge services.
    </div>

    <div class="bcview__error" hidden></div>

    <div class="bcview__chat-bar">
      <button type="button" class="bcview__ai-icon" data-role="hide-chat-bar" title="Hide chat bar">
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
        <input type="text" class="bcview__input" autocomplete="off" aria-label="Message input" placeholder="${INPUT_PLACEHOLDER}">
        <button type="button" class="bcview__send" aria-label="Send message" title="Send">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    </div>

    <button type="button" class="bcview__floating-icon" title="Open chat" aria-label="Open chat">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"></path>
        <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"></path>
      </svg>
    </button>

    <div class="bcview__backdrop"></div>

    <div class="bcview__modal" role="dialog" aria-modal="true" aria-label="Brand Concierge chat">
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
    </div>

    <div class="bcview__confirm-overlay" aria-hidden="true">
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
    </div>
  `;

  block.replaceChildren(root);

  const dom = {
    chatBar: root.querySelector('.bcview__chat-bar'),
    input: root.querySelector('.bcview__input'),
    send: root.querySelector('.bcview__send'),
    aiIcon: root.querySelector('[data-role="hide-chat-bar"]'),
    floatingIcon: root.querySelector('.bcview__floating-icon'),
    backdrop: root.querySelector('.bcview__backdrop'),
    modal: root.querySelector('.bcview__modal'),
    minimize: root.querySelector('[data-role="minimize"]'),
    close: root.querySelector('[data-role="close"]'),
    confirmOverlay: root.querySelector('.bcview__confirm-overlay'),
    confirmNo: root.querySelector('[data-role="confirm-no"]'),
    confirmYes: root.querySelector('[data-role="confirm-yes"]'),
    httpsWarning: root.querySelector('.bcview__https-warning'),
    error: root.querySelector('.bcview__error'),
    mount: root.querySelector(BC_SELECTOR),
  };

  function setState(nextState) {
    currentState = nextState;

    dom.chatBar.classList.toggle('bcview__chat-bar--hidden', nextState !== STATE.CHATBAR);
    dom.floatingIcon.classList.toggle(
      'bcview__floating-icon--visible',
      nextState === STATE.HIDDEN || nextState === STATE.MINIMIZED,
    );

    const showModal = nextState === STATE.MODAL;
    dom.modal.classList.toggle('bcview__modal--visible', showModal);
    dom.backdrop.classList.toggle('bcview__backdrop--visible', showModal);
  }

  function destroyBC() {
    dom.mount.innerHTML = '';
    dom.mount.removeAttribute('data-initial-message');
    bcInitialized = false;
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
    } catch (error) {
      showError(dom.error, 'Unable to start Brand Concierge right now. Please check Adobe scripts/configuration.');
      // eslint-disable-next-line no-console
      console.error(`${LOG_PREFIX} bootstrap failed`, error);
    } finally {
      bootstrapping = false;
    }
  }

  async function openModal(initialMessage) {
    await bootstrapBC(initialMessage);
    if (!bcInitialized) return;
    setState(STATE.MODAL);
  }

  async function submitFromBar() {
    const message = dom.input.value.trim();
    if (!message) return;

    dom.input.value = '';
    await openModal(message);
  }

  function handleCloseRequest() {
    dom.confirmOverlay.classList.add('bcview__confirm-overlay--visible');
  }

  function handleCloseCancel() {
    dom.confirmOverlay.classList.remove('bcview__confirm-overlay--visible');
  }

  function handleCloseConfirm() {
    handleCloseCancel();
    destroyBC();
    setState(STATE.CHATBAR);
  }

  function handleFloatingIconClick() {
    if (currentState === STATE.HIDDEN) {
      setState(STATE.CHATBAR);
      return;
    }

    if (currentState === STATE.MINIMIZED) {
      setState(STATE.MODAL);
    }
  }

  dom.send.addEventListener('click', submitFromBar);
  dom.input.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await submitFromBar();
    }
  });
  dom.aiIcon.addEventListener('click', () => setState(STATE.HIDDEN));
  dom.floatingIcon.addEventListener('click', handleFloatingIconClick);
  dom.minimize.addEventListener('click', () => setState(STATE.MINIMIZED));
  dom.close.addEventListener('click', handleCloseRequest);
  dom.confirmNo.addEventListener('click', handleCloseCancel);
  dom.confirmYes.addEventListener('click', handleCloseConfirm);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (dom.confirmOverlay.classList.contains('bcview__confirm-overlay--visible')) {
      handleCloseCancel();
      return;
    }
    if (currentState === STATE.MODAL) {
      handleCloseRequest();
    }
  });

  if (window.location.protocol !== 'https:') {
    dom.httpsWarning.hidden = false;
  }

  setState(STATE.CHATBAR);
}
