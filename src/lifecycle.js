import Watcher from "./observer/wacher";
import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this

    //用新的创建的元素 替换掉老的vm.$el
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  vm.$el = el
  // 调用render方法去渲染el属性
  callHook(vm, 'beforeMount')
  //先调用render方法创建虚拟节点 render ,再将虚拟节点渲染到页面上 update

  let updateComponent = () => {
    vm._update(vm._render())
  }

  //这个watcher是用于渲染的,目前没有别的功能 调用updateComponent
  let watcher = new Watcher(vm, updateComponent, () => {
    callHook(vm, 'beforeUpdate')
  }, true)

  //要把属性和watcher绑定在一起

  callHook(vm, 'mounted')

}

// callHook(vm,'beforeCreate')
export function callHook(vm, hook) {
  const handlers = vm.$options[hook] // vm.$options.create = [a1,a2,a3]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm) //更改生命周期中的this

    }
  }
}