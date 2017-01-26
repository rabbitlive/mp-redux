import isFunction from 'lodash.isfunction'


function checkStoreShape({ subscribe, dispatch, getState }) {
    return isFunction(subscribe) &&
	isFunction(dispatch) &&
	isFunction(getState)
}

export default function Provide(store) {
    if(!checkStoreShape(store))
	throw new TypeError('Bad store!')
    
    return options => {
	options.store = store
	return App(options)
    }
}
