import Provider from './Provider'
import connectAdvanced from './connectAdvanced'
import connect from 'redux/src/connect'

export {
    Provider,
    connect: createConnect(connectAdvanced)
}
