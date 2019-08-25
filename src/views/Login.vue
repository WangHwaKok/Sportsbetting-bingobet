<template>
  <v-app :dark="$store.getters.getDarkTheme">
    <v-content>
      <v-fade-transition mode="out-in">
        <v-layout
          column
          justify-center
          align-center
          fill-height
          class="login-view"
        >
            <v-card class="outlined sf-wrapper">
              <v-card-title class="justify-center tertiary1">
                <span class="subheading" style="color:white">{{$t('Login.login')}}</span>
              </v-card-title>
              <v-form
                id="signinForm"
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-container>
                  <v-text-field
                    v-model="username"
                    :rules="[v => !!v || $t('Login.user_name_is_required'),
                              v =>
                                (v && v.length <= 25) || $t('Login.user_name_must_be_less_than_25_characters')
                            ]"
                    :label="$t('Login.user_name')"
                    required
                    single-line
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    :rules="[v => !!v || $t('Login.password_is_required'),
                              v => (v && v.length >= 4) || $t('Login.password_must_be_more_than_4_characters')
                            ]"
                    :label="$t('Login.user_password')"
                    v-on:keyup.enter="signin()"
                    type="password"
                    required
                    outlined
                    single-line
                  ></v-text-field>
                  <!-- <v-layout justify-space-between class="ma-0" height="50">
                    <v-flex xs4 class="pa-0">
                      <v-select
                        v-model="language"
                        :items="langList"
                        item-text="name"
                        item-value="value"
                        @change="languageChanged"
                        solo
                        :label="$t('Common.language')"
                      >
                        <template slot="selection" slot-scope="data">
                          <v-list-tile-content>
                            <v-list-tile-title class="pl-2">
                              <flag :iso="data.item.flag" />
                              {{ data.item.name }}
                            </v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                        <template slot="item" slot-scope="data">
                          <v-list-tile-content>
                            <v-list-tile-title>
                              <flag :iso="data.item.flag" />
                              {{ data.item.name }}
                            </v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </v-select>
                    </v-flex>
                    <v-flex xs3 pa-0 d-flex justify-end>
                      <v-btn color="green" class="ma-0" @click="signin" :loading="is_loading" :disabled="is_loading">
                        {{ $t('Login.sign_in') }}
                      </v-btn>
                    </v-flex>
                  </v-layout> -->
                  <span style="color: #f55a4e;">{{ message }}</span>
                  <v-btn block flat style="background:#e89e16;border:1px solid black;" class="ma-0" @click="signin" :loading="is_loading" :disabled="is_loading">
                    <span class="subheading font-weight-bold" style="color:white">{{ $t('Login.sign_in') }}</span>
                  </v-btn>
                </v-container>
              </v-form>
            </v-card>

            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  style="background:green;min-width:12rem;"
                  dark
                  v-on="on"
                >
                  {{getLanguageName}}
                </v-btn>
              </template>
              <v-list dark style="background:#015601">
                <v-list-tile
                  v-for="(item, index) in langList"
                  :key="index"
                  @click="languageChanged(item.value)"
                >
                  <v-list-tile-title><flag :iso="item.flag" /> {{ item.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
        </v-layout>
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      username: '',
      password: '',
      language: '',
      langList: [],
      message: '',
      is_loading: false,
    }
  },
  methods: {
    signin() {
      if (this.$refs.form.validate()) {
        this.is_loading = true
        // here call signin API call.
        // when the result is OK, go to homepage.
        this.axios.post('zt_login', {
          "username": this.username,
          "password": this.password,
          "userAgent": navigator.userAgent,
            "localization": this.language
        })
          .then(response => {
              // this.$router.push('/sports-betting')
              var data = response.data;

              if(data.success){
                localStorage.betic_storage = data.success.token
                this.$store.commit("setLanguage", this.language)
                localStorage.setLanguage = this.language
                this.$store.commit("setUsername", data.success.username)
                this.$store.commit("setUserId", data.success.userID)
                this.$store.commit("setUserRole", data.success.membershipRole)
                this.$store.commit("setEmail", data.success.email)
                this.$router.push('/sports-betting')
              }
              else{
                this.message = this.$t('Login.incorrect_user_name_or_password')
              }
              this.is_loading = false
          })
          .catch(e => {
              console.log(e)
              this.is_loading = false
          })
      }
    },
    languageChanged(lan){
      this.language = lan
      this.$store.commit("setLanguage", this.language)
      localStorage.setLanguage = this.language
      // this.$i18n.locale = this.language
      location.reload()
    },
  },
  computed:{
    getLanguageName(){
      if(this.langList.length == 0)
        return
      var lanIdx = 0
      var self = this
      this.langList.find(function(lan, i){
        if(lan.value == self.language){
          lanIdx = i
          return
        }
      })
      return this.langList[lanIdx].name
    }
  },
  mounted(){
    this.language = this.$i18n.locale
    var system_info = JSON.parse(localStorage.system_conf);
    this.langList = system_info.languages
    // console.log(this.$i18n.locale)
    // this.$store.dispatch({})
  },

}
</script>
