import { compileToFunctions } from './compiler/index';
import { initState } from './state'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    //初始化状态
    initState(vm)

    //初始化事件...

    //如果有el属性 则表示需要渲染模板
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    //挂载操作
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    if (!options.render) {
      //没有render方法,则将template转换成render方法
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      // 将模板编译成render函数
      const render = compileToFunctions(template)
      options.render = render
    }
    //有render方法

  }
}