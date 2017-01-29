import isFunction from 'lodash.isfunction/index'

function checkStoreShape({ subscribe, dispatch, getState }) {
    return isFunction(subscribe) &&
	isFunction(dispatch) &&
	isFunction(getState)
}

export default function Provide(store, options) {
    if(!checkStoreShape(store))
	throw new TypeError('Bad store!')
    
    return wxAppOptions => {
	if(wxAppOptions.store)
	    throw new Error('The `store` key already exist.')
	
	wxAppOptions.store = store
	return App(wxAppOptions)
    }
}
