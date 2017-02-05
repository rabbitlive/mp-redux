<img src="assets/wechat.png" width="60" />
<img src="assets/redux.png" width="60" />



## Installation

wxapp-redux require **React-Redux** 5.x or later.


	yarn add wxapp-redux


Then, you can use `webpack` or `Browserify` build source.


## Usage

make redux store with wxapp you can use `Provider(store)`, e.g


	Provider(store)({
	  foo: 42		
	})



Provider set `options.store` with redux store, then pass the options to global `App`.

Connect a `wxapp Page` with store, should use `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`

#+BEGIN_SRC javascript
connect(mapStateToProps, mapDispatchToProps)({
  foo: 42
})
#+END_SRC

TODO

