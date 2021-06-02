import { nextTrick } from "../util";
import { popTarget, pushTarget } from "./dep";

let id = 0
class Watcher {
  //exprOrFn vm._update(vm._render())
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.user = options.user; //这是一个用户操作的watcher
    this.isWatcher = typeof options === 'boolean' //是初始化渲染watcher
    this.options = options;
    this.id = id++ //watcher的唯一标识
    this.deps = [] //记录多个dep依赖
    this.depsId = new Set
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      this.getter = function () { // exprOrFn 传递过来的可能是一个字符串a
        //当去当前实例上取值的时候 才会触发依赖收集
        let path = exprOrFn.split('.') // ['a','a','a']
        let obj = vm
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj
      }
    }
    //默认会先调用一次get 进行取值 将结果保留下来
    this.value = this.get()  //默认调用
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
    // console.warn('获取值');
    // Dep.target = watcher
    pushTarget(this) //当前watcher的实例
    let result = this.getter() //调用exprOrFn  渲染页面 取值(执行了get方法)  调用render方法  with(vm){_v(msg)}
    popTarget()
    return result
  }
  run() {
    let newValue = this.get() //渲染逻辑
    let oldValue = this.value
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue)
    }
  }
  update() {
    //这里不要每次都调用get方法  get方法会重新渲染页面
    queueWatcher(this)
    // this.get() //重新渲染
  }
}
function flushSchedulerQueue() {
  queue.forEach(watcher => {
    watcher.run();
    if (watcher.isWatcher) {
      watcher.cb()
    }
  })
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
