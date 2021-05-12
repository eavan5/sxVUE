(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strategies = {};

  strategies.data = function (parentVal, childVal) {
    return childVal; //这里应该有合并data的策略
  };

  strategies.computed = function () {};

  strategies.watch = function () {};

  function mergeHook(parentValue, childValue) {
    // 声明周期的合并
    if (childValue) {
      if (parentValue) {
        return parentValue.concat(childValue); // 爸爸和儿子进行拼接
      } else {
        return [childValue]; // 儿子需要转换成数组
      }
    } else {
        return parentValue; //如果没儿子不合并了 采用父亲的
      }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strategies[hook] = mergeHook;
  });
  function mergeOptions(parent, child) {
    //遍历父亲,可能是父亲有 儿子没有
    var options = {};

    for (var key in parent) {
      //父亲和儿子都有在这就全部处理了
      mergeField(key);
    } // console.log('======');
    // console.log(options);
    // 儿子有父亲没有


    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        // const element = child[key];
        mergeField(_key);
      }
    } // console.log('======');
    // console.log(options);


    function mergeField(key) {
      //合并字段
      //根据key 不同的策略来合并
      if (strategies[key]) {
        options[key] = strategies[key](parent[key], child[key]);
      } else {
        // 默认合并
        options[key] = child[key];
      }
    }

    console.log('options', options);
    return options;
  }

  function initGlobalApi(Vue) {
    Vue.options = {}; //Vue.component Vue.directive

    Vue.mixin = function (mixin) {
      //先只考虑生命周期
      this.options = mergeOptions(this.options, mixin); //合并options
      // console.log(this.options, '---options----');
    }; // 用户new Vue({created()}{})

  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 编写的代码  <div id='app' style="color:red"> hello {{name}} <span>hello</span></div>
  // 逾期结果: render(){
  //   return _c('div',{id:'app',style:{color:'red'}},_v('hello'+_s(name)),_c('span',null,_v("hello")))
  // }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //匹配html里面的模板的
  // 语法层面的转译

  function genProps(attrs) {
    var str = '';

    var _loop = function _loop(i) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        var obj = {}; //对样式进行特殊处理

        attr.value.split(',').forEach(function (item) {
          var _item$split = item.split(":"),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];

          obj[key] = value;
          attr.value = obj;
        });
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };

    for (var i = 0; i < attrs.length; i++) {
      _loop(i);
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type === 1) {
      //生成元素节点的字符串
      return generate(node);
    } else {
      var text = node.text; // 如果是普通文本 (不带{{}}的)

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")"); // _v("hello{{name}}") => _v('hello'+_v(name))
      } // 如果是<div>hello{{aaa}} world {{bbb}}</div>


      var tokens = []; //存放 每一段代码

      var lastIndex = defaultTagRE.lastIndex = 0; //如果正则是全局模式 需要每次使用前 置为零

      var match, index; //每次匹配到的结果

      while (match = defaultTagRE.exec(text)) {
        index = match.index; //保存匹配到的索引

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function getChildren(el) {
    var children = el.children;

    if (children) {
      // 将所有转换后的儿子用逗号拼接起来
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function generate(el) {
    var children = getChildren(el); //儿子生成

    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : "undefined").concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //匹配标签名字  //ps:里面的\\ 是在字符串定义正则的时候需要转义
  //  ?: 匹配不捕获

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <my:xx>  

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function parseHTML(html) {
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        //标签名
        type: 1,
        // 元素类型
        children: [],
        //子列表
        attrs: attrs,
        //属性
        parent: null //父节点

      };
    }

    var root,
        currentParent,
        stack = []; //标签是否符合预期

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 当前解析的标签 保存起来

      stack.push(element); //将生成的AST元素放到栈里面
      // console.log(tagName, attrs, '---开始标签---');
    }

    function end(tagName) {
      //在结尾标签处,保存父子关系
      var element = stack.pop(); // console.log(tagName, '---结束标签---');

      currentParent = stack[stack.length - 1]; // 因为出栈了 所以当前标签是之前的一个标签

      if (currentParent) {
        // 当闭合的时候可以知道这个标签的父节点是谁
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, ''); //去除空行

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      } // console.log(text, '---文本---');

    }

    while (html) {
      //只要html不为空 则一直解析
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        //是标签
        var startTagMatch = parseStartTag(); //<xxx>开始标签匹配的结果

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag); //</ xxx>结束标签匹配

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); //将结束标签传入

          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        //是文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      } // break

    } //匹配到之后将html更新


    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen); // console.log(start);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //删除开始标签
        //如果直接是闭合标签 说明没有属性

        var _end, attr; //不是结尾标签,并且能匹配到属性


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
          continue;
        } //去除 结尾的>


        if (_end) {
          // debugger
          advance(_end[0].length);
        } // console.log('match', match);


        return match;
      }
    }

    return root;
  }

  function compileToFunctions(template) {
    //html模板 => render函数
    //1.将html代码转换成AST语法树(可以用AST数去描述语言本身) 
    //ps:虚拟dom(虚拟dom是用对象来描述节点的)
    var ast = parseHTML(template); // console.log(ast);
    //2.优化静态节点
    // 3.通过这颗树  重新生成代码

    var code = generate(ast); // console.log(code);
    //4.将字符串转换成render函数  限制取值范围 通过with来进行取值  稍后我们调用render函数就可以通过改变this 让这个函数内部取到成果了

    var render = new Function("with(this){return ".concat(code, "}")); // console.log(render);

    return render;
  }

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        this.subs.push(Dep.target);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  function pushTarget(watcher) {
    Dep.target = watcher; //保留watcher
  }
  function popTarget(watcher) {
    Dep.target = null; //将变量删除
  }
  // dep可以存多个watcher  vm.$watcher('name')
  // 一个watcher可以对应多个dep

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    //exprOrFn vm._update(vm._render())
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.id = id++; //watcher的唯一标识

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      }

      this.get(); //默认调用
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this); //当前watcher的实例

        this.getter(); //调用exprOrFn  渲染页面 取值(执行了get方法)  调用render方法  with(vm){_v(msg)}

        popTarget();
      }
    }, {
      key: "update",
      value: function update() {
        this.get();
      }
    }]);

    return Watcher;
  }();
  // 1.先把这个渲染watcher 放到了Dep.target属性上
  // 2.开始渲染,取值的时候会调用get方法 需要让这个属性的dep存储当前的watcher
  // 3.页面上所需要的属性都会将这个watcher存在自己的dep中
  // 4.等待属性更新了调用set方法 就重新调用渲染逻辑 通知自己存储的watcher来更新

  function patch(oldVnode, vnode) {
    // oldVnode => id#app vnode => 我们根据模板产生的虚拟dom
    //将虚拟节点转换成真实节点
    // console.log(oldVnode, vnode);
    var el = createElm(vnode); //产生真实的dom

    var parentElm = oldVnode.parentNode; //获取老的app的父亲 => body

    parentElm.insertBefore(el, oldVnode.nextSibling); //当前的真实元素插入到app的后面

    parentElm.removeChild(oldVnode); //删除老的节点

    return el;
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children;
        vnode.key;
        vnode.data;
        var text = vnode.text;

    if (typeof tag === 'string') {
      //创建元素 放到vnode.el上
      vnode.el = document.createElement(tag); // 只有元素才有属性

      updateProperties(vnode);
      children.forEach(function (child) {
        //遍历儿子  将儿子渲染后的结果扔到父亲中
        vnode.el.appendChild(createElm(child));
      });
    } else {
      // 创建文本 放到vnode.el上
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    var el = vnode.el;
    var newProps = vnode.data || {};

    for (var key in newProps) {
      if (Object.hasOwnProperty.call(newProps, key)) {
        var element = newProps[key];

        if (key === 'style') {
          // {color:red}
          for (var key2 in newProps.style) {
            if (Object.hasOwnProperty.call(newProps.style, key2)) {
              el.style[key2] = newProps.style[key2];
            }
          }
        } else if (key === 'class') {
          el.className = el["class"];
        } else {
          el.setAttribute(key, element);
        }
      }
    }
  } // vue渲染流程 -> 先初始化数据 -> 将魔棒进行编译 => render函数 -> 生成虚拟节点 -> 生成真实节点 -> 扔到dom上去

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; //用新的创建的元素 替换掉老的vm.$el

      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el; // 调用render方法去渲染el属性

    callHook(vm, 'beforeMount'); //先调用render方法创建虚拟节点 render ,再将虚拟节点渲染到页面上 update

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; //这个watcher是用于渲染的,目前没有别的功能 调用updateComponent


    new Watcher(vm, updateComponent, function () {
      callHook(vm, 'beforeUpdate');
    }, true); //要把属性和watcher绑定在一起

    callHook(vm, 'mounted');
  } // callHook(vm,'beforeCreate')

  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; // vm.$options.create = [a1,a2,a3]

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm); //更改生命周期中的this
      }
    }
  }

  // 切片编程
  var oldArrayProtoMethods = Array.prototype; //继承一下

  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'unshift', 'shift', 'reverse', 'splice', 'sort'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      //这里的this就是observer的data
      console.log('数组方法被调用了');
      var result = oldArrayProtoMethods[method].apply(this, arguments);
      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          //这两个内容都是添加,添加的内容可能是对象类型,应该再次进行劫持
          inserted = args;
          break;

        case 'splice':
          //vue.$set原理
          inserted = args.slice(2);
      } //如果当前的inserted有值 则继续检测


      if (inserted) ob.serveArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      //使用defineProperty重新定义属性
      //判断一个对象是否被观察到,则看这个属性有没有__ob__属性
      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        //不能被枚举,不能被循环出来
        configurable: false,
        // 不能修改赋值
        value: this
      });

      if (Array.isArray(data)) {
        Object.setPrototypeOf(data, arrayMethods); //观测数组中的对象类型,对象变化也需要做一些事

        this.observeArray(data);
      } else {
        //使用defineProperty 重新定义属性
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); // 递归下去

    var dep = new Dep(); //每个属性都有一个dep
    //当页面取值的时候 说明这个值用来渲染了,将这个watcher和这个属性对应起来

    Object.defineProperty(data, key, {
      get: function get() {
        //依赖收集
        console.log('获取值');

        if (Dep.target) {
          //让这个属性记住这个watcher
          dep.depend();
        }

        return value;
      },
      set: function set(newValue) {
        //依赖更新
        console.log('设置值');
        if (newValue === value) return;
        observe(newValue); //如果用户设置的值还是一个对象,继续观测

        value = newValue;
        dep.notify(); //重新渲染
      }
    });
  }

  function observe(data) {
    // Object.defineProperty实际上也是可以对数组进行监控的，但是由于监控数组会去递归数组，会造成性能问题，所以改用数组原型重写的方法
    // 如果不是对象直接return
    if (_typeof(data) !== 'object' || data === null) return data; //如果已经被监听,则return

    if (data.__ob__) return data;
    return new Observer(data); // 只观测存在的属性 
    // 数组中更改索引和长度 无法被监控
    // $set 数组实际上就是 splice
    // $set 对象实际上就是 Object.defineProperty
  }

  function initState(vm) {
    var options = vm.$options;

    if (options.props) ;

    if (options.methods) ;

    if (options.data) {
      initData(vm);
    }

    if (options.computed) ;

    if (options.watch) ;
  }

  function initData(vm) {
    var data = vm.$options.data; // 判断data是否是函数,兼容函数或者对象

    vm._data = data = typeof data === 'function' ? data.call(vm) : data; //数据的劫持方案  对象Object.defineProperty
    //数组 单独处理的
    //当我从vm上取属性时,帮我吧属性上的取值代理到vm._data上

    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        proxy(vm, "_data", key);
      }
    }

    observe(data); // 让这个对象重新定义set 和 get
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 写成 vm.constructor.options 是为了防止子组件的options一起被混合

      vm.$options = mergeOptions(vm.constructor.options, options); //需要将用户自定义的options和全局的options做合并
      //初始化之前调用beforeCreate

      callHook(vm, 'beforeCreate'); //初始化状态

      initState(vm);
      callHook(vm, 'created'); //初始化事件...
      //如果有el属性 则表示需要渲染模板

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      //挂载操作
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        //没有render方法,则将template转换成render方法
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } // 将模板编译成render函数
        //1.处理模板变成ast语法树 2.标记静态节点 3.重新code生成(return的字符串) 4.通过new Function + with 生成render函数 


        var render = compileToFunctions(template);
        options.render = render;
      } //需要挂载这个组件


      mountComponent(vm, el);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      //创建虚拟dom元素
      return createElement.apply(void 0, arguments);
    }; //当结果是对象时,会对这个对象取值


    Vue.prototype._s = function (val) {
      // stringify
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._v = function (text) {
      //创建虚拟dom文本元素
      return createTextVnode(text);
    };

    Vue.prototype._render = function () {
      // _render = render
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, data.key, children);
  }

  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } //用来产生虚拟dom的,用来操作正式dom消耗性能(真实dom有几百个属性)


  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text // componentsInstances:

    };
  }

  function Vue(options) {
    this._init(options); // 初始化操作

  } //原型方法
  //Vue初始化方法


  initMixin(Vue); // init方法
  //混合生命周期

  lifecycleMixin(Vue); // _update
  //渲染

  renderMixin(Vue); // _render
  // 静态方法  Vue.component Vue.directive Vue.extends Vue.mixin

  initGlobalApi(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
