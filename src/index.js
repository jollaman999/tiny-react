/* @jsx createElement */
import { createElement, render } from './react.js';

function Title() {
  return (
    <h2>
      Hello Tiny React
      <div>Bye Tiny React</div>
    </h2>
  );
}

export class Component {}

class Body extends Component {
    render() {
        return <div>This is Class Component</div>
    }
}

console.log(Title(), new Body().render()) // 가상돔 확인해보기

render(<div><Title /><Body /></div>, document.getElementById('root'));
