// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// Components
import './components'


// Plugins
import './plugins'

import './stylus/main.styl'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'

import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
Vue.use(VueMoment, {
  moment,
})

import { VueSpinners } from '@saeris/vue-spinners'

Vue.use(VueSpinners)

import Echo from 'laravel-echo'

window.Pusher = require('pusher-js')

// window.Echo = new Echo({
//   authEndpoint: 'http://ws.apibetic.com/broadcasting/auth',
//   broadcaster: 'pusher',
//   key: 'panel_key',
//   wsHost: 'ws.apibetic.com',
//   wsPort: 2052,
//   wssPort: 2052,
//   encrypted: false,
//   disableStats: false
// })

window.Echo = new Echo({
  authEndpoint : 'https://ws.apibetic.com/broadcasting/auth',
  broadcaster: 'pusher',
  key: 'panel_key',
  wsHost: 'ws.apibetic.com',
  wsPort: 443,
  wssPort: 443,
  encrypted:false,
  disableStats: true,
  enabledTransports: ['ws', 'wss']
});

// Sync store with router
sync(store, router)

Vue.config.productionTip = false

// console.log(process.env.VUE_APP_MY_ENV_VARIABLE)
router.beforeEach((to, from, next) => {
  if(store.getters.getLanguage != undefined && store.getters.getLanguage.length > 0){
    i18n.locale = store.getters.getLanguage
  }
  var system_info = JSON.parse(localStorage.system_conf);
  if(system_info.hasLoginPage == true){
    if(localStorage.betic_storage == undefined || localStorage.betic_storage == "" || localStorage.betic_storage == null){
      if(to.path != '/login'){
        next({
          path: '/login',
        })
      }
      else{
        next()
      }
    }
    else if(localStorage.betic_storage != null && localStorage.betic_storage != "" && (to.path == "/login" || to.path == '/')){
      next({
        path: '/sports-betting'
      })
    }
    else{
      next() // make sure to always call next()!
    }
  }
  else{
    if(to.path == '/' || to.path == '/login')
      next({
        path: '/sports-betting'
      })
    else{
      next()
    }
  }
  
})

import axios from 'axios'
axios
    .post("zt_system_detail", {
        headers: {
            Authorization: "Bearer " + localStorage.betic_storage
        }
    })
    .then(response => {
        var data = response.data;
        if (data.success) {
            var system_conf = {
                balanceCurrency : data.success.data.balanceCurrency,
                closingMinuteBetting : data.success.data.closingMinuteBetting,
                combineBalances : data.success.data.combineBalances,
                domian : data.success.data.domian,
                hasLoginPage : data.success.data.hasLoginPage,
                // hasLoginPage: false,
                languages : data.success.data.languages,
                logo : '/img/' + data.success.data.logo,
                oddFormat : data.success.data.oddFormat,
                oddFormatPretty : data.success.data.oddFormatPretty,
                offlineMessage : data.success.data.offlineMessage,
                systemID : data.success.data.systemID,
                theme : 'theme-' + data.success.data.theme,
                // theme: 'theme-blue',
                title: data.success.data.title,
                type : data.success.data.type,
                typePretty : data.success.data.typePretty,
                useOwnCode1 : data.success.data.useOwnCode1,
                useOwnCode2 : data.success.data.useOwnCode2,
            };

            localStorage.system_conf = JSON.stringify(system_conf);

            // var system_info = JSON.parse(localStorage.system_conf);

            // document.getElementsByTagName('body')[0].classList.remove('init_background');
            // document.getElementsByTagName('body')[0].classList.remove('theme-blue');
            // document.getElementsByTagName('body')[0].classList.remove('theme-green');
            // document.getElementsByTagName('body')[0].classList.remove('theme-yellow');

            // document.getElementsByTagName('body')[0].classList.toggle(system_info.theme);

            /* eslint-disable no-new */
            new Vue({
                i18n,
                router,
                store,
                render: h => h(App)
            }).$mount('#app');
        }
    })
    .catch(e => {
        alert('Server is unavailable now.');
        window.location.href = window.location.href;
    });