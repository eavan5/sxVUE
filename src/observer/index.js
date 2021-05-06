class Observer {
  constructor(data) {
    //使用defineProperty 重新定义属性
    this.walk(data)
  }
  walk(data) {
    let keys = Reflect.ownKeys(data)
    console.log(keys);
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
  // 如果不是对象直接return
  if (typeof data !== 'object' || data === null) return
  return new Observer(data)
}