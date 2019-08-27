<template>
  <v-layout row class="deposit-bar" justify-start align-center>
    <v-toolbar id="core-toolbar" :dense="true">
      <v-toolbar-items>
        <v-btn color="white" v-for="(link, i) in links" :key="i" flat :to="link.to" v-if="!link.login || (link.login && !hasLogin && isLoggedIn) || (link.login && hasLogin)">
          <v-icon>{{ link.icon }}</v-icon>
          {{ link.text }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-spacer></v-spacer>
    <v-text-field
      dark
      :label='$t("Betting.event_search")'
      height="30"
      single-line
      outlined
      class="mt-0 mb-0 pa-1"
      style="width:30rem;margin-right:5rem;padding-top:0px;background:#ad641e"
      v-model="searchPrematchStr"
      v-on:keyup.enter="searchPrematchList"
    ></v-text-field>
  </v-layout>
</template>

<script>
// import { clearInterval } from 'timers';
export default {
  data(){
    return {
      hasLogin:'',
      isLoggedIn:'',
      searchPrematchStr: '',
      links: [
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
      ],
      logourl: '/img/demobetic.png'
    }
  },
  methods: {
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
    },
    searchPrematchList(){
      this.$root.$emit('searchEvent', {searchPrematchStr: this.searchPrematchStr})
    }
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
