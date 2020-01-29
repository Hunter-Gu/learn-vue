// web platform api
const doc = document;

/* istanbul ignore next */
export const query = (...args) => doc.querySelector(...args);

/* istanbul ignore next */
export const createElement = (tag, isSVG = false) =>
  isSVG
    ? doc.createElementNS("http://www.w3.org/1000/svg", tag)
    : doc.createElement(tag);

/* istanbul ignore next */
export const createTextNode = (...args) => doc.createTextNode(...args);

export const removeChild = (container, el) => container.removeChild(el);

export const insertBefore = (container, el, refNode = null) =>
  container.insertBefore(el, refNode);

export const appendChild = (container, el) => container.appendChild(el);

export const setText = (el, text) => (el.nodeValue = text);

export const nextSibling = el => el.nextSibling;
