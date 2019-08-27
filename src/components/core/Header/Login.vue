<template>
  <v-layout v-if="hasLogin || (!hasLogin && isLoggedIn)" class="pt-2 login-bar" row justify-start align-top style="background:#101010;">
    <div class="logo align-center justify-center ml-4" style="align-self:center; cursor:pointer;" @click="gotoHome">
      <img :src="logourl" style="height:40px;"/>
    </div>
    <v-spacer></v-spacer>
    <span class="title font-weight-bold mr-4" style="color:white">{{$t('Common.welcome', {username:getUsername}) }}</span>
    <v-select
        light
        v-model="balanceInfo"
        :items="moneyList"
        item-text="name"
        item-value="value"
        solo
        style="max-width:250px;"
      ></v-select>
      <v-btn :dark="false" class="ml-1 my-0" icon outlined dense color="black" 
        v-if="hasLogin || (!hasLogin && isLoggedIn)"
        @click="getBalance"
        :loading="is_refresh"
        :disabled="is_refresh">
        <v-icon :dark="false" color="white">mdi-refresh</v-icon>
      </v-btn>
      
      <v-select
        v-if="$store.getters.getRole == 'user'"
        light
        v-model="accountInfo"
        :items="accountUserPageList"
        item-text="name"
        item-value="value"
        solo
        dense
        single-line
        style="max-width:200px;padding-right:10px"
        :label="$t('Common.account')"
      ></v-select>

      <v-select v-else
        v-model="accountInfo"
        :items="accountSupplierPageList"
        item-text="name"
        item-value="value"
        light
        solo
        dense
        single-line
        style="max-width:200px;padding-right:10px"
        :label="$t('Common.account')"
      ></v-select>

      <v-select
        v-model="languageInfo"
        :items="languageList"
        item-text="name"
        item-value="value"
        @change="languageChanged"
        light
        solo
        dense
        single-line
        style="max-width:150px;padding-right:10px"
      >
        <template slot="selection" slot-scope="data">
          <v-list-tile-content>
            <v-list-tile-title class="pl-2">
              <flag :iso="data.item.flag" />
              {{ data.item.name }}
            </v-list-tile-title>
          </v-list-tile-content>
        </template>
        <template slot="item" slot-scope="data">
          <v-list-tile-content>
            <v-list-tile-title>
              <flag :iso="data.item.flag" />
              {{ data.item.name }}
            </v-list-tile-title>
          </v-list-tile-content>
        </template>
      </v-select>
    <v-btn color="error" class="ma-0 mr-4" style="max-width:60px;" @click="logout">{{$t('Common.logout')}}</v-btn>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      hasLogin: '',
      isLoggedIn: '',
      moneyList: [],
      languageList: [],
      accountUserPageList:[
        {name: this.$t('AccountPage.my_bets'), value: '1'},
        {name: this.$t('AccountPage.account_activities'), value: '2'},
        {name: this.$t('AccountPage.change_password'), value: '7'},
      ],
      accountSupplierPageList:[
        {name: this.$t('AccountPage.my_bets'), value: '1'},
        {name: this.$t('AccountPage.account_activities'), value: '2'},
        {name: this.$t('AccountPage.user_list'), value: '3'},
        {name: this.$t('AccountPage.user_balance'), value: '4'},
        {name: this.$t('AccountPage.income_expense'), value: '5'},
        {name: this.$t('AccountPage.printer_setting'), value: '6'},
        {name: this.$t('AccountPage.change_password'), value: '7'},
      ],
      balanceInfo: "1",
      accountInfo: "",
      languageInfo: "en",
      is_refresh: false,
      valid: true,
      username: '',
      password: '',
      message: '',
      is_loading: false,
      logourl: '/img/demobetic.png'
    }
  },
  methods: {
    signin() {
      // if (this.$refs.form.validate()) {
        this.is_loading = true
        // here call signin API call.
        // when the result is OK, go to homepage.
        this.axios.post('zt_login', {
          "username": this.username,
          "password": this.password,
          "userAgent": navigator.userAgent,
            "localization": this.language
        })
          .then(response => {
              // this.$router.push('/sports-betting')
              var data = response.data;

              if(data.success){
                localStorage.betic_storage = data.success.token
                this.$store.commit("setLanguage", this.language)
                localStorage.setLanguage = this.language
                this.$store.commit("setUsername", data.success.username)
                this.$store.commit("setUserId", data.success.userID)
                this.$store.commit("setUserRole", data.success.membershipRole)
                this.$store.commit("setEmail", data.success.email)
                // this.$router.push('/sports-betting')
                // this.$forceUpdate()
                location.reload()
              }
              else{
                this.message = this.$t('Login.incorrect_user_name_or_password')
              }
              this.is_loading = false
          })
          .catch(e => {
              console.log(e)
              this.is_loading = false
          })
      // }
    },
    logout() {
      this.$store.dispatch("clearVuex");
      localStorage.removeItem("betic_storage");
      this.$router.push("/");
      location.reload()
    },
    gotoAccount(){
      this.$router.push("/account-management")
    },
    getBalance(){
      this.is_refresh = true
      this.axios.get('zt_get_balance', {
        headers:{
          Authorization: 'Bearer ' + localStorage.betic_storage,
          "X-localization": this.$store.getters.getLanguage
        }
      })
        .then(response => {
            // this.$router.push('/sports-betting')
            // console.log(response)
            var data = response.data
            // console.log(data)
            if(data.success){
              this.moneyList = []
              // console.log(response.data.succsess)
              var isCombined = data.success.data.isCombined != undefined ? data.success.data.balance : false
              var currency = data.success.data.currency != undefined ? data.success.data.currency : ''
              if(isCombined){
                var balance = data.success.data.balance != undefined ? data.success.data.balance : ''
                this.moneyList.push({name:'balance: '+balance+' '+currency, value:'1'})
              }
              else{
                var poker = data.success.data.pokerBalance != undefined ? data.success.data.pokerBalance : ''
                var sport = data.success.data.sportBalance != undefined ? data.success.data.sportBalance : ''
                var casino = data.success.data.casinoBalance != undefined ? data.success.data.casinoBalance : ''
                var tombala = data.success.data.tombalaBalance != undefined ? data.success.data.tombalaBalance : ''
                this.moneyList.push({name:this.$t('Common.sport_balance')+' :'+sport+' '+currency, value:'1'})
                this.moneyList.push({name:this.$t('Common.casino_balance')+' :'+casino+' '+currency, value:'2'})
                this.moneyList.push({name:this.$t('Common.tombala_balance')+' :'+tombala+' '+currency, value:'3'})
                this.moneyList.push({name:this.$t('Common.poker_balance')+' :'+poker+' '+currency, value:'4'})
              }
              
              // console.log(this.moneyList)
              // this.$router.push('/sports-betting')
            }
            this.is_refresh = false
        })
        .catch(e => {
            console.log(e)
            this.is_refresh = false
        })
    },
    languageChanged(){
      this.$store.commit("setLanguage", this.languageInfo)
      localStorage.setLanguage = this.languageInfo
      // console.log(this.languageInfo)
      // this.$i18n.locale = this.language
      location.reload()
    },
    gotoHome(){
      this.$router.push('/sports-betting')
    }
  },
  computed: {
    getUsername() {
      // console.log(this.$store.getters.getUserId)
      return this.$store.getters.getUsername;
    }
  },
  watch:{
    accountInfo:function(){
      localStorage.account_page = this.accountInfo - 1
      this.$router.push('/account-management')
    }
  },
  mounted() {
    var system_info = JSON.parse(localStorage.system_conf);
    this.hasLogin = system_info.hasLoginPage
    if(localStorage.betic_storage != undefined && localStorage.betic_storage != "")
      this.isLoggedIn = true
    else
      this.isLoggedIn = false

    if(system_info.logo != "/img/localhost:2053.png")
      this.logourl = system_info.logo;
    this.$store.commit("setLanguage", this.$i18n.locale)
    
    var self = this
    if(localStorage.balanceTimer != undefined && localStorage.balanceTimer.length > 0){
      clearInterval(localStorage.balanceTimer)
    }
    localStorage.balanceTimer = setInterval(function(){
      self.getBalance()
    }, 30*1000)

    if(localStorage.secondTimer != undefined && localStorage.secondTimer.length > 0){
      clearInterval(localStorage.secondTimer)
    }
    localStorage.secondTimer = setInterval(function(){
      self.$root.$emit('liveTime')
    }, 1000)
    
    this.getBalance()
    this.languageInfo = this.$store.getters.getLanguage
    this.languageInfo = this.$i18n.locale

    if(system_info != undefined)
      this.languageList = system_info.languages

    this.$root.$on("updateBalance", function(){
      // console.log("yes of course")
      self.getBalance()
    })
  }
};
</script>
<style scoped>
.v-btn {
  background-color: var(--v-accent-lighten2);
}
</style>
