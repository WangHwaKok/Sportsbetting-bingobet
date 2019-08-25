<template>
  <v-app dark style="min-width:1440px;">
    <core-header />
    <core-inactivity/>
    <v-content>
      <div style="background-color: black;" class="fill-height scroll-y">
        <v-fade-transition mode="out-in">
          <v-container style="max-width: 90%;" class="casino">
            <v-layout style="position: relative;">
              <v-carousel height="600" hide-delimiters>
                <v-carousel-item
                  v-for="(item, i) in carousel"
                  :key="i"
                  :src="item.imagePath"
                ></v-carousel-item>
              </v-carousel>

              <!-- <span
                style="position: absolute; right: 200px; bottom: 200px; background-color: rgba(0,0,0,.6); box-shadow: 0px 0px 20px 20px rgba(0,0,0,.6);"
              >
                <span
                  style="font-size: 50px; text-transform: uppercase; line-height: 1.2; font-weight: bold;"
                >
                  Always The
                  <br />
                  <span style="color: #4caf50;">Latest</span> Slots
                </span>
                <br />
                <span style="font-size: 24px;">From Top Providers</span>
              </span> -->
            </v-layout>
            <v-layout>
              <v-container
                style="max-width: 95%;"
              >
                <v-layout>
                  <v-flex xs12>
                    <v-layout class="mid-menu tertiary">
                      <v-btn-toggle
                        style="height:60px;overflow-x:auto"
                        v-model="toggle_categories"
                        mandatory
                        class="tertiary1"
                      >
                        <v-btn flat v-for="(category, categoryID) in category_list" :key="categoryID" style="height:100%;" class="tertiary">
                          <span class="body-1">{{category}}</span>
                        </v-btn>
                      </v-btn-toggle>
                    </v-layout>
                    <v-layout class="button-type">
                      <v-btn flat v-for="(type, idx) in type_list" :key="idx" :class="select_type == idx ? 'v-btn--active' : ''">
                        <span class="body-1" @click="get_filter_game(type, idx)">{{type}}</span>
                      </v-btn>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex
                        v-for="(game, index) in game_filter_list"
                        :key="index"
                        xl2 lg2 md3 sm4 xs6
                        class="pa-1"
                      >
                        <v-hover>
                          <v-card flat slot-scope="{ hover }" class="clickable">
                            <v-img
                              :src="game.image"
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
                                  <v-btn flat @click="get_game_url(game.casinoGameID, 0)" class="blue dark">{{$t('Casino.real_play')}}</v-btn>
                                  <v-btn flat @click="get_game_url(game.casinoGameID, 1)" class="blue dark">{{$t('Casino.fun_play')}}</v-btn>
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

<script>
export default {
  data() {
    return {
      carousel: [],
      category_list:[],
      toggle_categories: 0,
      game_list:[],
      game_filter_list: [],
      type_list:[this.$t('Casino.all_games')],
      select_type:0,
      popupWindowID:'',
    }
  },
  methods:{
    get_game(){
      this.axios
        .post(
          "zt_casino_games",
          {
            category: this.category_list[this.toggle_categories],
            type: "casino",
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
            this.type_list = [this.$t('Casino.all_games')]
            this.game_filter_list = this.game_list
            this.select_type = 0
            var self = this
            if(this.game_list.length > 0){
              this.game_list.forEach(game => {
                var findID = -1
                this.type_list.find(function(type, i){
                  if(type == game.type){
                    findID = i
                    return
                  }
                })

                if(findID == -1){
                  this.type_list.push(game.type)
                }
              })
            }
          }
          else
            console.log('zt_casino_games error')
        })
        .catch(e => {
          console.log(e);
        });
    },
    get_filter_game(type, idx){
      this.select_type = idx
      if(idx == 0){
        this.game_filter_list = []
        this.game_filter_list = this.game_list
        return
      }
      this.game_filter_list = []
      this.game_list.forEach(game => {
        if(game.type == type){
          this.game_filter_list.push(game)
        }
      })
    },
    get_category(){
      this.axios
        .post(
          "zt_casino_game_categories",
          {
            type: "casino",
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
            if(this.popupWindowID != undefined && this.popupWindowID.length > 0){
              this.popupWindowID.close()
              this.popupWindowID = ''
            }
            this.popupWindowID = window.open(response.data.success.data,'popUpWindow','width=960, height=660,left=10,top=10,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=yes')
          }
          else
            console.log('zt_get_casino_game error')
        })
        .catch(e => {
          console.log(e);
        });
    },
    getSliders(){
      this.axios
        .post(
          "zt_sliders",
          {
            pageType: '3'
          },
          {
            headers: {
              "X-localization": this.$store.getters.getLanguage
            }
          }
        )
        .then(response => {
          if (response.data.success == undefined){
            console.log("getSlider Error");
            return;
          }

          this.carousel = response.data.success.data;
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
    this.getSliders()
  },
}
</script>
