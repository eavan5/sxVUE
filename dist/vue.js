(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

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

      console.log(tagName, attrs, '---开始标签---');
    }

    function end(tagName) {
      //在结尾标签处,保存父子关系
      var element = stack.pop();
      console.log(tagName, '---结束标签---');
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
      }

      console.log(text, '---文本---');
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
            value: attr[3] | attr[4] | attr[5]
          });
          advance(attr[0].length);
          continue;
        } //去除 结尾的>


        if (_end) {
          // debugger
          advance(_end[0].length);
        }

        return match;
      }
    }

    return root;
  }

  function compileToFunctions(template) {
    //html模板 => render函数
    //1.将html代码转换成AST语法树(可以用AST数去描述语言本身) 
    //ps:虚拟dom(虚拟dom是用对象来描述节点的)
    var ast = parseHTML(template);
    console.log(ast); //2.通过这棵树 重新生成代码
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

    Object.defineProperty(data, key, {
      get: function get() {
        console.log('获取值');
        return value;
      },
      set: function set(newValue) {
        console.log('设置值');
        if (newValue === value) return;
        observe(newValue); //如果用户设置的值还是一个对象,继续观测

        value = newValue;
      }
    });
  }

  function observe(data) {
    // Object.defineProperty实际上也是可以对数组进行监控的，但是由于监控数组会去递归数组，会造成性能问题，所以改用数组原型重写的方法
    // 如果不是对象直接return
    if (_typeof(data) !== 'object' || data === null) return; //如果已经被监听,则return

    if (data.__ob__) return;
    return new Observer(data);
  }

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

    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //初始化状态

      initState(vm); //初始化事件...
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


        var render = compileToFunctions(template);
        options.render = render;
      } //有render方法

    };
  }

  function Vue(options) {
    this._init(options); // 初始化操作

  } //Vue初始化方法


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
