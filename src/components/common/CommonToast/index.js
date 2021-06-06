import CommonToastVue from './index.vue';

// 定义插件对象
const CommonToast = { install: null };

// vue的install方法，用于定义vue插件
// eslint-disable-next-line no-unused-vars
CommonToast.install = function (Vue, options) {
  const instance = Vue.extend(CommonToastVue);
  let currentToast;
  const initInstance = () => {
    // 实例化vue实例
    currentToast = new instance();
    let $el = currentToast.$mount().$el;
    document.body.appendChild($el);
  };
  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$toast = {
    show(options) {
      if (!currentToast) {
        initInstance();
      }
      currentToast.show(options);
      return currentToast; // 为了链式调用
    },
  };
};

export default CommonToast;
