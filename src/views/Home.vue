<template>
  <v-app dark>
    <core-header />
    <v-content>
      <div id="core-view">
          <!-- <div>Home</div> -->
          <v-layout column justify-center align-center>
            <v-subheader>Offset Top</v-subheader>
            {{ offsetTop }}
          </v-layout>
          <v-container
            id="scroll-target"
            style="max-height: 400px"
            class="scroll-y"
          >
            <v-layout
              v-scroll:#scroll-target="onMainScroll"
              column
              align-center
              justify-center
              style="height: 1000px"
            >
            </v-layout>
          </v-container>
      </div>
    </v-content>
    <core-footer />
  </v-app>
</template>

<script>
export default {
  data: () => ({
      offsetTop: 0
    }),

    methods: {
      onMainScroll (e) {
        this.offsetTop = e.target.scrollTop
      }
    }
}
</script>
