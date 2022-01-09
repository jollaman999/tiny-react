## REACT 만들어보며 이해하기
> The RED : 김민태 React와 Redux로 구현하는 아키텍쳐와 리스크 관리

**0. pre think!**

가상돔은 기본적으로 html 태그로 변환시킬 수 있는 구조로 되어있을 것이다.

**1. 가상돔의 구조 생각해보기**

돔의 element는 아래와 같이 생겼다.
이러한 돔을 만드려면 어떤 정보가 필요할까?
```html
<div id="root" class="container">
    <span>blabla</span>
</div>
```

돔을 가상으로 만든다면 돔을 그릴 수 있도록 돔에 대한 정보가 있어야 할 것이다.</br>
그래서 아래와 같은 구조로 생각해볼 수 있다.
```
{
    tagName: 'div',
    props: {
        id: 'root',
        className: 'container'
    },
    children: [
        {
            tagName: 'span',
            props: {},
            children: [
                'blabla'
            ]
        }
    ]
}
```

**2. tiny-react의 실습 환경 구성**

```shell
npm init # 프로젝트 초기화

# tiny-react를 트랜스파일링 하기 위해 babel 및 preset 설치
npm i -D @babel/core @babel/cli @babel/preset-react

# babel.config.json 추가
{
  "presets": ["@babel/preset-react"]
}
```

**3. 기본적인 React의 사용 형태 작성 1**

리액트에는 어떤 함수가 있을까 생각해보면 기본적으로 가상돔을 실제돔에 그려주는 render 함수가 있다.

```javascript
// /src/react.js
export function render() {}
```

리액트에서 구현된 render 함수는 아래와 같이 사용할 수 있다.
```javascript
// /src/index.js
import { render } from './react.js';

render(<div>Hello Tine React!</div>, document.getElementById('root'));
```

위처럼 작성 후 바벨로 트랜스파일링 한 결과를 보면 아래와 같이 출력되는데
render 함수의 첫번쨰 인자가 React.createElement로 감싸진 형태로 변환된 것을 볼 수 있다.
이를 통해서 바벨이 render 함수를 해석할 때 preset-react를 통해서 render함수의 첫 번째 인자를 React의 createElement 함수를 사용하도록 변환하는 것으로 추측해볼 수 있다.</br>
그래서 createElement 함수도 리액트에 있을 것이라고 생각해볼 수 있다.
```javascript
// /build/index.js
import { render } from './react.js';
render( /*#__PURE__*/React.createElement("div", null, "Hello Tiny React!"), document.getElementById('root'));
```

**4. 기본적인 React의 사용 형태 작성 2**

createElement 함수도 react.js에 추가해주자.
```javascript
// /src/react.js
export function render() {}

export function createElement() {}
```

babel에게 jsx 구문을 내가 새로 만든 createElement로 해석하도록 지시해준다.
@jsx는 해당 jsx 구문을 어떤 지시어로 변환할 것인가에 대한 명세이다. 기본값은 React.createElement 이다.
```javascript
// /src/index.js
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

```

@babel/preset-react에 약속이 정해져 있어서 바벨로 트랜스파일링 시 규칙대로 변환된다.
```javascript
// /build/index.js
/* @jsx createElement */
import { createElement, render } from './react.js';

function Title() {
    return createElement("h2", null, "Hello Tiny React");
}

render(createElement(Title, null), createElement("div", null, "Hello Tine React!"), document.getElementById('root'));
```

**5. 기본적인 React의 사용 형태 작성 2**

4단계에서 render 함수에 커스텀 Element 인 Title을 전달 후 트랜스파일링 된 결과를 살펴보면<br/>
createElement의 인자로 태그명, 속성, children이 전달되는 것을 확인할 수 있다.<br/>
그래서 createElement에 인자를 작성해보자.<br/>
createElement는 노드의 가상돔을 반환해주는 역할을 하므로 받은 인자를 통해 객체 반환을 해준다.
(nodes: DOM API상에 존재하는 모든 것들. 그것들을 모두 포괄하는 이름이 node이다.)
```javascript
// /src/react.js
export function render() {}

export function createElement(tagName, props, ...children) {
    return { tagName, props, children };
}
```

**6. render 인자 확인하기**

```javascript
// /src/react.js
export function render(vdom, container) {
    console.log(vdom, container);
}

export function createElement(tagName, props, ...children) {
    return { tagName, props, children };
}

```

render 함수에 넘겨주는 인자는 컴포넌트와, 가상돔을 랜더링 할 element 이다.
render에 들어온 인자를 console로 출력해보면 tagName에 함수가 들어온 것을 확인 할 수 있다.

```
{props: null, children: Array(0), tagName: ƒ}
children: []
props: null
tagName: f Title()
```

번들된 파일도 살펴보면

```javascript
// /build/index.js
/* @jsx createElement */
import { createElement, render } from './react.js';

function Title() {
    return createElement("h2", null, "Hello Tiny React");
}

render(createElement(Title, null), document.getElementById('root'));
```

render 함수 내에 첫번째 인자로 createElement에서 반환된 값(vdom)이 들어가고 createElement 함수의 첫 번째 인자로는 Title 함수가 들어간다.<br/>
createElement의 첫 번째 인자는 태그명인 문자열(ex. h2) 또는 함수(ex. Title)가 들어오는 것을 알 수 있다.<br/>
이는 jsx 컴파일러가 대문자로 시작하는 함수는 사용자가 정의한 컴포넌트로 인식하여 함수자체를 넘겨주도록 디자인이 되어있다.<br/>
따라서 createElement 함수에서 이 함수(ex. Title)를 실행하여 주어야 한다.

**7. createElement 수정**

```javascript
// /src/react.js
export function render(vdom, container) {
    container.appendChild()
}

export function createElement(tagName, props, ...children) {
    if (typeof tagName === 'function')
        return tagName.apply(null, [props, ...children]);

    return { tagName, props, children };
}

```

createElement에서 함수를 실행해주면 render에서 첫 번째 인자로 태그명이 전달된다.
```
// 브라우저 콘솔
Object
children: ['Hello Tiny React']
props: null
tagName: "h2"
```

**8. render 구현**

render 함수는 인자로 넘어온 vdom 객체를 랜더링 해주는 역할을 수행하도록 구현한다.

```javascript
// /src/react.js
function renderRealDOM(vdom) {
    if (typeof vdom === 'string') return document.createTextNode(vdom);
    if (vdom === undefined) return;

    const $el = document.createElement(vdom.tagName);

    vdom.children.map(renderRealDOM).forEach(node => $el.appendChild(node));

    return $el;
}

export function render(vdom, container) {
    container.appendChild(renderRealDOM(vdom));
}

export function createElement(tagName, props, ...children) {
    if (typeof tagName === 'function')
        return tagName.apply(null, [props, ...children]);

    return { tagName, props, children };
}
```

vdom은 children 배열을 element로 변환하는 재귀함수로 구현되어야 한다. 따라서 renderRealDOM 함수로 분리하여 구현한다.
여기까지 하면 기본 구조는 완료 되었다.



---

우리가 생각하는 가상돔 이라하면 diff 알고리즘을 이용하여 현재 dom과 업데이트 된 부분을 비교하여 변경된 부분만 적용하는 부분이 필요하다.
그러나 7번의 과정까지는 diff 알고리즘은 구현하지 않았고 간단하게 jsx로 만들어진 컴포넌트를 가상돔으로 만들고,<br/>
그 가상돔의 실체는 무엇이고 그 가상돔은 어떻게 실제돔으로 바꾸는지까지만 구현 된 것이다. (그 가상돔의 실체를 알아본 과정이었다.)

이 구조까지만 보면 아쉬우니깐 실제 리액트에서는 어떤식으로 가상돔의 현재버전과 업데이트 할 가상돔을 비교할 수 있는지 구조만 잡아보자!<br/>
함수 내에서 이전 상태를 알 수 있으려면 어떻게해야할까.. 클로저를 사용해보자..

**9. render 함수를 클로저를 이용하여 이전 상태를 기억하도록 수정**

```javascript
// /src/react.js
function renderRealDOM(vdom) {
    if (typeof vdom === 'string') return document.createTextNode(vdom);
    if (vdom === undefined) return;

    const $el = document.createElement(vdom.tagName);

    vdom.children.map(renderRealDOM).forEach(node => $el.appendChild(node));

    return $el;
}

export const render = (function() {
    let prevVdom = null;
    
    return function (nextVdom, container) {
        if (prevVdom === null)
            prevVdom = nextVdom;
        
        // diff logic
        
        container.appendChild(renderRealDOM(nextVdom));
    }
})();

export function createElement(tagName, props, ...children) {
    if (typeof tagName === 'function')
        return tagName.apply(null, [props, ...children]);

    return { tagName, props, children };
}
```

기존의 함수와 동일하게 동작하면서 이전 상태값을 클로저를 통해 기억해둘 수 있도록 IIFE를 활용하여 수정한다.
diff logic 부분에서 이전값과 비교 알고리즘을 작성할 수 있을 것이다.
실제 구현은 이렇게 단순하지 않겠지만, Tiny react에서는 간단히 이정도만 생각하도록 한다.

**10. 클래스 컴포넌트 랜더링하기**

```javascript
/* @jsx createElement */
// 해당 jsx 구문을 어떤 지시어로 변환할 것인가에 대한 명세 default React.createElement
import { createElement, render } from './react.js';

export class Component {
}

function Title() {
   return (
           <div>
              <h2>안녕, React!</h2>
              <p>반가워!</p>
              <div>This is Functional Component</div>
              <Body/>
           </div>
   )
}

class Body extends Component {
   render() {
      return <div>This is Class Component</div>
   }
}

console.log(Title()); // 가상돔의 형태를 볼 수 있도록 확인

render(<Title/>, document.querySelector('#root'));

```

Title 함수는 함수형 컴포넌트이다. 그런데 React에는 클래스형 컴포넌트도 있으므로 클래스형 컴포넌트를 작성해서 랜더링을 해보도록 하자.
클래스 인스턴스를 생성해주어야하기 때문에 createElement 함수 내에서 해당 인스턴스를 생성하여 반환해주어야한다.
따라서 createElement 함수에서 인스턴스를 생성하는 로직을 추가한다.

```javascript
export function createElement(tagName, props, ...children) {
    if(typeof tagName === 'function') {
        if(tagName.prototype instanceof Component) {
            const instance = new tagName({...props, children});
            return instance.render();
        }
        else
            return tagName.apply(null, [ props, ...children ]);
    }
    
    return {tagName, props, children};
}
```

여기까지 하면 동작을 한다.
다만 프로퍼티 처리, 클래스컴포넌트의 라이프사이클,
인스턴스 생성 제한(인스턴스를 전역적인 저장소에 저장 후 상태를 관리 > 함수형 컴포넌트가 상태를 가지지 않는 이유를 생각해 볼 수 있다.) 등..

**11. hook**

함수형 컴포넌트가 어떻게 상태를 가질 수 있을까?
우선은 가장 많이 쓰이는 useState 훅을 작성해보자.

```javascript
export function useState(initValue) {
    let value = initValue;
    
    return [
        value,
        (nextValue) => {
            value = nextValue;
        }
    ]
}
```

useState 훅은 단순히 위와같은 형태로 구현 되어있는데, 초기 랜더링 이후에 함수가 이전 값을 가지고 있으려면,
값을 관리할 수 있는 공간이 따로 있어야 겠다는 발상을 해볼 수 있다.

훅의 상태를 관리하는 hooks라는 컨텍스트를 만들어서 상태를 관리할 수 있도록 수정하자!
대략적으로 아래와 같이 수정하면 createElement 함수와 useState 함수는 독립적이어서 서로의 상태를 알 수 없었지만,
하나의 컨텍스트를 공유하면서 이전 상태를 클로저로 관리할 수 있다.

```javascript
let hooks = [];
let currentComponent = -1;

export function useState(initValue) {
    let position = currentComponent;
    
    if(!hooks[position]) {
        hooks[position] = initValue;
    }
    
    return [
        hooks[position],
        (nextValue) => {
            hooks[position] = nextValue;
        }
    ]
}

export function createElement(tagName, props, ...children) {
   if(typeof tagName === 'function') {
      if(tagName.prototype instanceof Component) { // 클래스형 컴포넌트
         const instance = new tagName({...props, children});
         return instance.render();
      }
      else { // 함수형 컴포넌트
         currentComponent++; // <-- 이 hook이 조건문 안에 들어가지 못하는 이유!

         return tagName.apply(null, [ props, ...children ]);
      }
   }

   return {tagName, props, children};
}
```

리액트 문서에서 살펴보면 컴포넌트 내에서 hook의 갯수는 동일해야한다고 한다.<br/>
hook은 함수형 컴포넌트에서만 사용할 수 있고, 컴포넌트 내의 hook의 수가 변하지 않는다는 전제하에 동작한다.

여기까지 간단히 React 라이브러리가 어떻게 구현되었을지 의사코드를 작성하면서 학습하였다.<br/>
render 함수와 createElement 함수는 간단히 동작하는 것까지 확인 가능하다.<br/>
하지만 useState를 사용하고 화면에 다시 렌더링 되는 모습을 확인하고 싶다면, 추가적인 구현이 필요하다.<br/>
아직은 어떻게 해야 간단히 동작하도록 구현할 수 있는지 분석중에 있다. (어렵네.. 😬 아직은 수련이 부족하다..)

