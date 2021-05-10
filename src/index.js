import { initGlobalApi } from '../global-api/index'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'

// 用vue的构造函数 创建组件
function Vue(options) {
  this._init(options) // 初始化操作
}

//原型方法
//Vue初始化方法
initMixin(Vue)  // init方法
//混合生命周期
lifecycleMixin(Vue) // _update
//渲染
renderMixin(Vue)  // _render


// 静态方法  Vue.component Vue.directive Vue.extends Vue.mixin
initGlobalApi(Vue)
export default Vue