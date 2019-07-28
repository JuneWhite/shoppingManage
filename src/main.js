import Vue from 'vue'
import store from '@/store'
import axios from '@/http'
import Axios from 'vue-axios'
import router from '@/router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import msg from '@/function/msg'
import echarts from 'echarts'
Vue.use(Axios,axios)
Vue.use(ElementUI);

import {addRoute} from '@/function/tool'

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

addRoute()
new Vue({
  el: '#app',
  router,
  store,
  msg,
  watch: {
    $route: function (to) {
       //动态增加tab
      if (to.meta.display == 1) {
        var tabData = {
          key:to.meta.id,
          label:to.meta.title,
          name:to.path
        };
        this.$store.commit('addTab', tabData);
        this.$store.commit('switchTab', to.path);
      }
    }
  }
})
