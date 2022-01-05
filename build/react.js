export function render() {}
export function createElement(tagName, props, ...children) {
  return {
    tagName,
    props,
    children
  };
}