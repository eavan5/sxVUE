import { generate } from './generate';
import { parseHTML } from './parse'


export function compileToFunctions(template) {
  //html模板 => render函数
  //1.将html代码转换成AST语法树(可以用AST数去描述语言本身) 
  //ps:虚拟dom(虚拟dom是用对象来描述节点的)
  let ast = parseHTML(template)
  console.log(ast);
  //2.优化静态节点

  // 3.通过这颗树  重新生成代码
  let code = generate(ast)
  console.log(code);
  //4.将字符串转换成render函数  限制取值范围 通过with来进行取值  稍后我们调用render函数就可以通过改变this 让这个函数内部取到成果了
  let render = new Function(`with(this){return ${code}}`)
  console.log(render);
  return render
}

