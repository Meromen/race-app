import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App.vue'
import VueRouter from 'vue-router';
import { routes } from './routes'
import Firebase from 'firebase'
import VeeValidate from 'vee-validate'

let config = {
  apiKey: "AIzaSyAMITlGeXC5UEMIpreLlpBCuz1ciCr_lDk",
  authDomain: "race-app-ce32b.firebaseapp.com",
  databaseURL: "https://race-app-ce32b.firebaseio.com",
  projectId: "race-app-ce32b",
  storageBucket: "race-app-ce32b.appspot.com",
  messagingSenderId: "428673356633"
};

export const fbService = Firebase.initializeApp(config);

export const eventBus = new Vue();

Vue.use(VueRouter);
Vue.use(VeeValidate);

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})
