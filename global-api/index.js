import { mergeOptions } from "../src/util";

export function initGlobalApi(Vue) {
  Vue.options = {}  //Vue.component Vue.directive
  Vue.mixin = function (mixin) {

    //先只考虑生命周期
    this.options = mergeOptions(this.options, mixin) //合并options
    // console.log(this.options, '---options----');
  }
  // 用户new Vue({created()}{})
}