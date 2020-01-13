/* istanbul ignore next */
export const ELEMENT_TYPE = {
  HTML_ELEMENT: 1,
  SVG_ELEMENT: 1 << 1,

  NORMAL_COMPONENT_ELEMENT: 1 << 2,
  FUNCTIONAL_COMPONENT: 1 << 3,

  PORTAL: 1 << 4,
  FRAGMENT: 1 << 5,

  TEXT: 1 << 6
};

/* istanbul ignore next */
export const SVG = "svg";

/* istanbul ignore next */
export const CHILDREN_TYPE = {
  NO_CHILDREN: 1,
  SINGLE_CHILDREN: 1 << 1,
  MULTIPLE_CHILDREN: 1 << 2
};

/* istanbul ignore next */
export const FRAGMENT = Symbol();

export const PORTAL = Symbol();

// platform api
const doc = document;

/* istanbul ignore next */
export const createElement = (...args) => doc.createElement(...args);

/* istanbul ignore next */
export const createTextNode = (...args) => doc.createTextNode(...args);

/* istanbul ignore next */
export const query = (...args) => doc.querySelector(...args);

/* istanbul ignore next */
export const VNODE_DATA_KEY = {
  ATTRS: "attrs",
  PROPS: "props",
  STYLE: "style",
  CLASS: "class",
  EVENTS: "events"
};
