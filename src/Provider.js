function isFunction(x) {
    return typeof x === 'function'
}

function checkStoreShape({ subscribe, dispatch, getState }) {
    return isFunction(subscribe) &&
	isFunction(dispatch) &&
	isFunction(getState)
}

export default function Provide(store, context) {
    if(!checkStoreShape(store))
	throw new TypeError('Bad store!')
    
    return options => {
	options.store = store
	return context(options)
    }
}
