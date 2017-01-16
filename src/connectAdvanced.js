function connectAdvance(
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
    
    
    return function wrapWithConnect(WrappedComponent) {

	// A... wtf with the display name, maybe the file path?
	const wrappedComponentName = WrappedComponent.displayName
	      || WrappedComponent.name
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
	    WrappedComponent
	}


	// no Component
	//class Connect extends Component {
	class Connect {
	    constructor(props, context) {
		// no super
		//super(props, context)
		
		this.version = version
		this.state = {}
		this.renderCount = 0
		this.store = this.props[storeKey] //|| this.context[storeKey]
		this.parentSub = props[subscriptionKey] //|| context[subscriptionKey]

		this.setWrappedInstance = this.setWrappedInstance.bind(this)

		invariant(this.store,
			  `Could not find "${storeKey}" in either the context or ` +
			  `props of "${displayName}". ` +
			  `Either wrap the root component in a <Provider>, ` +
			  `or explicitly pass "${storeKey}" as a prop to "${displayName}".`
			 )

		// make sure `getState` is properly bound in order to avoid breaking
		// custom store implementations that rely on the store's context
		this.getState = this.store.getState.bind(this.store);

		this.initSelector()
		this.initSubscription()
	    }

	    // no context
	    // getChildContext() {
	    // 	return { [subscriptionKey]: this.subscription || this.parentSub }
	    // }

	    onLoad() {
		this.subscription.trySubscribe()
		this.selector.run(this.props)
	    }

	    onUnload() {
		if (this.subscription) this.subscription.tryUnsubscribe()
		this.subscription = null
		this.store = null
		this.parentSub = null
		this.selector.run = () => {}
	    }

	    getWrappedInstance() {
		invariant(withRef,
			  `To access the wrapped instance, you need to specify ` +
			  `{ withRef: true } in the options argument of the ${methodName}() call.`
			 )
		return this.wrappedInstance
	    }

	    setWrappedInstance(ref) {
		this.wrappedInstance = ref
	    }

	    getData() {
		return this.data
	    }

	    initSelector() {
		const { dispatch } = this.store
		const { getData } = this;
		const sourceSelector = selectorFactory(dispatch, selectorFactoryOptions)

		// wrap the selector in an object that tracks its results between runs
		const selector = this.selector = {
		    //shouldComponentUpdate: true,
		    props: sourceSelector(getData(), this.props),
		    run: function runComponentSelector(props) {
			try {
			    const nextProps = sourceSelector(gerData(), props)
			    if (selector.error || nextProps !== selector.props) {
				//selector.shouldComponentUpdate = true
				selector.props = nextProps
				selector.error = null
			    }
			} catch (error) {
			    //selector.shouldComponentUpdate = true
			    selector.error = error
			}
		    }
		}
	    }

	    initSubscription() {
		if (shouldHandleStateChanges) {
		    const subscription = this.subscription = new Subscription(this.store, this.parentSub)
		    const dummyState = {}

		    subscription.onStateChange = function onStateChange() {
			this.selector.run(this.props)
			
			// if (!this.selector.shouldComponentUpdate) {
			//     subscription.notifyNestedSubs()
			// } else {
			//     this.componentDidUpdate = function componentDidUpdate() {
			// 	//this.componentDidUpdate = undefined
			// 	subscription.notifyNestedSubs()
			//     }

			//     this.setState(dummyState)
			// }

			this.setData(dummyState)
		    }.bind(this)
		}
	    }

	    
	    isSubscribed() {
		return Boolean(this.subscription) && this.subscription.isSubscribed()
	    }
	    

	    addExtraProps(props) {
		if (!withRef && !renderCountProp) return props
		// make a shallow copy so that fields added don't leak to the original selector.
		// this is especially important for 'ref' since that's a reference back to the component
		// instance. a singleton memoized selector would then be holding a reference to the
		// instance, preventing the instance from being garbage collected, and that would be bad
		const withExtras = { ...props }
		if (withRef) withExtras.ref = this.setWrappedInstance
		if (renderCountProp) withExtras[renderCountProp] = this.renderCount++
		return withExtras
	    }
	    
	}


	
	return new Connect()
    }
}
