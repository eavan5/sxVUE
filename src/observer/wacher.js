import { popTarget, pushTarget } from "./dep";

let id = 0
class Watcher {
  //exprOrFn vm._update(vm._render())
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.id = id++ //watcher的唯一标识

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.get()  //默认调用
  }
  get() {
    pushTarget(this) //当前watcher的实例
    this.getter() //调用exprOrFn  渲染页面 取值(执行了get方法)  调用render方法  with(vm){_v(msg)}
    popTarget()
  }
  update() {
    this.get()
  }
}

export default Watcher

// 在数据劫持的时候 定义defineProperty的时候 已经给每个属性新增了一个Dep实例

// 1.先把这个渲染watcher 放到了Dep.target属性上
// 2.开始渲染,取值的时候会调用get方法 需要让这个属性的dep存储当前的watcher
// 3.页面上所需要的属性都会将这个watcher存在自己的dep中
// 4.等待属性更新了调用set方法 就重新调用渲染逻辑 通知自己存储的watcher来更新
