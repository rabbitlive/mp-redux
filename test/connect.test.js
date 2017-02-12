import configureMockStore from 'redux-mock-store'
import Provider from '../src/Provider'
import connect from '../src/connect'
import { identity as id, noop } from 'lodash'
import setGlobal from './setGlobal'

const mockStore = configureMockStore()
const store = mockStore({ foo: 42 })
beforeEach(setGlobal)
afterEach(setGlobal)

function mapStateToProps(state) {
    return {
	foo: state.foo
    }
}

function mapDispatchToProps(dispatch) {
    return {
	foo: noop
    }
}

test('Export PageOptions only when set __WXAPPREDUXEXPORT__', () => {
    global.Page = noop
    App(Provider(store)({
	__WXAPPREDUXEXPORT__: true
    }))
    expect(connect()().data).toEqual({})
})

test('Export this.dispatch as default', () => {
    Provider(store)()
    const target = connect()()
    expect(target.dispatch).toEqual(expect.any(Function))
    expect(target.data).toEqual({})
})

test('Export this.data as mapStateToProps', () => {
    Provider(store)()
    const target = connect(mapStateToProps)()
    expect(target.data).toEqual({ foo: 42 })
})


test('Export this.foo as mapDispatchToProps', () => {
    Provider(store)()
    const target = connect(null, mapDispatchToProps)()
    expect(target.foo).toEqual(expect.any(Function))
    expect(target.dispatch).toBeUndefined()
})

test('Export this.data.style when pass style option', () => {
    Provider(store)()
    const style = { foo: 42 }
    const target = connect()(null, style)
    expect(target.data.style.foo).toBe(42)
})

test('Export this.onLoad when pass lifecycle option', () => {
    Provider(store)()
    const onLoadMock = jest.fn()
    const target = connect()({
	onLoad() {
	    onLoadMock()
	}
    })
    target.onLoad()
    expect(onLoadMock).toHaveBeenCalled()
})
