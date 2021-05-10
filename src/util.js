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