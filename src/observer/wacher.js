import { nextTrick } from "../util";
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
    this.deps = [] //记录多个dep依赖
    this.depsId = new Set
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.get()  //默认调用
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
    //dep去重
  }
  get() {
    // Dep.target = watcher
    pushTarget(this) //当前watcher的实例
    this.getter() //调用exprOrFn  渲染页面 取值(执行了get方法)  调用render方法  with(vm){_v(msg)}
    popTarget()
  }
  run() {
    console.log(111);
    this.get() //渲染逻辑
  }
  update() {
    //这里不要每次都调用get方法  get方法会重新渲染页面
    queueWatcher(this)
    // this.get() //重新渲染
  }
}
function flushSchedulerQueue() {
  queue.forEach(watcher => { watcher.run(); watcher.cb() })
  queue = []  // 清空watcher队列为了下次使用
  has = {} //清空标识的id
  pending = false // 还原pending
}

let queue = [] //将需要批量更新的watcher 春发到一个队列中 收好让watcher执行
let has = {}
let pending = false
function queueWatcher(watcher) {
  let id = watcher.id  // 对watcher进行去重
  if (has[id] == null) {
    queue.push(watcher) // 并且将watcher存到队列中
    has[id] = true
  }
  if (!pending) { //如果没有清空 就不要开定时器呢
    //等待所有同步代码执行完毕后再执行
    nextTrick(flushSchedulerQueue)
    pending = true
  }

}

export default Watcher

// 在数据劫持的时候 定义defineProperty的时候 已经给每个属性新增了一个Dep实例

// 1.先把这个渲染watcher 放到了Dep.target属性上
// 2.开始渲染,取值的时候会调用get方法 需要让这个属性的dep存储当前的watcher
// 3.页面上所需要的属性都会将这个watcher存在自己的dep中
// 4.等待属性更新了调用set方法 就重新调用渲染逻辑 通知自己存储的watcher来更新
