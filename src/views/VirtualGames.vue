<template>
  <v-app dark>
    <core-header />
    <core-inactivity/>
    <v-content>
      <div id="core-view" style="background-color: black;" class="fill-height scroll-y">
        <v-fade-transition mode="out-in">
          <v-container style="max-width: 90%;" class="virtualgame">
            <v-layout style="max-width: 100%;height:600px;background:black;"
              align-center
              justify-center
              fill-height>
                <iframe :src="gameUrl" width="100%" height="100%" style="border:0"/>
            </v-layout>
            <v-layout>
              <v-container
                style="max-width: 95%;"
              >
                <v-layout>
                  <v-flex xs12>
                    <v-layout class="mid-menu tertiary">
                      <v-btn-toggle
                        style="height:50px;overflow-x:auto"
                        v-model="toggle_categories"
                        mandatory
                        class="tertiary"
                      >
                        <v-btn flat v-for="(category, categoryID) in category_list" :key="categoryID" style="height:100%;" class="tertiary">
                          <span class="body-1">{{category}}</span>
                        </v-btn>
                      </v-btn-toggle>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex 
                        v-for="(game, index) in game_list"
                        :key="index"
                        xl3 lg3 md4 sm4 xs6
                        class="pa-1"
                      >
                        <v-hover>
                          <v-card flat slot-scope="{ hover }">
                            <v-img
                              :src="game.imagePreview"
                              aspect-ratio="1.5"
                            >
                                <div
                                  v-if="hover"
                                  class="d-flex black v-card--reveal"
                                  style="height: 100%;"
                                >
                                </div>
                                <div 
                                  v-if="hover"
                                  class="d-flex v-card-btn"
                                >
                                  <v-btn flat @click="get_game_url(game.casinoGameID, 0)" class="blue dark">{{$t('Casino.play')}}</v-btn>
                                </div>
                            </v-img>
                            <v-card-actions class="tertiary">
                              <span class="body-2">{{ game.name }}</span>
                            </v-card-actions>
                          </v-card>
                        </v-hover>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-layout>
          </v-container>
        </v-fade-transition>
      </div>
    </v-content>
    <core-footer />
  </v-app>
</template>

<script lang="ts">
export default {
  data(){
    return {
      category_list:[],
      toggle_categories: 0,
      game_list:[],
      gameUrl:''
    }
  },
  methods:{
    get_game(){
      this.axios
        .post(
          "zt_casino_games",
          {
            category: this.category_list[this.toggle_categories],
            type: "virtual-games",
          },
          {
            headers: {
              "X-localization": this.$store.getters.getLanguage
            }
          }
        )
        .then(response => {
          if(response.data.success != undefined){
            this.game_list = response.data.success.data
            if(this.gameUrl == undefined || this.gameUrl == ''){
              this.get_game_url(this.game_list[0].casinoGameID, 0)
            }
          }
          else
            console.log('zt_casino_games error')
        })
        .catch(e => {
          console.log(e);
        });
    },
    get_category(){
      this.axios
        .post(
          "zt_casino_game_categories",
          {
            type: "virtual-games",
          },
          {
            headers: {
              "X-localization": this.$store.getters.getLanguage
            }
          }
        )
        .then(response => {
          if(response.data.success != undefined){
            this.category_list = response.data.success.data
            this.get_game()
          }
          else
            console.log('zt_casino_game_categories error')
        })
        .catch(e => {
          console.log(e);
        });
    },
    get_game_url(casinoGameID, isPlayForFun){
      this.axios
        .post(
          "zt_get_casino_game",
          {
            casinoGameID: casinoGameID,
            isPlayForFun: isPlayForFun,
          },
          {
            headers: {
              "X-localization": this.$store.getters.getLanguage,
              "Authorization": 'Bearer ' + localStorage.betic_storage,
            }
          }
        )
        .then(response => {
          if(response.data.success != undefined){
            this.gameUrl = response.data.success.data
          }
          else
            console.log('zt_get_casino_game error')
        })
        .catch(e => {
          console.log(e);
        });
    },
  },
  watch:{
    toggle_categories: function(){
      this.get_game()
    }
  },
  mounted(){
    this.get_category()
  }
}
</script>

<style lang="scss" scoped></style>
