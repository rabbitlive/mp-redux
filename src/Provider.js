import isFunction from 'lodash.isfunction/index'
import checkEnvironment from './checkEnvironment'

/**
 * checkStoreShape
 *
 * @param {Function} subscribe
 * @param {Function} dispatch
 * @param {Function} getState
 * @return Boolean
 */
function checkStoreShape({ subscribe, dispatch, getState }) {
    return isFunction(subscribe) &&
	isFunction(dispatch) &&
	isFunction(getState)
}

/**
 * Provider
 *
 * @param {Function} store = {}
 * @param {Function} options = {}
 * @return Boolean
 */
export default function Provider(store = {}) {

    if(!checkEnvironment())
	throw new Error('Make sure use wxapp-redux with wx environment.')

    // Check store shape.
    if(!checkStoreShape(store))
	throw new TypeError('Please provide a redux store via `createStore`')
    
    return function WrapProvider(options = {}) {
	const { storeKey } = options
	
	if(options.store && !storeKey)
	    throw new ReferenceError('The `store` key is already exist, please replace `options.store` to other or given options.storeKey')
	
	options[storeKey || 'store'] = store

	// Can't pass options to global.App
	const WXAPPREDUXEXPORTKEY = '__WXAPPREDUXEXPORT__'
	const isExport = options[WXAPPREDUXEXPORTKEY]
	if(isExport) return options
	
	return App(options)
    }
}
