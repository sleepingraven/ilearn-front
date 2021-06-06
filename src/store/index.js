import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sign: {
      loggedIn: false,
      verificationCountdown: 0,
    },
  },
  getters: {
    isVerificationReady: (state) => {
      return !state.sign.verificationCountdown;
    },
  },
  mutations: {
    //保存登录状态
    userStatus(state, flag) {
      state.sign.loggedIn = flag;
    },
    performVerify(state) {
      state.sign.verificationCountdown = 60;
      let countdown;

      countdown = window.setInterval(() => {
        if (state.sign.verificationCountdown <= 0) {
          clearInterval(countdown);
          state.sign.verificationCountdown = 0;
          return;
        }
        state.sign.verificationCountdown--;
      }, 1000);
    },
  },
  actions: {
    //获取登录状态
    userLogin({ commit }, flag) {
      commit('userStatus', flag);
    },
  },
  modules: {},
});
