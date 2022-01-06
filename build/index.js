/* @jsx createElement */
import { createElement, render } from './react.js';

function Title() {
  return createElement("h2", null, "Hello Tiny React", createElement("div", null, "Bye Tiny React"));
}

export class Component {}

class Body extends Component {
  render() {
    return createElement("div", null, "This is Class Component");
  }

}

console.log(Title(), new Body().render()); // 가상돔 확인해보기

render(createElement("div", null, createElement(Title, null), createElement(Body, null)), document.getElementById('root'));