<template>
  <v-app dark>
    <!-- <core-filter /> -->
    <core-header />
    <core-socket />
    <core-inactivity/>
    <v-content class="account-view">
      <v-fade-transition mode="out-in">
        <v-container fluid row  class="pa-0 mb-4">
          <v-layout>
            <v-navigation-drawer
              v-model="drawer"
              :clipped="$vuetify.breakpoint.lgAndUp"
            >
              <v-system-bar
                status
                color="primary"
                height="32"
                class="subheading"
              >
                {{$t('AccountPage.account_management')}}
              </v-system-bar>
              <v-list dense class="pt-0">
                <template v-for="(panel, i) in panels" v-if="$store.getters.getRole=='supplier' || ($store.getters.getRole == 'user' && panel.role=='user')">
                  <v-list-tile
                    :key="i"
                    :class="currentPanel == i ? 'tertiary2' : ''"
                    @click="drawerClick(i)"
                  >
                    <v-list-tile-action>
                      <v-icon>{{ panel.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ panel.text }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="panel.name"></v-divider>
                </template>
              </v-list>
            </v-navigation-drawer>
            <div class="panel">
              <v-system-bar
                status
                color="primary"
                height="32"
                class="subheading"
              >
                <v-btn
                  v-if="!$vuetify.breakpoint.lgAndUp && !drawer"
                  fab
                  color="primary"
                  small
                  @click.stop="drawer = !drawer"
                >
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </v-btn>
                {{ panels[currentPanel].text }}
              </v-system-bar>
              <component :is="panels[currentPanel].name"></component>
            </div>
          </v-layout>
        </v-container>
      </v-fade-transition>
    </v-content>
    <core-footer />
  </v-app>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      currentPanel: 0,
      drawer: false,
      hasSize: 0,
      panels: [
        {
          name: 'core-account-management-panel-my-bets',
          id: '#p_mybets',
          icon: 'mdi-calendar',
          text: this.$t('AccountPage.my_bets'),
          role:'user',
        },
        {
          name: 'core-account-management-panel-account-activities',
          id: '#p_activities',
          icon: 'mdi-account',
          text: this.$t('AccountPage.account_activities'),
          role:'user',
        },
        {
          name: 'core-account-management-panel-user-list',
          id: '#p_users',
          icon: 'mdi-format-list-bulleted',
          text: this.$t('AccountPage.user_list'),
          role:'supplier',
        },
        {
          name: 'core-account-management-panel-user-balance',
          id: '#p_userBalance',
          icon: 'mdi-wallet',
          text: this.$t('AccountPage.user_balance'),
          role:'supplier',
        },
        {
          name: 'core-account-management-panel-income-expense',
          id: '#p_income',
          icon: 'mdi-cash-multiple',
          text: this.$t('AccountPage.income_expense'),
          role:'supplier',
        },
        {
          name: 'core-account-management-panel-printer-settings',
          id: '#p_printer',
          icon: 'mdi-printer-settings',
          text: this.$t('AccountPage.printer_settings'),
          role:'supplier',
        },
        {
          name: 'core-account-management-panel-change-password',
          id: '#p_chpwd',
          icon: 'mdi-key-variant',
          text: this.$t('AccountPage.change_password'),
          role:'user',
        }
      ],
    }
  },
  watch: {
    drawer: function(val) {
      this.toggleDrawer(val)
    }
  },
  mounted() {
    this.drawer = this.$vuetify.breakpoint.lgAndUp
    this.toggleDrawer(this.drawer)
    if(localStorage.account_page != undefined){
      this.currentPanel = localStorage.account_page
      localStorage.account_page = 0
    }

  },
  methods: {
    toggleDrawer(val) {
      let panel = document.getElementsByClassName('panel')[0]
      let aside = document.getElementsByTagName('aside')[0]
      if (!this.$vuetify.breakpoint.lgAndUp) {
        aside.style.position = 'absolute'
        setTimeout(() => {
          if (val) {
            aside.classList.add('pop')
          } else {
            aside.classList.remove('pop')
          }
        }, 100)
        panel.classList.add('expand')
      } else {
        aside.style.position = 'unset'
        panel.classList.remove('expand')
      }
    },
    drawerClick(panelNumber) {
      this.currentPanel = panelNumber
    },
    setHasSize(){
      if (window.innerWidth >= 1450) {
        this.hasSize = 0
      }
      else if(window.innerWidth >= 1350){
        this.hasSize = 1
      }
      else {
        this.hasSize = 2
      }
    }
  }
}
</script>

<style></style>
