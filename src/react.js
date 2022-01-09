import { Component } from "./index.js";

export function useState(initValue) {
  let value = initValue;

  return [
    value,
    (nextValue) => {
      value = nextValue;
    }
  ]
}

function renderRealDOM(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') return document.createTextNode(vdom);
  if (vdom === undefined) return;
  const $el = document.createElement(vdom.tagName);

  if (vdom.props && Object.keys(vdom.props).includes('onClick')) {
    $el.addEventListener('click', vdom.props.onClick);
  }

  vdom.children.map(renderRealDOM).forEach(node => {
    $el.appendChild(node);
  });
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
      // 클래스형 컴포넌트
      const instance = new tagName({
        props,
        ...children
      });
      return instance.render();
    } // 함수형 컴포넌트


    return tagName.apply(null, [props, ...children]);
  }

  return {
    tagName,
    props,
    children
  };
}