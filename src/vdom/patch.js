export function patch(oldVnode, vnode) {
  // oldVnode => id#app vnode => 我们根据模板产生的虚拟dom

  //将虚拟节点转换成真实节点
  console.log(oldVnode, vnode);
  let el = createElm(vnode) //产生真实的dom
  let parentElm = oldVnode.parentNode //获取老的app的父亲 => body
  parentElm.insertBefore(el, oldVnode.nextSibling)  //当前的真实元素插入到app的后面
  parentElm.removeChild((oldVnode)) //删除老的节点
}

function createElm(vnode) {
  let { tag, children, key, data, text } = vnode
  if (typeof tag === 'string') { //创建元素 放到vnode.el上
    vnode.el = document.createElement(tag)

    // 只有元素才有属性
    updateProperties(vnode)


    children.forEach(child => {  //遍历儿子  将儿子渲染后的结果扔到父亲中
      vnode.el.appendChild(createElm(child))
    })
  } else { // 创建文本 放到vnode.el上
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode) {
  let el = vnode.el
  let newProps = vnode.data || {}
  for (const key in newProps) {
    if (Object.hasOwnProperty.call(newProps, key)) {
      const element = newProps[key];
      if (key === 'style') {  // {color:red}
        for (const key2 in newProps.style) {
          if (Object.hasOwnProperty.call(newProps.style, key2)) {
            el.style[key2] = newProps.style[key2]
          }
        }
      } else if (key === 'class') {
        el.className = el.class
      } else {
        el.setAttribute(key, element)
      }

    }
  }
}


// vue渲染流程 -> 先初始化数据 -> 将魔棒进行编译 => render函数 -> 生成虚拟节点 -> 生成真实节点 -> 扔到dom上去


