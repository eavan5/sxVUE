export function renderMixin(Vue) {
  Vue.prototype._c = function () { //创建虚拟dom元素
    return createElement(...arguments)
  }

  //当结果是对象时,会对这个对象取值
  Vue.prototype._s = function (val) { // stringify
    return val == null ? '' : (typeof val === 'object') ? JSON.stringify(val) : val
  }
  Vue.prototype._v = function (text) { //创建虚拟dom文本元素
    return createTextVnode(text)
  }
  Vue.prototype._render = function () { // _render = render
    const vm = this;
    const render = vm.$options.render
    let vnode = render.call(vm)
    return vnode
  }
}

function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children)
}
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

//用来产生虚拟dom的,用来操作正式dom消耗性能(真实dom有几百个属性)
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text,
    // componentsInstances:
  }
}