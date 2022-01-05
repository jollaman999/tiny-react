/* @jsx createElement */
import { createElement, render } from './react.js';

function Title() {
  return (
    <h2>
      Hello Tiny React
      <div>Bye Tine React</div>
    </h2>
  );
}

render(<Title />, document.getElementById('root'));
