import { arrayMethods } from './array'
class Observer {
  constructor(data) {
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
  observe(value) // 递归下去
  Object.defineProperty(data, key, {
    get() {
      console.log('获取值');
      return value
    },
    set(newValue) {
      console.log('设置值');
      if (newValue === value) return
      observe(newValue)  //如果用户设置的值还是一个对象,继续观测
      value = newValue
    }
  })

}

export function observe(data) {
  // Object.defineProperty实际上也是可以对数组进行监控的，但是由于监控数组会去递归数组，会造成性能问题，所以改用数组原型重写的方法


  // 如果不是对象直接return
  if (typeof data !== 'object' || data === null) return
  //如果已经被监听,则return
  if (data.__ob__) return
  return new Observer(data)
}