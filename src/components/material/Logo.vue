<template>
  <div class="logo">
    <img :src="logourl" style="height:50px"/>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    logourl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  position: absolute;
  display: inline;
}
</style>
