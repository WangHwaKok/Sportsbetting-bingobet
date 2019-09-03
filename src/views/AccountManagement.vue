<template>
  <v-app dark style="min-width:1280px;background: url('/img/bingo_bet.jpg'); background-size: 100% 100%;">
    <!-- <core-filter /> -->
    <v-content class="account-view">
      <core-header />
      <core-socket />
      <core-inactivity/>
      <v-fade-transition mode="out-in">
        <v-container fluid row style="height: calc(100vh - 175px);">
          <v-layout>
            <v-card style="border-radius:3px;background:unset;border:unset;box-shadow:unset;width:17rem;" class="mr-2">
              <v-card-title style="background:#e09007;height:3.5rem;" class="pa-0 px-2">
                <div class="subheading font-weight-medium" style="color:black;">{{$t('AccountPage.account_menu')}}</div>
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list dense class="pt-0 account-menu">
                  
                  <template v-for="(panel, i) in panelsSupplier" v-if="$store.getters.getRole=='supplier'">
                    <v-list-tile
                      class="title"
                      v-if="panel.role == 'title'"
                    >
                      <v-list-tile-action>
                        <v-icon color="#e09007">{{panel.icon}}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <div class="body-2" style="color:#e19107">{{ panel.text }}</div>
                      </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile
                      v-else
                      :key="i"
                      :class="currentPanel == i ? 'selected' : ''"
                      @click="drawerClick(i)"
                    >
                      <v-list-tile-content>
                        <div class="body-2" :style="`color:${currentPanel == i ? 'white': '#c0c0c0'}`">{{ panel.text }}</div>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>

                  <template v-for="(panel, i) in panelsUser" v-else>
                    <v-list-tile
                      class="title"
                      v-if="panel.role == 'title'"
                    >
                      <v-list-tile-action>
                        <v-icon color="#e09007">{{panel.icon}}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <div class="body-2" style="color:#e19107">{{ panel.text }}</div>
                      </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile
                      v-else
                      :key="i"
                      :class="currentPanel == i ? 'selected' : ''"
                      @click="drawerClick(i)"
                    >
                      <v-list-tile-content>
                        <div class="body-2" :style="`color:${currentPanel == i ? 'white': '#c0c0c0'}`">{{ panel.text }}</div>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
            <div class="panel">
              <!-- <v-system-bar
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
              </v-system-bar> -->
              <component v-if="$store.getters.getRole=='supplier'" :is="panelsSupplier[currentPanel].name"></component>
              <component v-else :is="panelsUser[currentPanel].name"></component>
            </div>
          </v-layout>
        </v-container>
      </v-fade-transition>
      <core-footer />
    </v-content>
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
      panelsSupplier: [
        {
          icon: 'mdi-format-list-bulleted',
          text: this.$t('AccountPage.account_activity'),
          role:'title',
        },
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
          text: this.$t('AccountPage.financial_transactions'),
          role:'user',
        },
        {
          name: 'core-account-management-panel-income-expense',
          id: '#p_income',
          icon: 'mdi-cash-multiple',
          text: this.$t('AccountPage.income_expense'),
          role:'supplier',
        },
        {
          icon: 'mdi-account',
          text: this.$t('AccountPage.user_actions'),
          role:'title',
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
      panelsUser: [
        {
          icon: 'mdi-format-list-bulleted',
          text: this.$t('AccountPage.account_activity'),
          role:'title',
        },
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
          text: this.$t('AccountPage.financial_transactions'),
          role:'user',
        },
        {
          icon: 'mdi-account',
          text: this.$t('AccountPage.user_actions'),
          role:'title',
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
    // drawer: function(val) {
    //   this.toggleDrawer(val)
    // }
  },
  mounted() {
    // this.drawer = this.$vuetify.breakpoint.lgAndUp
    // this.toggleDrawer(this.drawer)
    if(localStorage.account_page != undefined){
      this.currentPanel = localStorage.account_page
    }

  },
  methods: {
    drawerClick(panelNumber) {
      this.currentPanel = panelNumber
      localStorage.account_page = panelNumber
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
