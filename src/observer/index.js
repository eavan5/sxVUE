import { arrayMethods } from './array'
import Dep from './dep'
class Observer {
  constructor(data) {
    this.dep = new Dep() // value = {}  value = []
    //使用defineProperty重新定义属性
    //判断一个对象是否被观察到,则看这个属性有没有__ob__属性
    Object.defineProperty(data, '__ob__', {
      enumerable: false, //不能被枚举,不能被循环出来
      configurable: false, // 不能修改赋值
      value: this
    })
    if (Array.isArray(data)) {
      Object.setPrototypeOf(data, arrayMethods)
      //观测数组中的对象类型,对象变化也需要做一些事
      this.observeArray(data)
    } else {
      //使用defineProperty 重新定义属性
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach(item => {
      observe(item)
    })
  }
  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  //获取到数组对应的dep
  let childDep = observe(value) // 递归下去

  let dep = new Dep()  //每个属性都有一个dep

  //当页面取值的时候 说明这个值用来渲染了,将这个watcher和这个属性对应起来
  Object.defineProperty(data, key, {
    get() { //依赖收集
      console.log('获取值');
      if (Dep.target) {  //让这个属性记住这个watcher
        dep.depend()
        if (childDep) { // 可能是数组也可能是对象
          // 默认给数组增加了一个dep属性,当对这个数组对象取值的时候
          console.log(childDep);
          childDep.dep.depend() //将数组的对应的依赖watcher存起来了
        }
      }
      return value
    },
    set(newValue) {  //依赖更新
      console.log('设置值');
      if (newValue === value) return
      observe(newValue)  //如果用户设置的值还是一个对象,继续观测
      value = newValue

      dep.notify() //重新渲染
    }
  })

}

export function observe(data) {
  // Object.defineProperty实际上也是可以对数组进行监控的，但是由于监控数组会去递归数组，会造成性能问题，所以改用数组原型重写的方法


  // 如果不是对象或函数直接return
  if (typeof data !== 'object' || data === null) return
  //如果已经被监听,则return
  if (data.__ob__) return data
  return new Observer(data)

  // 只观测存在的属性 
  // 数组中更改索引和长度 无法被监控
  // $set 数组实际上就是 splice
  // $set 对象实际上就是 Object.defineProperty


}