<div align="center">
	<img src="assets/wechat.png" width="60" />
	<img src="assets/redux.png" width="60" />
</div>


### Installation

wxapp-redux 需要依赖 **[Redux](https://github.com/reactjs/redux)**.


	yarn add wxapp-redux


然后, 复制 `dist/wxapp-redux.js` 或 `dist/wxapp-redux.min.js` 到微信小程序项目中，比如`/lib`。当然，不要忘记导入`redux.js`。




### Usage


#### Provider(store: Store)([appOptions: Object], [notExportApp: Boolean = false])

首先，需要注入`store`到全局的`App`，可以使用`Provider`：


```js
Provider(store)({
  foo: 42		
})
```


这里会将`store`绑定到`appOptions.store`属性上，这就要确保`appOptions.store`没有被占用。如果需要换其他key，需要传入`appOptions.storeKey`：


```js
Provider(store)({
  storeKey: 'foo'
})
```

Provider将多余的属性传递给App，并在其中已经内置了App。如果不想内置，可以传入一个false：

```js
const options = Provider(store)({
  foo: 42
}, false)

App(options)
```


#### connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])([pageOptions: Object = {}], [style: Object = undefined], [notExportByPage: Boolean = false])

在`Page`中，使用`connect`可以将**redux store**绑定到view上：

```js
function mapStateToProps() {
  //...
}

function mapDispatchToProps() {
  //...
}

connect(mapStateToProps, mapDispatchToProps)()
```

`connect` 将 state 绑定到 `pageOption.data` 上，这样在视图中就可以使用 `{{foo}}` 来绑定属性。dispatch 会被绑定到 `pageOption` 上，可以通过视图的 bindTap 等事件触发 `dispatch(action)` 来改变 store。

`pageOptions` 的其他属性会原样传递给 `Page(pageOptions)`

同样，connect 也内置了 `Page`，不需要这个，可以给 connect 传递一个 `false` 来直接导出 `pageOptions`。

如果希望使用 CSS Modules，可以将 style 传递给 connect。这样 style 会被绑定到 `pageOption.data`。

下面是一个计数器 connect 的简单使用：

```js
/**
 * reducers/counter.js
 */
import { ActionType } from '../actions/counter'

export const initState = {
  value: 5,
  max: 10,
  min: 0
}

export default function(state = initState, action) {
  const { type, payload } = action

  switch(type) {
  case ActionType.COUNTER_INC:
    return Object.assign({}, state, {
      value: Math.min(state.max, state.value + 1)
    })

  case ActionType.COUNTER_DEC:
    return Object.assign({}, state, {
      value: Math.max(state.min, state.value - 1)
    })

  default: return state
  }
}



/**
 * actions/counter.js
 */
export const ActionType = {
  COUNTER_INC: 'COUNTER_INC',
  COUNTER_DEC: 'COUNTER_DEC'
}

export function counterInc() {
  return {
    type: ActionType.COUNTER_INC
  }
}

export function counterDec() {
  return {
    type: ActionType.COUNTER_DEC
  }
}


/**
 * pages/index/index.js
 */
import { compose } from 'redux'
import { connect } from 'wxapp-redux'
import * as action from '../../actions/counter'
import style from '../../styles/counter.css'

function mapStateToProps(state) {
  return {
    counter: state.counter.value
  }
}

function mapDispatchToProps(dispatch) {
  return {
    inc: compose(dispatch, action.counterInc),
    dec: compose(dispatch, action.counterDec)
  }
}


connect(mapStateToProps, mapDispatchToProps)({}, style)
```

```css
/**
 * styles/counter.css
 */
.btnHover {
  background: blue;
}
```

```html
<!-- pages/index/index.html -->
<view>
  <button size="mini" bindtap="dec" hover-class="{{style.btnHover}}">-</button>
  <view>{{counter}}</view>
  <button size="mini" bindtap="inc">+</button>
</view>
```


### TODO 项目构建
