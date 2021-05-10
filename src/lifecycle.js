import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  // 调用render方法去渲染el属性

  //先调用render方法创建虚拟节点 render ,再将虚拟节点渲染到页面上 update
  vm._update(vm._render())
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