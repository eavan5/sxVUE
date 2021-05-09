const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名字  //ps:里面的\\ 是在字符串定义正则的时候需要转义
//  ?: 匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;  // <my:xx>  
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

export function parseHTML(html) {
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName, //标签名
      type: 1, // 元素类型
      children: [], //子列表
      attrs, //属性
      parent: null //父节点
    }

  }
  let root,
    currentParent,
    stack = []

  //标签是否符合预期
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element // 当前解析的标签 保存起来
    stack.push(element) //将生成的AST元素放到栈里面
    // console.log(tagName, attrs, '---开始标签---');
  }
  function end(tagName) { //在结尾标签处,保存父子关系
    let element = stack.pop()
    // console.log(tagName, '---结束标签---');
    currentParent = stack[stack.length - 1] // 因为出栈了 所以当前标签是之前的一个标签
    if (currentParent) { // 当闭合的时候可以知道这个标签的父节点是谁
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, '') //去除空行
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
    // console.log(text, '---文本---');
  }


  while (html) { //只要html不为空 则一直解析
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      //是标签
      const startTagMatch = parseStartTag() //<xxx>开始标签匹配的结果
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag) //</ xxx>结束标签匹配
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1]) //将结束标签传入
        continue
      }
    }
    let text
    if (textEnd > 0) { //是文本
      text = html.substring(0, textEnd)
    }

    if (text) {
      advance(text.length)
      chars(text)
    }
    // break

  }
  //匹配到之后将html更新
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    // console.log(start);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) //删除开始标签
      //如果直接是闭合标签 说明没有属性
      let end, attr
      //不是结尾标签,并且能匹配到属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
        advance(attr[0].length)
        continue;
      }
      //去除 结尾的>
      if (end) {
        // debugger
        advance(end[0].length)
      }
      // console.log('match', match);
      return match
    }
  }
  return root
}