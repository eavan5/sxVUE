import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'
function Vue(options) {
  this._init(options) // 初始化操作
}

//Vue初始化方法
initMixin(Vue)

//混合生命周期
lifecycleMixin(Vue)

//渲染
renderMixin(Vue)
export default Vue