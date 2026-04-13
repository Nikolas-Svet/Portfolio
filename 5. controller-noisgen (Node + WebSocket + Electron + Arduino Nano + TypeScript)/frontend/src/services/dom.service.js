// @ts-check

/**
 * @template {Element} T
 * @param {string} selector
 * @param {ParentNode} [scope=document]
 * @returns {T}
 */
export function queryRequired(selector, scope = document) {
  const element = scope.querySelector(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return /** @type {T} */ (element);
}

/**
 * @template {Element} T
 * @param {string} selector
 * @param {ParentNode} [scope=document]
 * @returns {T[]}
 */
export function queryAll(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/**
 * @param {Element | null | undefined} element
 * @param {boolean} hidden
 */
export function setHidden(element, hidden) {
  if (!element) {
    return;
  }

  element.classList.toggle('is-hidden', hidden);
}

/**
 * @param {Element | null | undefined} element
 * @param {boolean} active
 */
export function setActive(element, active) {
  if (!element) {
    return;
  }

  element.classList.toggle('is-active', active);
}

/**
 * @param {Element | null | undefined} element
 * @param {boolean} disabled
 */
export function setDisabled(element, disabled) {
  if (!element || !('disabled' in element)) {
    return;
  }

  element.disabled = disabled;
}

/**
 * @param {Element | null | undefined} element
 * @param {string} value
 */
export function setText(element, value) {
  if (!element) {
    return;
  }

  element.textContent = value;
}

/**
 * @param {HTMLInputElement | null | undefined} element
 * @param {string} value
 */
export function setValue(element, value) {
  if (!element) {
    return;
  }

  element.value = value;
}
