<template>
  <!-- <div class="header"> -->
    <!-- <material-logo :logourl="logourl" /> -->
    <!-- <div class="logo">
      <img :src="logourl" style="height:50px"/>
    </div> -->
    <v-layout>
      <!-- <v-spacer></v-spacer> -->
      <v-flex>
        <core-header-login />
        <core-header-Deposit />
      </v-flex>
    </v-layout>
    <!-- <core-header-Menu /> -->
    <!-- <v-divider class="mt-1 orange"/> -->
  <!-- </div> -->
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  data: () => ({
    title: null,
    responsive: false,
    responsiveInput: false,
    // logourl: '/img/demobetic.png'
  }),

  watch: {
    $route(val) {
      this.title = val.name
    }
  },
  mounted() {
    // if(localStorage.logourl != undefined && localStorage.logourl != '')
    //   this.logourl = localStorage.logourl
    // else
    //   this.getSystemDetail()
    // var system_info = JSON.parse(localStorage.system_conf);
    // if(system_info.logo != "/img/localhost:2053.png")
    //   this.logourl = system_info.logo;
    // if(this.$store.getters.getParameters == undefined || Object.keys(this.$store.getters.getParameters).length == 0)
      this.getParameters()
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },

  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClickBtn() {
      this.setDrawer(!this.$store.state.app.drawer)
    },
    onClick() {
      //
    },
    onResponsiveInverted() {
      // if (window.innerWidth >= 1450) {
      //   this.$root.$emit("resizeEvent", {hasSize: 0})
      // }
      // else if(window.innerWidth >= 1350){
      //   this.$root.$emit("resizeEvent", {hasSize: 1})
      // }
      // else {
      //   this.$root.$emit("resizeEvent", {hasSize: 2})
      // }
    },
    getParameters(){
        this.axios
          .get("zt_paramaters",
            {
              headers: {
                'X-localization': this.$store.getters.getLanguage
              }
            })
          .then(response => {
            if(response.data.success)
            {
              this.$store.commit("setParameters", response.data.success.data);
              this.$root.$emit('update-parameters');
            }
          })
          .catch(e => {
            console.log(e);
          });
      },
  }
}
</script>

<style lang="scss" scoped>
// .logo {
//   position: absolute;
//   display: inline;
// }
// #core-toolbar a {
//   text-decoration: none;
// }
// .header {
//   background-color: black;
// }
// .header .logo {
//   top: 20px;
//   left: 20px;
// }
</style>

