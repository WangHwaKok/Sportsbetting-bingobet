<template>
  <core-view />
</template>

<script>
export default {
  data(){
    return {
    }
  },
  mounted(){
    this.$store.commit('setDarkTheme', false)
    // var system_info = JSON.parse(localStorage.system_conf);
    // if(system_info.theme == 'theme-green'){
    //   this.$store.commit('setDarkTheme', true)
    // }
    // else{
    //   this.$store.commit('setDarkTheme', false)
    //   this.$vuetify.theme.primary = this.$vuetify.theme.blue_primary
    //   this.$vuetify.theme.tertiary = this.$vuetify.theme.blue_tertiary
    //   this.$vuetify.theme.tertiary1 = this.$vuetify.theme.blue_tertiary1
    //   this.$vuetify.theme.tertiary2 = this.$vuetify.theme.blue_tertiary2
    //   this.$vuetify.theme.tertiary3 = this.$vuetify.theme.blue_tertiary3
    // }
  }
}
</script>
<style lang="scss">
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
html{
  overflow-y: hidden;
  overflow-x: auto;
}
</style>
