/* @jsx createElement */
import { createElement, render } from './react.js';

function Title() {
  return <h2>Hello Tiny React</h2>;
}

render(
  <Title />,
  <div>Hello Tine React!</div>,
  document.getElementById('root')
);
