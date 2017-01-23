wxapp-redux
----


## Installation

wxapp-redux require **React-Redux** 5.x or later.

```sh
yarn add wxapp-redux
```

Then, you can use `webpack` or `Browserify` build source.


## Usage

make redux store with wxapp you can use `Provider(store, options)`, e.g

```js
Provider(store, {
  foo: 42		
})
```

Provider set `options.store` with redux store, then pass the options to global `App`.


Connect a `wxapp Page` with store, should use `connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])`

TODO

