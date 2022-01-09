/* @jsx createElement */
import {createElement, render, useState} from './react.js';

function Title() {
    console.count('Check Rendering Title')
    let [count, setCount] = useState(0)

    console.log('count', count)

    const handleCount = (action, count) => {
        console.log('handleCount count', count)

        switch (action) {
            case 'plus':
                setCount(count + 1);
                break;
            case 'minus':
                setCount(count - 1);
                break;
        }
    };

  return (
    <h2>
      Hello Tiny React
      <div>Bye Tiny React</div>
        <div>Count : {count}</div>
        <button onClick={() => handleCount('plus', count)}>+</button>
        <button onClick={() => handleCount('minus', count)}>-</button>
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
