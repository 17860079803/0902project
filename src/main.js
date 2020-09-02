// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
//1.引入assets静态资源中的reset.css
import "./assets/css/reset.css"

//2.引入vuex仓库,将vuex仓库挂载到vue根实例上
import store from "./store/index"

//3.处理公共组件
import Components from "./components"
for (let i in Components) {
  Vue.component(i, Components[i])
}
//5.处理数据请求


// 4.处理过滤器
import Filters from "./filters"
for (let i in Filters) {
  Vue.filter(i, Filters[i])
}
// 6.处理element-ui 
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$preImg="http://localhost:3000"
Vue.use(ElementUI)
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
