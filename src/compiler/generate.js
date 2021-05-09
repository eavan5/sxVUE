// 编写的代码  <div id='app' style="color:red"> hello {{name}} <span>hello</span></div>
// 逾期结果: render(){
//   return _c('div',{id:'app',style:{color:'red'}},_v('hello'+_s(name)),_c('span',null,_v("hello")))
// }

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  //匹配html里面的模板的

// 语法层面的转译
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name === 'style') {
      let obj = {} //对样式进行特殊处理
      attr.value.split(',').forEach(item => {
        let [key, value] = item.split(":")
        obj[key] = value
        attr.value = obj
      })
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`


  }
  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  if (node.type === 1) { //生成元素节点的字符串
    return generate(node)
  } else {
    let text = node.text
    // 如果是普通文本 (不带{{}}的)

    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`  // _v("hello{{name}}") => _v('hello'+_v(name))
    }
    // 如果是<div>hello{{aaa}} world {{bbb}}</div>
    let tokens = []  //存放 每一段代码
    let lastIndex = defaultTagRE.lastIndex = 0 //如果正则是全局模式 需要每次使用前 置为零
    let match, index  //每次匹配到的结果
    while (match = defaultTagRE.exec(text)) {
      index = match.index //保存匹配到的索引
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }

  }
}

function getChildren(el) {
  const children = el.children
  if (children) { // 将所有转换后的儿子用逗号拼接起来
    return children.map(child => gen(child)).join(',')
  }
}

export function generate(el) {
  let children = getChildren(el) //儿子生成
  let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : "undefined"}${children ? `,${children}` : ''})`
  return code
}

