export function render(vdom, container) {
  console.log(vdom, container);
}

export function createElement(tagName, props, ...children) {
  if (typeof tagName === 'function')
    return tagName.apply(null, [props, ...children]);

  return { tagName, props, children };
}
