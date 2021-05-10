import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'

// 用vue的构造函数 创建组件
function Vue(options) {
  this._init(options) // 初始化操作
}

//Vue初始化方法
initMixin(Vue)  // init方法

//混合生命周期
lifecycleMixin(Vue) // _update

//渲染
renderMixin(Vue)  // _render
export default Vue