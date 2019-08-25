<template>
  <div class="sb-tree-list pb-3">
    <ul class="sb-sports-list">
      <li v-for="item  in searchCategories" :key="item.sportID">
        <a class="sb-sports-item" style="display:flex">
          <div class="align-center justify-start" @click="setCountryCategory(item)" style="width:100%;display:flex">
            <!-- <img :src="`/img/sports_icons/${item.sportID}.png`" /> -->
            <div class="mr-3" :class="`sport-title-icon ds-sport-icon ds-icon-${item.sportID}`"></div>
            <div class="body-2 font-weight-regular">{{ item.sportName }}</div>
          </div>

          <div class="sb-count align-center justify-center" @click="checkSportCategory(item)">
            {{ item.total }}
            <div :class='"sb-status "+ item.checked'></div>
          </div>
        </a>
        <ul v-if="item.categories && item.status">
          <li v-for="(item1, id1) in item.categories" :key="id1">
            <a class="sb-country-item" style="display:flex">
              <div class="caption font-weight-thin" @click="setLeagueCategory(item1)" style="width:100%">
                <img class="sb-icon" :src="`/img/country_flag/${item1.categoryAlias}.png`" />
                {{ item1.categoryName }}
              </div>
              <div class="sb-count align-center justify-center" @click="checkCountryCategory(item1, item)">
                {{ item1.total }}
                <div :class='"sb-status "+ item1.checked'></div>
              </div>
            </a>
            <ul v-if="item1.leagues && item1.status">
              <li v-for="(item2, id2) in item1.leagues" :key="id2">
                <a class="sb-team-item" style="display:flex;align-items:center" @click="checkLeagueCategory(item2, item1, item)">
                  <div>
                  <v-icon :class="`sb-icon starIcon ${is_favourite(item2.leagueID, item1.categoryID, item.sportID)? 'favourite': ''}`" @click.stop="favouriteSelect(item2, item1, item)">mdi-star</v-icon>
                  </div>
                  <div style="flex:1;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;" class="caption font-weight-thin">{{ item2.leagueName }}</div>
                  <div class="sb-count align-center justify-center">
                    {{ item2.total }}
                    <div :class='"sb-status "+ item2.checked'></div>
                  </div>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { constants } from 'crypto';
import { hasMagic } from 'glob';
export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      sportCategories: [],
      searchCategories: [],
      timeFilter: "",
      treeItems:{},
      sportids:[],
      categoryids:[],
      leagueids:[],
      searchStr:'',
    };
  },
  methods: {
    getSportCategories() {
      this.axios
        .post("zt_league_category", 
        {
          'timeFilter':this.timeFilter,
        },
        {
          headers: {
            'X-localization': this.$store.getters.getLanguage
          }
        })
        .then(response => {
          // console.log(response.data.success.data)          
          this.sportCategories = response.data.success.data;
          this.sportCategories.map(item =>{
            item.checked = "off"
            if(item.categories != null && item.categories.length > 0){
              item.categories.forEach(child =>{
                child.checked = "off"
                if(child.leagues != null && child.leagues.length > 0){
                  child.leagues.forEach(child1 =>{
                    child1.checked = "off"
                  })
                }
              })
            }

            return item
          })
          this.searchFilterCategories()
        })
        .catch(e => {
          console.log(e);
        });
    },
    selectedItems(){
      this.sportids = []
      this.categoryids = []
      this.leagueids = []
      // console.log(this.treeItems)
      if(Object.keys(this.treeItems).length > 0){
        this.sportids = Object.keys(this.treeItems)
        this.sportids.forEach(sportID => {
          if(Object.keys(this.treeItems[sportID]).length > 0){
            this.categoryids = [].concat(this.categoryids, Object.keys(this.treeItems[sportID]))
            Object.keys(this.treeItems[sportID]).forEach(categoryID => {
              if(Object.keys(this.treeItems[sportID][categoryID]).length > 0){
                this.leagueids = [].concat(this.leagueids, Object.keys(this.treeItems[sportID][categoryID]))
              }
            })
          }
        })

      }

      this.$root.$emit('selectLeftMenu', {
        sportids:this.sportids,
        categoryids:this.categoryids,
        leagueids:this.leagueids,
      })
    },
    clearItems(){
      this.getSportCategories()
      this.treeItems = {}
      this.sportids = []
      this.categoryids = []
      this.leagueids = []
    },
    checkSportCategory(item){
      if(item.checked == "on"){
        item.checked = "off"
        if(this.treeItems[item.sportID] != undefined)
          delete this.treeItems[item.sportID]
      }
      else{
        if(this.treeItems[item.sportID] != undefined)
          delete this.treeItems[item.sportID]
        this.treeItems[item.sportID] = {}
        var self = this
        if(item.categories != undefined && item.categories.length > 0){
          item.categories.forEach(category => {
            self.treeItems[item.sportID][category.categoryID] = {}
            if(category.leagues != undefined && category.leagues.length > 0){
              category.leagues.forEach(league => {
                self.treeItems[item.sportID][category.categoryID][league.leagueID] = 1
              })
            }
          })
        }
        item.checked = "on"
      }

      this.selectedItems()

      if(item.categories != null && item.categories.length > 0){
        item.categories.forEach(child => {
          child.checked = item.checked
          if(child.leagues != null && child.leagues.length > 0){
            child.leagues.forEach(element => {
              element.checked = item.checked
            })
          }
        });
      }

      this.searchCategories = this.searchCategories.map(item => {
        return item;
      });
    },
    checkCountryCategory(item1, item){
      if(item1.checked == "on"){
        item1.checked = "off"
        if(this.treeItems[item.sportID] != undefined && this.treeItems[item.sportID][item1.categoryID] != undefined){
          delete this.treeItems[item.sportID][item1.categoryID]
          if(Object.keys(this.treeItems[item.sportID]).length == 0)
            delete this.treeItems[item.sportID]
        }
      }
      else{
        item1.checked = "on"
        if(this.treeItems[item.sportID] == undefined){
          this.treeItems[item.sportID] = {}
        }
        this.treeItems[item.sportID][item1.categoryID] = {}
        var self = this
        if(item1.leagues != undefined && item1.leagues.length > 0){
          item1.leagues.forEach(league => {
            self.treeItems[item.sportID][item1.categoryID][league.leagueID] = 1
          })
        }
      }

      if(item1.leagues != null && item1.leagues.length > 0){
        item1.leagues.forEach(child => {
          child.checked = item1.checked
        });
      }
      item.checked = ""
      for(var child1 of item.categories){
        if(child1.checked == "on"){
          if(item.checked == "off"){
            item.checked = "middle"
            break
          }
          item.checked = "on"
        }
        else if(child1.checked == "off"){
          if(item.checked == "on"){
            item.checked = "middle"
            break
          }
          item.checked = "off"
        }
      }
      
      this.selectedItems()

      this.searchCategories = this.searchCategories.map(item => {
        return item;
      });
    },

    checkLeagueCategory(item2, item1, item){
      if(item2.checked == "on"){
        item2.checked = "off"
        if(this.treeItems[item.sportID] != undefined && this.treeItems[item.sportID][item1.categoryID] != undefined && this.treeItems[item.sportID][item1.categoryID][item2.leagueID] != undefined){
          delete this.treeItems[item.sportID][item1.categoryID][item2.leagueID]
          if(Object.keys(this.treeItems[item.sportID][item1.categoryID]).length == 0){
            delete this.treeItems[item.sportID][item1.categoryID]
            if(Object.keys(this.treeItems[item.sportID]).length == 0)
              delete this.treeItems[item.sportID]
          }
        }
      }
      else if(item2.checked == "off"){
        item2.checked = "on"

        if(this.treeItems[item.sportID] == undefined){
          this.treeItems[item.sportID] = {}
        }
        if(this.treeItems[item.sportID][item1.categoryID] == undefined)
          this.treeItems[item.sportID][item1.categoryID] = {}
        this.treeItems[item.sportID][item1.categoryID][item2.leagueID] = 1
      }

      item1.checked = ""
      for(var child of item1.leagues){
        if(child.checked == "on"){
          if(item1.checked == "off"){
            item1.checked = "middle"
            break
          }
          item1.checked = "on"
        }
        else if(child.checked == "off"){
          if(item1.checked == "on"){
            item1.checked = "middle"
            break
          }
          item1.checked = "off"
        }
      }

      item.checked = ""
      for(var child1 of item.categories){
        if(child1.checked == "on"){
          if(item.checked == "off"){
            item.checked = "middle"
            break
          }
          item.checked = "on"
        }
        else if(child1.checked == "off"){
          if(item.checked == "on"){
            item.checked = "middle"
            break
          }
          item.checked = "off"
        }
        else if(child1.checked == "middle"){
          item.checked = "middle"
          break
        }
      }

      this.selectedItems()

      this.searchCategories = this.searchCategories.map(item => {
        return item;
      });
    },

    setCountryCategory(item) {
      item.status = !item.status;
      this.searchCategories = this.searchCategories.map(item => {
        return item;
      });
    },
    setLeagueCategory(item1) {
      item1.status = !item1.status;
      
      this.searchCategories = this.searchCategories.map(item => {
        return item;
      });
    },
    searchFilterCategories(){
      this.searchCategories = []
      var self = this
      if(this.searchStr.length == 0){
        this.searchCategories = this.sportCategories.map(item=>{return item})
        return
      }
      if(this.sportCategories.length > 0){
        this.sportCategories.forEach(sport => {
          if(sport.categories != undefined && sport.categories.length > 0){
            sport.categories.forEach(category => {
              if(category.leagues != undefined && category.leagues.length > 0){
                category.leagues.forEach(league => {
                  if(league.leagueName.toLowerCase().includes(this.searchStr.toLowerCase())){
                    var searchSportIdx = -1

                    self.searchCategories.find(function(searchSport, i){
                      if(searchSport.sportID == sport.sportID){
                        searchSportIdx = i
                        return
                      }
                    })
                    if(searchSportIdx == -1){    //add
                      self.searchCategories.push(Object.assign({}, sport))
                      self.searchCategories[self.searchCategories.length - 1].categories = []
                      self.searchCategories[self.searchCategories.length - 1].categories.push(Object.assign({}, category))
                      self.searchCategories[self.searchCategories.length - 1].categories[0].leagues = []
                      self.searchCategories[self.searchCategories.length - 1].categories[0].leagues.push(Object.assign({}, league))
                    }
                    else{     //update
                      var searchCategoryIdx = -1
                      self.searchCategories[searchSportIdx].categories.find(function(searchCategory, j){
                        if(category.categoryID == searchCategory.categoryID){
                          searchCategoryIdx = j
                          return
                        }
                      })
                      if(searchCategoryIdx == -1){      //add
                        self.searchCategories[searchSportIdx].categories.push(Object.assign({}, category))
                        self.searchCategories[searchSportIdx].categories[self.searchCategories[searchSportIdx].categories.length - 1].leagues = []
                        self.searchCategories[searchSportIdx].categories[self.searchCategories[searchSportIdx].categories.length - 1].leagues.push(Object.assign({}, league))
                      }
                      else{     //update
                        self.searchCategories[searchSportIdx].categories[searchCategoryIdx].leagues.push(Object.assign({}, league))
                      }
                    }
                  }
                })
              }
            })
          }
        })
      }
      // console.log(this.searchCategories)
    },
    favouriteSelect(item2, item1, item){
      var favouriteAry = []
      if(localStorage.prematchFavouriteAry != undefined && localStorage.prematchFavouriteAry.length > 0)
        favouriteAry = JSON.parse(localStorage.prematchFavouriteAry)
      var hasIdx = -1
      for(var i=0; i<=favouriteAry.length-1; i++){
        if(favouriteAry[i].leagueID == item2.leagueID && favouriteAry[i].categoryID == item1.categoryID && favouriteAry[i].sportID == item.sportID){
          hasIdx = i
          break
        }
      }
      if(hasIdx == -1){
        favouriteAry.push({
          leagueID: item2.leagueID,
          categoryID: item1.categoryID,
          categoryAlias: item1.categoryAlias,
          sportID: item.sportID,
          leagueName: item2.leagueName,
          total: item2.total,
          checked: "off",
        })
      }
      else{
        favouriteAry.splice(hasIdx, 1)
      }
      localStorage.prematchFavouriteAry = JSON.stringify(favouriteAry)
      this.$root.$emit('prematchFavouriteSelected')
      this.searchCategories = this.searchCategories.map(category => {return category})
    },
    is_favourite(leagueID, categoryID, sportID){
      if(localStorage.prematchFavouriteAry == undefined || localStorage.prematchFavouriteAry.length == 0)
        return false
      var favouriteAry = JSON.parse(localStorage.prematchFavouriteAry)
      if(favouriteAry != undefined && favouriteAry.length > 0){
        for(var i = 0; i < favouriteAry.length; i ++){
          if(favouriteAry[i].sportID == sportID && favouriteAry[i].categoryID == categoryID && favouriteAry[i].leagueID == leagueID){
            return true
          }
        }
      }
      return false
    },
    refreshCategories(){
      // this.treeItems = {}
      // this.sportids = []
      // this.categoryids = []
      // this.leagueids = []
      this.searchCategories = this.searchCategories.map(category => {return category})
    }
  },
  mounted() {
    this.getSportCategories();

    this.$root.$on('timeFilterEvent', (payload) => {
      if(payload.timeFilter == '0')
        this.timeFilter = ""
      else
        this.timeFilter = (6 * Math.pow(2, payload.timeFilter-1)) * 60 * 60
      // console.log(this.timeFilter)
      this.getSportCategories()
    })
    this.$root.$on('searchSportItem', (payload) => {
        this.searchStr = payload.searchStr
      // console.log(this.timeFilter)
      this.searchFilterCategories()
    })
    var self = this
    this.$root.$on('clearSportItems', function(){
      self.clearItems()
    })
    this.$root.$on('removeFavourite', function(){
      self.refreshCategories()
    })
  }
};
</script>
