export function render(vdom, container) {
  console.log(vdom, container);
}

export function createElement(tagName, props, ...children) {
  return { tagName, props, children };
}
