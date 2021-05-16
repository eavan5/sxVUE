export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]
    },
    set(newValue) {
      vm[data][key] = newValue
    }
  })
}

export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

const strategies = {}
strategies.data = function (parentVal, childVal) {
  return childVal //这里应该有合并data的策略
}
strategies.computed = function () {

}
strategies.watch = function () {

}
function mergeHook(parentValue, childValue) {  // 声明周期的合并
  if (childValue) {
    if (parentValue) {
      return parentValue.concat(childValue); // 爸爸和儿子进行拼接
    } else {
      return [childValue] // 儿子需要转换成数组
    }
  } else {
    return parentValue //如果没儿子不合并了 采用父亲的
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strategies[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  //遍历父亲,可能是父亲有 儿子没有
  const options = {}
  for (const key in parent) {  //父亲和儿子都有在这就全部处理了
    mergeField(key)
  }
  // console.log('======');
  // console.log(options);
  // 儿子有父亲没有
  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      // const element = child[key];
      mergeField(key)


    }
  }
  // console.log('======');
  // console.log(options);

  function mergeField(key) { //合并字段
    //根据key 不同的策略来合并
    if (strategies[key]) {
      options[key] = strategies[key](parent[key], child[key])
    } else {
      // 默认合并
      options[key] = child[key]
    }
  }
  console.log('options', options);
  return options
}
let callbacks = []
function flushCallbacks() {
  while (callbacks.length) { // 让nextTrick中传入的方法依次执行
    let cb = callbacks.pop()
    cb()
  }
  pending = false
  callbacks = []
}
let timerFunc;
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks) // 异步处理更新
  }
} else if (MutationObserver) { // 可以监控dom的变化,监控完毕之后是异步更新,是一个微任务
  let observe = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1) // 先创建一个文本节点
  observe.observe(textNode, { characterData: true }) //观测节点的内容
  timerFunc = () => {
    text.textContent = 2  // 文本中的内容改成2
  }
} else if (serImmediate) { // IE中的一个API

}
let pending = false
export function nextTrick(cb) {  // 因为内部会调用nextTrick 用户也会调用 但是异步只需要一次
  callbacks.push(cb)
  if (!pending) {
    // vue3里面的nextTrick原理就是promise.then 没有做兼容性处理
    timerFunc() //这个方法就是异步方法  做了兼容处理了
    // Promise.resolve().then()
    pending = true
  }
}