// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import Qs from 'qs'
import md5 from 'js-md5'
import 'lib-flexible/flexible'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  NavBar,
  Toast,
  Lazyload,
  Notify
} from 'vant'

Vue.use(Toast).use(Lazyload).use(NavBar).use(Notify)
Vue.use(Lazyload, {
  error: require('../static/images/error.png'),
  loading: require('../static/images/loading.gif'),
  listenEvents: ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'],
  preload: 1,
})

Vue.config.productionTip = false

const img = 'http://192.168.1.206:8010/img/'
Vue.prototype.axios = axios
Vue.prototype.$md5 = md5
Vue.prototype.$qs = Qs
Vue.prototype.$img = img

axios.defaults.baseURL = 'http://192.168.1.206:8090/nft'

axios.interceptors.request.use((config) => {
  Toast.loading({
    mask: true,
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0,
    message: '加载中...'
  });
  return config;
}, (err) => {
  return Promise.reject(err)
})
axios.interceptors.response.use((response) => {
  Toast.clear()
  return response;
}, (err) => {
  return Promise.reject(err);
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
})
