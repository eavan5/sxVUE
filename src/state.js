
import { observe } from './observer/index'
import { proxy } from './util'
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

  observe(data)
}

function initComputed() {

}

function initWatch() {

}