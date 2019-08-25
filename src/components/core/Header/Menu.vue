<template>
  <v-toolbar id="core-toolbar" color="black">
    <v-toolbar-items>
      <v-btn v-for="(link, i) in links" :key="i" flat :to="link.to" v-if="!link.login || (link.login && !hasLogin && isLoggedIn) || (link.login && hasLogin)">
        <v-icon>{{ link.icon }}</v-icon>
        {{ link.text }}
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  data() {
    return {
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
      hasLogin: '',
      isLoggedIn: '',
    }
  },
  mounted(){
    var system_info = JSON.parse(localStorage.system_conf);
    this.hasLogin = system_info.hasLoginPage
    if(localStorage.betic_storage != undefined && localStorage.betic_storage != "")
      this.isLoggedIn = true
    else
      this.isLoggedIn = false
  }
}
</script>
