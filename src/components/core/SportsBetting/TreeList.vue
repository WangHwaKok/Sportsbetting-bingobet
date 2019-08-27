<template>
  <v-layout>
    <v-expansion-panel dark v-model="categoryPanel" expand>
      <v-expansion-panel-content class=""
        v-for="(sport,i) in sportCategories"
        :key="i"
      >
        <template v-slot:header>
          <div class="d-flex justify-start align-center"> 
            <div class="mr-2" style="color:white" :class="`sport-title-icon ds-sport-icon ds-icon-${sport.sportID}`"></div>
            <div class="caption font-weight-regular" style="width:100%;color:white">{{ sport.sportName }}</div>
          </div>
        </template>
        <v-expansion-panel-content v-for="(category, categoryIdx) in sport.categories" :key="categoryIdx">
          <template v-slot:header>
            <div class="d-flex justify-start align-center pl-2">
              <img style="margin-right:5px;" :src="`/img/country_flag/${category.categoryAlias}.png`" />
              <div class="caption font-weight-regular" style="width:100%;color:white">{{ category.categoryName }}</div>
            </div>
          </template>
          <div v-for="(league, leagueIdx) in category.leagues" :key="leagueIdx" 
            :class="`league-category ${isSelected(sport.sportID, category.categoryID, league.leagueID) ? 'selected' : ''}`"
            @click="selectLeague(sport.sportID, category.categoryID, league.leagueID)">
            <div :class="`league-category-item caption font-weight-medium pa-2 pl-4 pr-4 ${isSelected(sport.sportID, category.categoryID, league.leagueID) ? 'selected' : ''}`" >
              {{league.leagueName}}
            </div>
            <v-divider></v-divider>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-layout>
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
      categoryPanel:[],
      sportID: '',
      categoryID: '',
      leagueID: '',
      timeFilter: '',
      sportids: [],
      categoryids: [],
      leagueids: [],
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
        })
        .catch(e => {
          console.log(e);
        });
    },
    isSelected(sportID, categoryID, leagueID){
      if(this.sportID == sportID && this.categoryID == categoryID && this.leagueID == leagueID){
        return true
      }
      return false
    },
    selectLeague(sportID, categoryID, leagueID){
      this.sportID = sportID
      this.categoryID = categoryID
      this.leagueID = leagueID

      this.sportids = []
      this.categoryids = []
      this.leagueids = []
      this.sportids.push(sportID)
      this.categoryids.push(categoryID)
      this.leagueids.push(leagueID)

      this.$root.$emit('selectLeftMenu', {
        sportids:this.sportids,
        categoryids:this.categoryids,
        leagueids:this.leagueids,
      })
    },
  },
  mounted() {
    this.getSportCategories();
  }
};
</script>
