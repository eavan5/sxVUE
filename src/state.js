
import { observe } from './observer/index'
import Watcher from './observer/watcher';
import { nextTrick, proxy } from './util'
export function initState(vm) {
  const options = vm.$options;
  if (options.props) {
    initProps(vm)
  }
  if (options.methods) {
    initMethods(vm)
  }
  if (options.data) {
    initData(vm)
  }
  if (options.computed) {
    initComputed(vm)
  }
  if (options.watch) {
    initWatch(vm)
  }
}

function initProps() {

}

function initMethods() {

}


function initData(vm) {
  let data = vm.$options.data
  // 判断data是否是函数,兼容函数或者对象
  vm._data = data = typeof data === 'function' ? data.call(vm) : data
  //数据的劫持方案  对象Object.defineProperty
  //数组 单独处理的

  //当我从vm上取属性时,帮我吧属性上的取值代理到vm._data上
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      proxy(vm, "_data", key)
    }
  }

  observe(data) // 让这个对象重新定义set 和 get
}

function initComputed() {

}

function initWatch(vm) {
  let watch = vm.$options.watch
  for (const key in watch) {
    const handler = watch[key] //handler可能是我数组 
    if (Array.isArray(handler)) {
      handler.forEach(handler => {
        createWatcher(vm, key, handler)
      })
    } else {
      createWatcher(vm, key, handler) // handler可能是字符串 对象 函数
    }
  }
  // debugger
  // console.log('watch', watch);
}

function createWatcher(vm, exprOrFn, handler, options) {  //options可以用来表示 是用户watcher
  if (typeof handler === 'object') {
    options = handler
    handler = handler.handler // 是一个函数
  }
  if (typeof handler === 'string') {
    handler = vm[handler] // 将实例上的方法座位handler
  }

  // key handler 用户传入的选项
  return vm.$watch(exprOrFn, handler, options)
}


export function stateMixin(Vue) {
  Vue.prototype.$nextTrick = function (cb) {
    nextTrick(cb)
  }
  Vue.prototype.$watch = function (exprOrFn, cb, options) {
    // console.log(exprOrFn, cb, options);
    options.user = true; // 标记为用户watcher
    // 数据应该依赖这个watcher 数据变化后应该让watcher重新执行
    let watcher = new Watcher(this, exprOrFn, cb, { ...options, user: true })
    if (options.immediate) { //如果immediate则立即执行
      cb()
    }
  }
}