import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// custom
import appUtil from '@/assets/js/common.js';
import appCommon from '@/assets/js/app-common.js';
import '@/assets/css/global.css';
import '@/assets/css/floating-labels.css';
import CommonToast from '@/components/common/CommonToast';
Vue.use(CommonToast);

import VueAxios from 'vue-axios';
import axios from '@/axios';
Vue.use(VueAxios, axios);
router.beforeEach((to, from, next) => {
  //获取用户登录成功后储存的登录标志
  let getFlag = localStorage.getItem('ILearn.LoginFlag');
  if (getFlag === 'isLogin') {
    //如果登录标志存在且为isLogin，即用户已登录
    //设置vuex登录状态为已登录
    store.state.sign.loggedIn = true;
    next();
    //如果已登录，还想想进入登录注册界面，则定向回首页
    if (to.name === 'Sign') {
      Vue.prototype.$toast.show({
        title: '当前已登录',
        msg: '请先退出登录',
      });
      next({ path: from.path });
    }
  } else {
    //如果登录标志不存在，即未登录
    if (!to.meta.requireLogin) {
      //用户进入无需登录的界面，则跳转继续
      next();
    } else {
      //用户想进入需要登录的页面，则定向回登录界面
      next({
        path: '/sign',
      });
    }
  }
});
// router.afterEach((route) => {
//   window.scroll(0, 0);
// });

import '@/plugins';

Vue.prototype.$appUtil = appUtil;
Vue.prototype.$appCommon = appCommon;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
