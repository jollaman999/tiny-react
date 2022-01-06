import { Component } from "./index.js";

function renderRealDOM(vdom) {
  if (typeof vdom === 'string') return document.createTextNode(vdom);
  if (vdom === undefined) return;
  const $el = document.createElement(vdom.tagName);
  vdom.children.map(renderRealDOM).forEach(node => $el.appendChild(node));
  return $el;
}

export const render = function () {
  let prevVdom = null;
  return function (nextVdom, container) {
    if (prevVdom === null) prevVdom = nextVdom; // diff 로직이 존재할 것

    container.appendChild(renderRealDOM(nextVdom));
  };
}();
export function createElement(tagName, props, ...children) {
  if (typeof tagName === 'function') {
    if (tagName.prototype instanceof Component) {
      const instance = new tagName({
        props,
        ...children
      });
      return instance.render();
    }

    return tagName.apply(null, [props, ...children]);
  }

  return {
    tagName,
    props,
    children
  };
}