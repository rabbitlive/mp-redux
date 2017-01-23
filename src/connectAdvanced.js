import invariant from 'invariant'
import Subscription from 'react-redux/src/utils/Subscription'

export default function connectAdvance(
    selectorFactory,
    // options object:
    {
	// the func used to compute this HOC's displayName from the wrapped component's displayName.
	// probably overridden by wrapper functions such as connect()
	getDisplayName = name => `ConnectAdvanced(${name})`,

	// shown in error messages
	// probably overridden by wrapper functions such as connect()
	methodName = 'connectAdvanced',

	// if defined, the name of the property passed to the wrapped element indicating the number of
	// calls to render. useful for watching in react devtools for unnecessary re-renders.
	renderCountProp = undefined,

	// determines whether this HOC subscribes to store changes
	shouldHandleStateChanges = true,

	// the key of props/context to get the store
	storeKey = 'store',

	// if true, the wrapped element is exposed by this HOC via the getWrappedInstance() function.
	withRef = false,

	// additional options are passed through to the selectorFactory
	    ...connectOptions
    } = {}
) {
    const subscriptionKey = storeKey + 'Subscription'
    
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
	
	
	function setData(props) {
	    this.setData(props)
	}

	subscription.onStateChange = function onStateChange() {
	    selector.run()
	    setData(selector.props)
	}

	const handles = {}
	
	Object.keys(selector.props).forEach(key => {
	    if(typeof selector.props[key] === 'function') {
		handles[key] = selector.props[key]
	    }
	})


	const { data, onLoad, onUnload } = options

	let mergeData = data ? Object.assign({}, data, selector.props) : selector.props

	return Page(Object.assign({}, options, handles, {
	    data: mergeData,
	    onLoad() {
		setData = setData.bind(this)
		subscription.trySubscribe()
		selector.run()

		if(onLoad && typeof onLoad === 'function') {
		    onLoad.call(this)
		}
	    },
	    onUnload() {
		if (subscription) subscription.tryUnsubscribe()
		if(onUnload && typeof onUnload === 'function') {
		    onUnload.call(this)
		}
	    }
	}))
    }
}
