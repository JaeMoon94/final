import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed);

Vue.config.productionTip = false

let data = {
  user: null,
  profile: null
}

new Vue({
  data,
  router,
  computed: {
    login() {
      if (this.user == null) {
        return true
      }
      else {
        return false
      }
    }
  },
  methods: {
  },
  render: h => h(App)
}).$mount('#app')
