import { initMixin } from './init'
function Vue(options) {
  this._init(options) // 初始化操作
}

//Vue初始化方法
initMixin(Vue)
export default Vue