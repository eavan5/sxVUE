(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

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


      if (inserted) observeArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

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
        var keys = Reflect.ownKeys(data); // console.log(keys);

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
    if (_typeof(data) !== 'object' || data === null) return;
    return new Observer(data);
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

    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //初始化状态

      initState(vm); //初始化事件...
    };
  }

  function Vue(options) {
    this._init(options); // 初始化操作

  } //Vue初始化方法


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
