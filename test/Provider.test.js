import configureMockStore from 'redux-mock-store'
import Provider from '../src/Provider'
import { identity as id, noop } from 'lodash'
import setGlobal from './setGlobal'

const mockStore = configureMockStore()
const store = mockStore({ foo: 42 })
beforeEach(setGlobal)
afterEach(setGlobal)

test('Check store fail should throw Error.', () => {
    function runProvider() {
	Provider()()
    }
    expect(runProvider).toThrow('Please provide a redux store via `createStore`')
})

test('Can\'t provide appOptions, default to export store.', () => {
    global.App = id
    const provider = Provider(store)()
    expect(provider.store).toBe(store)
})

test('Default __WXAPPREDUXEXPORT__, pass options to global.App', () => {
    global.App = noop
    const provider = Provider(store)()
    expect(provider).toBeUndefined()
})

test('Set __WXAPPREDUXEXPORT__ to `true`, no need global.App', () => {
    const AppOptions = {
	__WXAPPREDUXEXPORT__: true
    }
    const target = {
	store: store,
	__WXAPPREDUXEXPORT__: true
    }
    const provider = Provider(store)(AppOptions)
    expect(provider).toEqual(target)
})
