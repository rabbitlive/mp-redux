import isFunction from 'lodash.isfunction/index'

function checkStoreShape({ subscribe, dispatch, getState }) {
    return isFunction(subscribe) &&
	isFunction(dispatch) &&
	isFunction(getState)
}

export default function Provide(store) {
    if(!checkStoreShape(store))
	throw new TypeError('Bad store!')
    
    return function(options, ...args) {
	const { storeKey } = options
	
	if(options.store && !storeKey)
	    throw new Error('The `store` key is already exist, please replace `options.store` to other or given options.storeKey')
	
	options[storeKey || 'store'] = store

	const notExportByWXApp = args.length ? Boolean(args[args.length - 1]) : false
	if(notExportByWXApp) return options
	
	return App(options)
    }
}
