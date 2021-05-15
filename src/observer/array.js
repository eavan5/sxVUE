// 切片编程


let oldArrayProtoMethods = Array.prototype;

//继承一下
export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'reverse',
  'splice',
  'sort'
]
methods.forEach(method => {
  arrayMethods[method] = function (...args) {  //这里的this就是observer的data
    // 当调用数组我们劫持后的这七个方法 页面应该更新
    // 需要知道数组对应哪个dep
    console.log('数组方法被调用了');
    const result = oldArrayProtoMethods[method].apply(this, arguments)
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift': //这两个内容都是添加,添加的内容可能是对象类型,应该再次进行劫持
        inserted = args
        break;
      case 'splice': //vue.$set原理
        inserted = args.slice(2) // 第3个就是新增的数据
      default:
        break;
    }
    //如果当前的inserted有值 则继续检测
    if (inserted) ob.serveArray(inserted)

    ob.dep.notify() //通知数组去更新
    return result
  }
})



