import axios from 'axios';
import Vue from 'vue';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';
axios.defaults.headers.delete['Content-Type'] = 'application/json';

const service = axios.create({
  baseURL: '/api',
  timeout: 5_000,
  withCredentials: false,
});

// 请求拦截
service.interceptors.request.use(
  // 请求之前做些什么
  (config) => {
    // 符合判断条件，做出响应处理，例如携带token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = localStorage.getItem('ILearn.token');
    token && (config.headers['Authorization'] = token);
    // 最后返回 config 代表继续发送请求
    return config;
    // 如果想取消请求
    // return Promise.reject();
  },
  // 处理错误
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截
service.interceptors.response.use(
  // 对于成功响应的处理
  (res) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (res.status === 200) {
      if (res.data.status === 'success') {
        if (res.headers['token']) {
          localStorage.setItem('ILearn.token', res.headers['token']);
        }
        return Promise.resolve(res);
      } else {
        if (res.data.data && res.data.data.errorCode) {
          switch (res.data.data.errorCode) {
            case 20003:
              localStorage.removeItem('ILearn.LoginFlag');
              window.location.reload('/sign');
              break;
            default:
          }
        }
        return Promise.resolve(res);
      }
    }
  },
  // 处理错误响应
  (error) => {
    switch (error.response.status) {
      case 401:
        Vue.prototype.$toast.show({
          title: '登录已失效',
          msg: '请重新登录',
          icon: 'danger',
        });
        localStorage.removeItem('ILearn.token');
        localStorage.removeItem('ILearn.LoginFlag');
        window.location.reload();
        return Promise.reject(error);
      case 403:
        alert('没有访问权限');
        Vue.prototype.$toast.show({
          title: '出错了',
          msg: '没有权限',
          icon: 'danger',
        });
        return Promise.reject(error);
      default:
        return Promise.resolve(error);
    }
  }
);

export default service;
