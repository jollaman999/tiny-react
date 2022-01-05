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
render( /*#__PURE__*/React.createElement("div", null, "Hello Tine React!"), document.getElementById('root'));
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