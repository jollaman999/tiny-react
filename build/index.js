/* @jsx createElement */
import { createElement, render, useState } from './react.js';

function Title() {
  console.count('Check Rendering Title');
  let [count, setCount] = useState(0);
  console.log('count', count);

  const handleCount = (action, count) => {
    console.log('handleCount count', count);

    switch (action) {
      case 'plus':
        setCount(count + 1);
        break;

      case 'minus':
        setCount(count - 1);
        break;
    }
  };

  return createElement("h2", null, "Hello Tiny React", createElement("div", null, "Bye Tiny React"), createElement("div", null, "Count : ", count), createElement("button", {
    onClick: () => handleCount('plus', count)
  }, "+"), createElement("button", {
    onClick: () => handleCount('minus', count)
  }, "-"));
}

export class Component {}

class Body extends Component {
  render() {
    return createElement("div", null, "This is Class Component");
  }

}

console.log(Title(), new Body().render()); // 가상돔 확인해보기

render(createElement("div", null, createElement(Title, null), createElement(Body, null)), document.getElementById('root'));