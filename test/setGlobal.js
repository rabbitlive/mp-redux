import { identity as id } from 'lodash'


export default function setGlobal() {
    let __WxappRedux__ = {}

    global.wx = {}
    
    global.App = function(options) {
	__WxappRedux__ = options
    }

    global.getApp = () => __WxappRedux__

    global.Page = id
}
