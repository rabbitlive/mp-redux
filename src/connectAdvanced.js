import invariant from 'invariant'
import Subscription from 'react-redux/src/utils/Subscription'

export default function connectAdvance(
    selectorFactory,
    {
	getDisplayName = name => `ConnectAdvanced(${name})`,
	methodName = 'connectAdvanced',
	renderCountProp = undefined,
	shouldHandleStateChanges = true,
	storeKey = 'store',

	// the `Page` function always return undefined
	withRef = false,

	    ...connectOptions
    }
) {
    const subscriptionKey = storeKey + 'Subscription'
    
    // No hot reload
    const version = 0
    
    
    return function wrapWithConnect(options = {}, wxpage) {

	// A... wtf with the display name, maybe the file path?
	const wrappedComponentName = options.displayName
	      || options.name
	      || 'Component'
	
	const displayName = getDisplayName(wrappedComponentName)
	
	
	const selectorFactoryOptions = {
		...connectOptions,
	    getDisplayName,
	    methodName,
	    renderCountProp,
	    shouldHandleStateChanges,
	    storeKey,
	    withRef,
	    displayName,
	    wrappedComponentName,
	    options
	}


	const store = getApp().store
	const { dispatch, getState } = store
	const sourceSelector = selectorFactory(dispatch, selectorFactoryOptions)

	const selector = {
	    props: sourceSelector(store.getState()),
	    run: function runComponentSelector(props) {
		try {
		    const nextProps = sourceSelector(getState(), props)
		    if (selector.error || nextProps !== selector.props) {
			selector.props = nextProps
			selector.error = null
		    }
		} catch (error) {
		    console.log(error)
		    selector.error = error
		}
	    }
	}

	const subscription = new Subscription(store)
	const dummyState = {}

	function changeState(props) {
	    this.setData(props)
	}

	subscription.onStateChange = function onStateChange() {
	    selector.run()
	    changeState(selector.props)
	}

	const handles = {}
	
	Object.keys(selector.props).forEach(key => {
	    if(typeof selector.props[key] === 'function') {
		handles[key] = selector.props[key]
	    }
	})


	return Page(Object.assign({}, options, handles, {
	    data: selector.props,
	    onLoad() {
		changeState = changeState.bind(this)
		subscription.trySubscribe()
		selector.run()
		console.log(this)
	    },
	    onUnload() {
		if (subscription) subscription.tryUnsubscribe()
	    }
	}))
    }
}
