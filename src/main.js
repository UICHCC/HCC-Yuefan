import Vue from 'vue'
import VueRouter from "vue-router";
import App from './App.vue'
import './plugins/element.js'
import HomePage from "./pages/HomePage";
import axios from 'axios';
import LoginPage from "./pages/LoginPage";
import Swal from "sweetalert2";
import RegisterPage from "./pages/RegisterPage";
import Vuex from 'vuex';

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.prototype.$http = axios;
Vue.prototype.$swal = Swal;

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

const store = new Vuex.Store({
  state: {
    username: '',
    admin: false
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
    setAdmin(state, bool) {
      state.admin = bool
    }
  },
  actions: {
    setUser({ commit }, username) {
      commit('setUsername', username)
    },
    isAdmin({ commit }) {
      commit('setAdmin', true)
    },
    notAdmin({ commit }) {
      commit('setAdmin', false)
    },
    delUser({ commit }) {
      commit('setUsername', '')
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
