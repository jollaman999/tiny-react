/* @jsx createElement */
import { createElement, render } from './react.js';

function Title() {
  return createElement('h2', null, 'Hello Tiny React');
}

render(
  createElement(Title, null),
  createElement('div', null, 'Hello Tiny React!'),
  document.getElementById('root')
);
