(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

	function Vue() {}

	var a = 1;
	var b = 2;
	console.log(a + b);

	return Vue;

})));
//# sourceMappingURL=vue.js.map
