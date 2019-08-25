<template>
  <v-layout row class="deposit-bar black" justify-center>
    <div class="d-flex">
      <div class="logo align-center justify-center mr-2" style="align-self:center; cursor:pointer;" @click="gotoHome">
        <img :src="logourl" style="height:40px;"/>
      </div>
      <v-toolbar id="core-toolbar" :dense="true">
        <v-toolbar-items>
          <v-btn v-for="(link, i) in links" :key="i" flat :to="link.to" v-if="!link.login || (link.login && !hasLogin && isLoggedIn) || (link.login && hasLogin)">
            <v-icon>{{ link.icon }}</v-icon>
            {{ link.text }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>
      <!-- <v-select
        v-if="hasLogin || (!hasLogin && isLoggedIn)"
        v-model="balanceInfo"
        :items="moneyList"
        item-text="name"
        item-value="value"
        outlined
        style="max-width:250px;"
        :label="$t('Common.balance')"
      ></v-select>
      <v-btn class="ml-1 mt-4" icon outlined color="black" 
        v-if="hasLogin || (!hasLogin && isLoggedIn)"
        @click="getBalance"
        :loading="is_refresh"
        :disabled="is_refresh">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      
      <template v-if="hasLogin || (!hasLogin && isLoggedIn)">
        <v-select
          v-if="$store.getters.getRole == 'user'"
          v-model="accountInfo"
          :items="accountUserPageList"
          item-text="name"
          item-value="value"
          outlined
          style="max-width:200px;padding-right:10px"
          :label="$t('Common.account')"
        ></v-select>

        <v-select
          v-else
          v-model="accountInfo"
          :items="accountSupplierPageList"
          item-text="name"
          item-value="value"
          outlined
          style="max-width:200px;padding-right:10px"
          :label="$t('Common.account')"
        ></v-select>
      </template>

      <v-select
        v-model="languageInfo"
        :items="languageList"
        item-text="name"
        item-value="value"
        @change="languageChanged"
        outlined
        style="max-width:150px;padding-right:10px"
        :label="$t('Common.language')"
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
      </v-select> -->
      
  </v-layout>
</template>

<script>
// import { clearInterval } from 'timers';
export default {
  data(){
    return {
      // moneyList: [],
      // languageList: [],
      // accountUserPageList:[
      //   {name: this.$t('AccountPage.my_bets'), value: '1'},
      //   {name: this.$t('AccountPage.account_activities'), value: '2'},
      //   {name: this.$t('AccountPage.change_password'), value: '7'},
      // ],
      // accountSupplierPageList:[
      //   {name: this.$t('AccountPage.my_bets'), value: '1'},
      //   {name: this.$t('AccountPage.account_activities'), value: '2'},
      //   {name: this.$t('AccountPage.user_list'), value: '3'},
      //   {name: this.$t('AccountPage.user_balance'), value: '4'},
      //   {name: this.$t('AccountPage.income_expense'), value: '5'},
      //   {name: this.$t('AccountPage.printer_setting'), value: '6'},
      //   {name: this.$t('AccountPage.change_password'), value: '7'},
      // ],
      // balanceInfo: "1",
      // accountInfo: "",
      // languageInfo: "en",
      // is_refresh: false,
      hasLogin:'',
      isLoggedIn:'',
      links: [
        {
          to: '/account-management',
          icon: 'mdi-home',
          text: '',
          login: true,
        },
        {
          to: '/sports-betting',
          icon: '',
          text: this.$t('Common.sports_betting'),
          login: false,
        },
        {
          to: '/live-bet',
          icon: '',
          text: this.$t('Common.live_bet'),
          login: false,
        },
        {
          to: '/casino',
          icon: '',
          text: this.$t('Common.casino'),
          login: false,
        },
        {
          to: '/live-casino',
          icon: '',
          text: this.$t('Common.live_casino'),
          login: false,
        },
        {
          to: '/virtual-games',
          icon: '',
          text: this.$t('Common.virtual_games'),
          login: false,
        }
      ],
      logourl: '/img/demobetic.png'
    }
  },
  methods: {
    // getBalance(){
    //   this.is_refresh = true
    //   this.axios.get('zt_get_balance', {
    //     headers:{
    //       Authorization: 'Bearer ' + localStorage.betic_storage,
    //       "X-localization": this.$store.getters.getLanguage
    //     }
    //   })
    //     .then(response => {
    //         // this.$router.push('/sports-betting')
    //         // console.log(response)
    //         var data = response.data
    //         // console.log(data)
    //         if(data.success){
    //           this.moneyList = []
    //           // console.log(response.data.succsess)
    //           var isCombined = data.success.data.isCombined != undefined ? data.success.data.balance : false
    //           var currency = data.success.data.currency != undefined ? data.success.data.currency : ''
    //           if(isCombined){
    //             var balance = data.success.data.balance != undefined ? data.success.data.balance : ''
    //             this.moneyList.push({name:'balance: '+balance+' '+currency, value:'1'})
    //           }
    //           else{
    //             var poker = data.success.data.pokerBalance != undefined ? data.success.data.pokerBalance : ''
    //             var sport = data.success.data.sportBalance != undefined ? data.success.data.sportBalance : ''
    //             var casino = data.success.data.casinoBalance != undefined ? data.success.data.casinoBalance : ''
    //             var tombala = data.success.data.tombalaBalance != undefined ? data.success.data.tombalaBalance : ''
    //             this.moneyList.push({name:this.$t('Common.sport_balance')+' :'+sport+' '+currency, value:'1'})
    //             this.moneyList.push({name:this.$t('Common.casino_balance')+' :'+casino+' '+currency, value:'2'})
    //             this.moneyList.push({name:this.$t('Common.tombala_balance')+' :'+tombala+' '+currency, value:'3'})
    //             this.moneyList.push({name:this.$t('Common.poker_balance')+' :'+poker+' '+currency, value:'4'})
    //           }
              
    //           // console.log(this.moneyList)
    //           // this.$router.push('/sports-betting')
    //         }
    //         this.is_refresh = false
    //     })
    //     .catch(e => {
    //         console.log(e)
    //         this.is_refresh = false
    //     })
    // },
    getPrematchOddTypeRules() {
      this.axios
        .get("zt_odd_type_rules/prematch",
            {
                headers: {
                    'X-localization': this.$store.getters.getLanguage
                }
            })
        .then(response => {
            if(response.data.success.data.length != 0)
            {
                this.$store.commit("setOddTypeRulesprematch", response.data.success.data);
                this.$root.$emit('UpdatePrematchOddTypeRules')
                // console.log(this.prematchOddTypeRules)
            }
        })
        .catch(e => {
            console.log(e);
        });
    },
    getLiveOddTypeRules() {
      this.axios
        .get("zt_odd_type_rules/live",
            {
                headers: {
                    'X-localization': this.$store.getters.getLanguage
                }
            })
        .then(response => {
            if(response.data.success.data.length != 0)
            {
                this.$store.commit("setOddTypeRuleslive", response.data.success.data);
                this.$root.$emit('UpdateLiveOddTypeRules')
            }
        })
        .catch(e => {
            console.log(e);
        });
    },
    getSportList() {
      this.axios
        .post("zt_sport_category", 
        {
          userID: this.$store.getters.getUserId,
          eventState: "prematch"
        },
        {
          headers: {
            'X-localization': this.$store.getters.getLanguage
          }
        })
        .then(response => {
          var data = response.data;
          if (data.success) {
            this.$store.commit("setSports", response.data.success.data);
          }
          this.getPrematchOddTypeRules()
        })
        .catch(e => {
          console.log(e);
        });
    },
    getLiveSportList() {
      this.axios
        .post("zt_sport_category", 
        {
          userID: this.$store.getters.getUserId,
          eventState: "live"
        },
        {
          headers: {
            'X-localization': this.$store.getters.getLanguage
          }
        })
        .then(response => {
          var data = response.data;
          if (data.success) {
            this.$store.commit("setLiveSports", response.data.success.data);
          }
          this.getLiveOddTypeRules()
        })
        .catch(e => {
          console.log(e);
        });
    },
    gotoHome(){
      this.$router.push('/sports-betting')
    }
    // languageChanged(){
    //   this.$store.commit("setLanguage", this.languageInfo)
    //   localStorage.setLanguage = this.languageInfo
    //   // console.log(this.languageInfo)
    //   // this.$i18n.locale = this.language
    //   location.reload()
    // },
  },
  // watch:{
  //   accountInfo:function(){
  //     localStorage.account_page = this.accountInfo - 1
  //     this.$router.push('/account-management')
  //   }
  // },
  mounted(){
    var system_info = JSON.parse(localStorage.system_conf);
    this.hasLogin = system_info.hasLoginPage
    if(localStorage.betic_storage != undefined && localStorage.betic_storage != "")
      this.isLoggedIn = true
    else
      this.isLoggedIn = false
    if(system_info.logo != "/img/localhost:2053.png")
      this.logourl = system_info.logo;

    this.getSportList()
    this.getLiveSportList()
  }
}
</script>
