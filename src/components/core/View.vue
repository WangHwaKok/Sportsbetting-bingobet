<template>
  <router-view :class="getTheme" />
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  metaInfo() {
    return {
      title: ''
    }
  },
  computed: {
    ...mapGetters(['getTheme'])
  }
}
</script>
