<template>
  <v-menu
    :close-on-content-click="false"
    bottom
    left
    min-width="300"
    max-width="300"
    nudge-left="12"
    offset-x
    transition="slide-y-transition"
  >
    <v-btn
      slot="activator"
      class="elevation-0"
      color="grey"
      dark
      fab
      fixed
      flat
      style="top: 80px; right: 20px;"
      top
    >
      <v-icon>mdi-settings</v-icon>
    </v-btn>
    <v-card>
      <v-container grid-list-xl>
        <v-layout wrap>
          <v-flex xs12>
            <div class="text-xs-center body-2 text-uppercase sidebar-filter">
              Select Your Theme Color
            </div>
            <v-divider class="mt-3" />
            <v-layout>
              <v-flex xs9>
                <v-layout column>
                  <v-flex><v-chip color="green"></v-chip></v-flex>
                  <v-flex><v-chip color="blue"></v-chip></v-flex>
                  <v-flex><v-chip color="yellow"></v-chip></v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs3></v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script>
// Utilities
import { mapMutations, mapGetters } from 'vuex'

export default {
  data: () => ({
    themes: [
      { name: 'Green', value: 'theme-green' },
      { name: 'Blue', value: 'theme-blue' },
      { name: 'Yellow', value: 'theme-yellow' }
    ]
  }),

  computed: {},

  methods: {
    ...mapMutations(['setTheme']),
    setColor(color) {
      this.$store.state.app.color = color
    }
  }
}
</script>

<style lang="scss"></style>
