<template>
  <v-container id="p_mybets" fluid class="ma-0">
    <v-layout row class="mb-4 mt-2">
      <v-flex xs3 class="mr-5">
        <v-layout row class="pb-2" style="border-bottom: 4px solid lawngreen">
          <v-flex xs8 class="text-xs-center">{{$t('AccountPage.winner_coupons')}}</v-flex>
          <v-flex xs4 class="text-xs-center">{{winner_coupons}}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs3 class="mr-5">
        <v-layout row class="pb-2" style="border-bottom: 4px solid red">
          <v-flex xs8 class="text-xs-center">{{$t('AccountPage.losing_coupons')}}</v-flex>
          <v-flex xs4 class="text-xs-center">{{losing_coupons}}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs3 class="mr-5">
        <v-layout row class="pb-2" style="border-bottom: 4px solid yellow">
          <v-flex xs8 class="text-xs-center">{{$t('AccountPage.pending_coupons')}}</v-flex>
          <v-flex xs4 class="text-xs-center">{{pending_coupons}}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs3 class="pr-3">
        <v-layout row class="pb-2" style="border-bottom: 4px solid blue">
          <v-flex xs8 class="text-xs-center">{{$t('AccountPage.returned_coupons')}}</v-flex>
          <v-flex xs4 class="text-xs-center">{{returned_coupons}}</v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex v-if="this.$store.getters.getRole == 'supplier'">
        <v-autocomplete
          v-model="filter_userid"
          :search-input.sync="filter_username_input"
          :items="items_filter_username"
          item-text="username"
          item-value="userID"
          :loading="isLoadingUserFilter"
          :label='$t("AccountPage.user_name")'
        ></v-autocomplete>
      </v-flex>
      <v-flex class="pl-2 pr-2">
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="computedStartDateFormatted"
              :label='$t("AccountPage.starting_date")'
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="start_date" @input="menu1 = false" :locale="calendarLanguage" ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex class="pl-2 pr-2">
        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="computedEndDateFormatted"
              :label='$t("AccountPage.date_of_completion")'
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="end_date" @input="menu2 = false" :locale="calendarLanguage"></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex class="pr-2">
        <v-autocomplete
          v-model="couponType"
          :items="items_couponType"
          item-text = 'text'
          item-value="value"
          autocomplete
          :label='$t("AccountPage.coupon_type")'
        ></v-autocomplete>
      </v-flex>
      <v-flex class="pr-2">
        <v-text-field :label='$t("AccountPage.coupon_id")' v-model="couponID"></v-text-field>
      </v-flex>
      <v-flex class="pr-2">
        <v-autocomplete
          v-model="couponResult"
          :items="items_couponResult"
          item-text = 'text'
          item-value="value"
          autocomplete
          :label='$t("AccountPage.coupon_result")'
        ></v-autocomplete>
      </v-flex>
      <v-flex class="pr-2">
        <v-autocomplete
          v-model="bulletin_type"
          :items="items_bulletin_type"
          item-text = 'text'
          item-value="value"
          autocomplete
          :label='$t("AccountPage.bulletin_type")'
        ></v-autocomplete>
      </v-flex>
      <v-flex class="pr-3">
      <v-btn color="primary" @click="getBetsHistory(1)">Get List</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row class=" scroll-y fill-height account-table" id="main-scroll">
      <v-flex v-scroll:#main-scroll="onMainScrollPos">
        <v-data-table
          :headers="headers"
          :items="couponList"
          :loading="is_updating_page"
          class="table-mybets"
          style="width: 100%;"
          hide-actions
        >
          <v-progress-linear v-slot:progress color="green" indeterminate></v-progress-linear>
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="(header, id) in props.headers"
                :key="id"
                :class="`text-xs-${header.align}`"
                :width="header.width">
                {{header.text}}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr :style="'color:'+trColors[props.item.couponResultAlias][1]+';background:#'+trColors[props.item.couponResultAlias][0]">
              <td style="text-align:center">{{ props.item.couponID }}</td>
              <td>{{ props.item.username }}</td>
              <td>{{ props.item.created_at | moment("DD/MM/YYYY HH:mm") }}</td>
              <td>{{ props.item.complete }}</td>
              <td>{{ props.item.amount }}</td>
              <td>{{ props.item.totalRate }}</td>
              <td>{{ props.item.potentialReturns }}</td>
              <td>{{ props.item.type }}</td>
              <td>
                <v-chip label v-if="props.item.couponResultAlias == 'W'" color="green">{{ props.item.couponResult }}</v-chip>
                <v-chip label v-else-if="props.item.couponResultAlias == 'L'" color="red">{{ props.item.couponResult }}</v-chip>
                <v-chip label v-else-if="props.item.couponResultAlias == 'P'" color="grey" style="color:black">{{ props.item.couponResult }}</v-chip>
                <v-chip label v-else-if="props.item.couponResultAlias == 'C'" color="grey">{{ props.item.couponResult }}</v-chip>
              </td>
              <td>
                <v-layout justify-center align-center v-if="props.item.couponResultAlias == 'P'">
                  <v-btn flat icon class="ma-0" style="padding:0px;color:black;">
                    <v-icon medium @click="show_detail(props.item.couponID)">mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn flat icon class="ma-0" style="padding:0px;color:black;">
                    <v-icon medium>mdi-printer-settings</v-icon>
                  </v-btn>
                  <v-btn style="padding:0px;color:black;"
                    v-if="props.item.isCancelable != undefined && props.item.isCancelable == true"
                    flat
                    icon
                    color="error"
                    class="ma-0"
                    @click.stop="DeleteDlg(props.item.username, props.item.couponID)"
                  >
                    <v-icon medium>mdi-close</v-icon>
                  </v-btn>
                </v-layout>
                <v-layout justify-center align-center v-else>
                  <v-btn flat icon class="ma-0" style="padding:0px;">
                    <v-icon medium @click="show_detail(props.item.couponID)">mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn flat icon class="ma-0" style="padding:0px;">
                    <v-icon medium>mdi-printer-settings</v-icon>
                  </v-btn>
                  <v-btn style="padding:0px;"
                    v-if="props.item.isCancelable != undefined && props.item.isCancelable == true"
                    flat
                    icon
                    color="error"
                    class="ma-0"
                    @click.stop="DeleteDlg(props.item.username, props.item.couponID)"
                  >
                    <v-icon medium>mdi-close</v-icon>
                  </v-btn>
                </v-layout>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-dialog v-model="showDialog">
      <v-card>
        <v-card-title class="headline">
          <div class="subheading mr-4">{{$t('AccountPage.coupon_code')}}: {{bet_detail.couponID}}</div>
          <div class="subheading mr-4">{{$t('AccountPage.amount')}}: {{bet_detail.amount}}</div>
          <div class="subheading mr-4">{{$t('AccountPage.possible_winnings')}}: {{bet_detail.potentialReturns}}</div>
          <div class="subheading mr-4">{{$t('AccountPage.winnings')}}: {{bet_detail.earnedAmount}}</div>
          <div class="subheading">{{$t('AccountPage.type')}}: {{bet_detail.type}}({{getCombinationString(bet_detail.selectedCombinations)}})</div>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="showDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="combinationHeaders"
            :items="bet_detail.combinations"
            class="elevation-1"
            :expand="true"
            item-key="combinationID"
            hide-actions
          >
            <template v-slot:items="props">
              <tr>
                <td>{{props.item.complete}}</td>
                <td>{{ props.item.amount }}</td>
                <td>{{ props.item.rate }}</td>
                <td>{{ props.item.gain }}</td>
                <td class="text-xs-center">{{ props.item.combinationResult }}</td>
                <td class="text-xs-center">
                  <v-btn color="primary" @click="props.expanded = !props.expanded">
                    <v-icon color="white">mdi-eye</v-icon>
                  </v-btn>
                </td>
              </tr>

            </template>
            <template v-slot:expand="props1">
              <v-card style="border-radius:0px;">
                <v-data-table
                  :headers="detailHeaders"
                  :items="props1.item.odds"
                  class="elevation-1"
                  hide-actions
                >
                  <template slot="headers" slot-scope="props">
                    <tr style="background:#171717">
                      <th
                        v-for="(header, id) in props.headers"
                        :key="id"
                        :class="`text-xs-${header.align}`"
                      >
                      {{header.text}}
                      </th>
                    </tr>
                  </template>
                  <template v-slot:items="props">
                    <tr style="background:green">
                      <td>
                        <v-layout>
                        <div v-if="props.item.eventState != undefined && props.item.eventState == 'live'" class="coupon-live" style="position: relative;">{{$t('Betting.live')}}</div>
                        {{ props.item.league }}
                        </v-layout>
                      </td>
                      <td>{{ props.item.eventDate }}</td>
                      <td>{{ props.item.liveGamePeriod}} {{props.item.liveMinute}}</td>
                      <td>{{ props.item.homeTeam }} - {{props.item.awayTeam}}</td>
                      <td>{{ props.item.liveScoreHome }} : {{props.item.liveScoreAway}}</td>
                      <td>{{ props.item.oddValue }}</td>
                      <td>{{ props.item.oddTypeName }}</td>
                      <td>{{ props.item.oddName }}</td>
                      <td>
                        <div v-if="props.item.oddResultAlias == 'W'">{{ props.item.finalScoreHome }} - {{props.item.finalScoreAway}}/{{ props.item.oddResult }}</div>
                        <div v-else-if="props.item.oddResultAlias == 'L'">{{ props.item.finalScoreHome }} - {{props.item.finalScoreAway}}/{{ props.item.oddResult }}</div>
                        <div v-else-if="props.item.oddResultAlias == 'P'">{{ props.item.finalScoreHome }} - {{props.item.finalScoreAway}}/{{ props.item.oddResult }}</div>
                        <div v-else-if="props.item.oddResultAlias == 'C'">{{ props.item.finalScoreHome }} - {{props.item.finalScoreAway}}/{{ props.item.oddResult }}</div>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card>
            </template>
          </v-data-table>
          <!-- <v-data-table
            :headers="detailHeaders"
            :items="bet_detail.combinations"
            class="elevation-1"
            hide-actions
          >
            <template v-slot:items="props">
              <template v-for="odd in props.item.odds">
                <tr>
                  <td>
                    <v-layout>
                    <div v-if="odd.eventState != undefined && odd.eventState == 'live'" class="coupon-live" style="position: relative;">{{$t('Betting.live')}}</div>
                    {{ odd.league }}
                    </v-layout>
                  </td>
                  <td>{{ odd.eventDate }}</td>
                  <td>{{ odd.liveGamePeriod}} {{odd.liveMinute}}</td>
                  <td>{{ odd.homeTeam }} - {{odd.awayTeam}}</td>
                  <td>{{ odd.liveScoreHome }} : {{odd.liveScoreAway}}</td>
                  <td>{{ odd.oddValue }}</td>
                  <td>{{ odd.oddTypeName }}</td>
                  <td>{{ odd.oddName }}</td>
                  <td>
                    <div v-if="odd.oddResultAlias == 'W'" style="color:lawngreen">{{ odd.finalScoreHome }} - {{odd.finalScoreAway}}/{{ odd.oddResult }}</div>
                    <div v-else-if="odd.oddResultAlias == 'L'" style="color:red">{{ odd.finalScoreHome }} - {{odd.finalScoreAway}}/{{ odd.oddResult }}</div>
                    <div v-else-if="odd.oddResultAlias == 'P'" style="color:yellow">{{ odd.finalScoreHome }} - {{odd.finalScoreAway}}/{{ odd.oddResult }}</div>
                    <div v-else-if="odd.oddResultAlias == 'C'" style="color:blue">{{ odd.finalScoreHome }} - {{odd.finalScoreAway}}/{{ odd.oddResult }}</div>
                  </td>
                </tr>
              </template>

            </template>
          </v-data-table> -->
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_delete_coupon" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{$t('Betting.cancel_coupon')}}</v-card-title>
        <v-card-text>The user <strong class="title error--text">{{current_username}}</strong>'s coupon {{current_couponID}} will be cancelled.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.stop="dialog_delete_coupon = false">{{$t('Common.no')}}</v-btn>
          <v-btn color="green darken-1" flat
                  :disabled="is_processing"
                  @click.stop="cancel_coupon">{{$t('Common.yes')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :color="color_type"
      :bottom=false
      :top=true
      :left=false
      :right=true
      v-model="snackbar"
      dark
    >
      <!-- <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon> -->
      <div>{{alertMessage}}</div>
      <v-icon
        size="16"
        @click="snackbar = false"
      >
        mdi-close-circle
      </v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
import moment from 'moment-timezone'
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      menu1: false,
      menu2: false,
      items: [],
      headers: [
        { text: this.$t('AccountPage.coupon_code'), value: 'coupon_code', align: 'center', width:'10%' },
        { text: this.$t('AccountPage.user_name'), value: 'user_name', align: 'left', width:'10%' },
        { text: this.$t('AccountPage.date_time'), value: 'date_time', align: 'left', width:'10%' },
        { text: this.$t('AccountPage.complete'), value: 'complete', align: 'left', width:'10%' },
        { text: this.$t('Betting.amount'), value: 'amount', align: 'left', width:'5%' },
        { text: this.$t('Betting.rate'), value: 'rate', align: 'left', width:'5%' },
        { text: this.$t('Betting.potential_returns'), value: 'potential_returns', align: 'left', width:'10%' },
        { text: this.$t('AccountPage.type'), value: 'type', align: 'left', width:'10%' },
        { text: this.$t('AccountPage.status'), value: 'status', align: 'left', width:'10%' },
        { text: this.$t('AccountPage.action'), value: 'action', align: 'center', width:'*' }
      ],
      combinationHeaders:[
        { text: this.$t('AccountPage.combination'), value: 'combination', align: 'left' },
        { text: this.$t('AccountPage.amount'), value: 'amount', align: 'left' },
        { text: this.$t('AccountPage.rate'), value: 'rate', align: 'left' },
        { text: this.$t('AccountPage.gain'), value: 'gain', align: 'left' },
        { text: this.$t('AccountPage.combination_status'), value: 'combination_status', align: 'center' },
        { text: this.$t('AccountPage.show_system_columns'), value: 'show_system_columns', align: 'center' },
      ],
      detailHeaders: [
        { text: this.$t('AccountPage.league'), value: 'leagueName', align: 'left' },
        { text: this.$t('AccountPage.event_date'), value: 'eventDate', align: 'left' },
        { text: this.$t('AccountPage.period_time'), value: 'periodTime', align: 'left' },
        { text: this.$t('AccountPage.team_name'), value: 'teamName', align: 'left' },
        { text: this.$t('AccountPage.current_score'), value: 'currentScore', align: 'left' },
        { text: this.$t('AccountPage.odd_value'), value: 'oddValue', align: 'left' },
        { text: this.$t('AccountPage.odd_type'), value: 'oddTypeName', align: 'left' },
        { text: this.$t('AccountPage.odd'), value: 'oddName', align: 'left' },
        { text: this.$t('AccountPage.result'), value: 'result', align: 'left' },
      ],

      trColors:{
        'W': ['2e5f2e', 'white'],
        'L': ['753030', 'white'],
        'P': ['e5e2da', 'black'],
        'C': ['5c5c5b', 'white']
      },
      start_date: moment(new Date()).subtract(1, 'days').format("YYYY-MM-DD"),
      end_date: moment(new Date()).format("YYYY-MM-DD"),
      color_type:'',
      snackbar: false,
      alertMessage: '',
      is_updating_page: false,
      is_last_page: false,
      page: 0,
      winner_coupons:0,
      losing_coupons:0,
      pending_coupons:0,
      returned_coupons:0,
      items_couponResult: [],
      couponResult:'',
      filter_username_input:'',
      couponID:'',

      items_filter_username:[],
      filter_userid:'',

      items_bulletin_type:[],
      bulletin_type:'',

      items_couponType: [],
      couponType:'',
      couponList: [],

      bet_detail:{},
      showDialog: false,
      isLoadingUserFilter: false,
      calendarLanguageList:{
        'en': 'en-US',
        'tr': 'tr-TR',
      },
      calendarLanguage: 'en-US',
      dialog_delete_coupon:false,
      current_username: '',
      current_couponID: 0,
      is_processing:false,
    }
  },
  methods:{
    refresh_parameters(){
      if(this.$store.getters.getParameters == undefined || Object.keys(this.$store.getters.getParameters).length == 0)
        return
      var couponType_params = (this.$store.getters.getParameters).couponTypes;
      this.items_couponType = [{
        text:'',
        value:''
      }];
      Object.keys(couponType_params).forEach((key, i)=>{
        this.items_couponType.push({
          text: couponType_params[key],
          value: key
        });
      });

      var couponResult_params = (this.$store.getters.getParameters).couponStatus;
      this.items_couponResult = [{
        text:'',
        value:''
      }];
      Object.keys(couponResult_params).forEach((key, i)=>{
        this.items_couponResult.push({
          text: couponResult_params[key],
          value: key
        });
      });


      var bulletinType_params = (this.$store.getters.getParameters).bulletinTypes;
      this.items_bulletin_type = [{
        text:'',
        value:''
      }];
      Object.keys(bulletinType_params).forEach((key, i)=>{
        this.items_bulletin_type.push({
          text: bulletinType_params[key],
          value: key
        });
      });
    },
    getCurrentUserFilterList(input){
      if(this.isLoadingUserFilter)
        return;
      this.isLoadingUserFilter = true;
      this.axios.post("zt_supplier_search_user",
              {
                query: input,
              },
              {
                headers: {
                  "X-localization": this.$store.getters.getLanguage,
                  "Authorization": 'Bearer ' + localStorage.betic_storage
                }
              }).then(response => {
        this.isLoadingUserFilter = false;
        this.items_filter_username = [];
        if (response.data.success == undefined){
          return;
        }

        this.items_filter_username = response.data.success.data;
      }).catch(e => {
        this.isLoadingUserFilter = false;
        console.log(e);
        this.$notify({
          group: 'api_error',
          type: 'error',
          title: this.$t('Common.Error'),
          text: this.$t('Common.server_is_unavailable_now')
        });
      });
    },
    getBetsHistory(refresh= 0){
      if(refresh){
        this.page = 0
        this.is_updating_page = false
        this.is_last_page = false
      }
        this.is_updating_page = true;

        this.drawer = false;

        this.axios.post("zt_coupon_list",
          {
              startDate: this.computedStartDateFormatted,
              endDate: this.computedEndDateFormatted,
              bulletin: this.bulletin_type,
              couponType: this.couponType,
              couponID: this.couponID,
              couponStatus: this.couponResult,
              userID: this.filter_userid,
              query: this.filter_userid?this.filter_userid.username: ''
          },
          {
              headers: {
                  "X-localization": this.$store.getters.getLanguage,
                  "Authorization": 'Bearer ' + localStorage.betic_storage
              }
          }).then(response => {
          if (response.data.success == undefined){
              console.log("get coupon list Error");
              this.is_updating_page = false;
              if(response.data.errors)
              {
                  console.log("Error");
                  var msg = "";
                  Object.keys(response.data.errors).forEach(function(key, i){
                      if(!(response.data.errors[key] instanceof Array)){
                          msg += response.data.errors[key] + " ";
                      }else{
                          response.data.errors[key].forEach(function(item, j){
                              msg += item + " ";
                          });
                      }
                  });
                  this.showNotify('error', msg)
              }
              return;
          }

          this.couponList = response.data.success.data;

          this.winner_coupons = 0;
          this.losing_coupons = 0;
          this.pending_coupons = 0;
          this.returned_coupons = 0;

          this.couponList.forEach((item)=>{
              if(item.couponResult == 'Won'){
                  ++this.winner_coupons;
              }
              if(item.couponResult == 'Lost'){
                  ++this.losing_coupons;
              }
              if(item.couponResult == 'Waiting'){
                  ++this.pending_coupons;
              }
              if(item.couponResult == 'Refunded'){
                  ++this.returned_coupons;
              }
              if(item.couponResult == 'Canceled'){
                  ++this.returned_coupons;
              }
          });

          this.is_updating_page = false;
      }).catch(e => {
          console.log(e);
          this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))

          this.is_updating_page = false;
      });
    },
    show_detail(couponID){
      this.bet_detail = {};
      this.axios.post("zt_coupon_detail",
          {
              couponID: couponID
          },
          {
              headers: {
                  "X-localization": this.$store.getters.getLanguage,
                  "Authorization": 'Bearer ' + localStorage.betic_storage
              }
          }).then(response => {
          if (response.data.success == undefined){
              console.log("get coupon list Error");
              if(response.data.errors)
              {
                  console.log("Error");
                  var msg = "";
                  Object.keys(response.data.errors).forEach(function(key, i){
                      if(!(response.data.errors[key] instanceof Array)){
                          msg += response.data.errors[key] + " ";
                      }else{
                          response.data.errors[key].forEach(function(item, j){
                              msg += item + " ";
                          });
                      }
                  });
                this.showNotify('error', msg)
              }
              return;
          }

          this.bet_detail = response.data.success.data;
          this.showDialog = true
          // console.log(this.bet_detail)

      }).catch(e => {
          console.log(e);
          this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))
      });
    },
    DeleteDlg(userName, couponID){
      this.current_couponID = couponID;
      this.current_username = userName;
      this.dialog_delete_coupon=true;
    },
    cancel_coupon(){
      if(this.current_couponID == 0)
      {
        this.dialog_delete_coupon = false;
        return;
      }

      this.is_processing = true;
      this.axios.post("zt_coupon_cancel",
              {
                couponID: this.current_couponID
              },
              {
                headers: {
                  "X-localization": localStorage.language,
                  "Authorization": 'Bearer ' + localStorage.betic_storage
                }
              }).then(response => {
        if (response.data.success == undefined){
          console.log("get coupon list Error");
          if(response.data.errors)
          {
            console.log("Error");
            var msg = "";
            Object.keys(response.data.errors).forEach(function(key, i){
              if(!(response.data.errors[key] instanceof Array)){
                msg += response.data.errors[key] + " ";
              }else{
                response.data.errors[key].forEach(function(item, j){
                  msg += item + " ";
                });
              }
            });
            this.showNotify('error', msg)
          }
          this.dialog_delete_coupon = false;
          this.is_processing = false;
          return;
        }

        this.showNotify('error', this.$t('AccountPage.coupon_has_been_cancelled_successfully'))

        this.dialog_delete_coupon = false;
        this.is_processing = false;
        this.getBetsHistory()
      }).catch(e => {
        console.log(e);

        this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))

        this.dialog_delete_coupon = false;
        this.is_processing = false;
      });
    },
    showNotify(type, msg){
      this.color_type = type
      this.alertMessage = msg
      this.snackbar = true
    },
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
    },
    getCombinationString(aryVal){
      if(aryVal == undefined || aryVal.length == 0)
        return
      return aryVal.join('-')
    },
    onMainScrollPos(e){
      // console.log('yes')
      // console.log(e.target.scrollTop, e.target.scrollHeight, e.target.offsetHeight)
      let scrollBottom = e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight
      // if(scrollBottom){
      //   if(this.is_updating_page == true || this.is_last_page == true){
      //     return
      //   }

      //   // console.log(this.pageNumber)
      //   this.getBetsHistory()
      // }

    },
  },
  watch:{
    filter_username_input(val){
      this.getCurrentUserFilterList(val);
    }
  },
  computed: {
      computedStartDateFormatted () {
          return this.formatDate(this.start_date)
      },
      computedEndDateFormatted () {
          return this.formatDate(this.end_date)
      }
  },
  mounted(){
    this.getBetsHistory()
    this.refresh_parameters()
    this.$root.$on("update-parameters", ()=>{
      // console.log("yes of course")
      this.refresh_parameters()
    })
    this.calendarLanguage = this.calendarLanguageList[this.$store.getters.getLanguage]

  },
}
</script>
