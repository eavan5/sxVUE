let id = 0
class Dep {
  constructor() {
    this.subs = []
    this.id = id++
  }
  depend() {
    // 我们希望这个watcher 也可以放dep (比如计算属性)
    Dep.target.addDep(this) //让dep记住watcher的同时让watcher记住dep
    // this.subs.push(Dep.target)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

Dep.target = null
export function pushTarget(watcher) {
  Dep.target = watcher //保留watcher
}
export function popTarget(watcher) {
  Dep.target = null  //将变量删除
}

export default Dep

//多对多的关系  一个属性有一个dep(是用来手机watcher的)
// dep可以存多个watcher  vm.$watcher('name')
// 一个watcher可以对应多个dep