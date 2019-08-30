import Vue from 'vue'

// Lib imports
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)


var domain = (function(){
  var i=0,domain=document.domain,p=domain.split('.'),s='_gd'+(new Date()).getTime();
  while(i<(p.length-1) && document.cookie.indexOf(s+'='+s)==-1){
    domain = p.slice(-1-(++i)).join('.');
    document.cookie = s+"="+s+";domain="+domain+";";
  }
  document.cookie = s+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+domain+";";
  return domain;
})();


window.APP_ENDPOINT = 'https://fp.'+domain
// window.APP_ENDPOINT = 'http://localhost:2053'

axios.defaults.baseURL = `${window.APP_ENDPOINT}/`
// axios.defaults.headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'}
// axios.defaults.withCredentials = false
// Vue.prototype.$http = axios


