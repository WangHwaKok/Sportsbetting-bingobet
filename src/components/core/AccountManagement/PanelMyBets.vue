<template>
  <v-card dark id="p_mybets" class="ma-0 pa-0 card-account">
    <v-card-title>
      <div class="subheading font-weight-medium">
        {{$t('AccountPage.my_bets')}}
      </div>
    </v-card-title>
    <v-card-text>
      <v-layout column>
        <div class="body-2" style="color:#e09007">{{$t('AccountPage.please_select_a_date_range')}}</div>
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
              <v-date-picker light v-model="start_date" no-title @input="menu1 = false" :locale="calendarLanguage" ></v-date-picker>
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
              <v-date-picker light v-model="end_date" no-title @input="menu2 = false" :locale="calendarLanguage"></v-date-picker>
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
            <v-autocomplete
              v-model="couponResult"
              :items="items_couponResult"
              item-text = 'text'
              item-value="value"
              autocomplete
              :label='$t("AccountPage.coupon_result")'
            ></v-autocomplete>
          </v-flex>
          <v-flex class="pr-3">
          <v-btn light small @click="getBetsHistory(1)">{{$t('AccountPage.show')}}</v-btn>
          </v-flex>
        </v-layout>
        <v-card>
          <v-card-title style="background:#101010" class="pa-2">
            <div class="subheading" style="color:#e09007">{{start_date}} - {{end_date}} {{$t('AccountPage.bets_in_between')}}</div>
          </v-card-title>
          <v-card-text style="background:#101010" class="pa-2">
            <v-layout row class=" scroll-y fill-height account-table" id="main-scroll" style="height:calc(100vh - 425px);">
              <v-flex v-scroll:#main-scroll="onMainScrollPos">
                <v-data-table
                  light
                  :headers="headers"
                  :items="couponList"
                  :loading="is_updating_page"
                  class="table-mybets"
                  style="width: 100%;"
                  hide-actions
                  item-key="couponID"
                >
                  <v-progress-linear v-slot:progress color="green" indeterminate></v-progress-linear>
                  <template slot="headers" slot-scope="props">
                    <tr style="background:#e09007;height:3.5rem;border:solid 1px #e09007;border-radius:3px !important;">
                      <th
                        v-for="(header, id) in props.headers"
                        :key="id"
                        :class="`text-xs-${header.align}`"
                        :width="header.width">
                        <div class="body-2 font-weight-medium" style="color:black">{{header.text}}</div>
                      </th>
                    </tr>
                  </template>
                  <template v-slot:items="props">
                    <tr @click="show_detail(props.item.couponID, props.expanded = !props.expanded)" style="cursor:pointer;">
                      <td>{{ props.item.username }}</td>
                      <td>{{ props.item.created_at | moment("DD/MM/YYYY HH:mm") }}</td>
                      <td style="text-align:center">{{ props.item.couponID }}</td>
                      <td>{{ props.item.complete }}</td>
                      <td>{{ props.item.amount }}</td>
                      <td>{{ props.item.potentialReturns }}</td>
                      <td>
                        <div v-if="props.item.couponResultAlias == 'W'" style="color:green">{{ props.item.couponResult }}</div>
                        <div v-else-if="props.item.couponResultAlias == 'L'" style="color:red">{{ props.item.couponResult }}</div>
                        <div v-else-if="props.item.couponResultAlias == 'P'" style="color:blue">{{ props.item.couponResult }}</div>
                        <div v-else-if="props.item.couponResultAlias == 'C'" style="color:grey">{{ props.item.couponResult }}</div>
                      </td>
                      <td>
                        <v-btn flat class="ma-0" style="padding:0px;color:yellow;">
                          <!-- <v-icon medium>mdi-printer-settings</v-icon> -->
                          <div style="color:#f8b103">{{$t('AccountPage.print')}}</div>
                        </v-btn>
                        <v-btn style="padding:0px;color:red;"
                          v-if="props.item.isCancelable != undefined && props.item.isCancelable == true"
                          flat
                          icon
                          color="error"
                          class="ma-0"
                          @click.stop="DeleteDlg(props.item.username, props.item.couponID)"
                        >
                          <v-icon medium>mdi-close</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                  <template v-slot:expand="props">
                    <table class="table-detail">
                      <tr style="background:black;">
                        <th width="20%" class="text-xs-left">
                          {{$t('AccountPage.amount')}}
                        </th>
                        <th width="20%" class="text-xs-left">
                          {{$t('AccountPage.rate')}}
                        </th>
                        <th width="20%" class="text-xs-left">
                          {{$t('AccountPage.possible_winnings')}}
                        </th>
                        <th width="20%" class="text-xs-left">
                          {{$t('AccountPage.winnings')}}
                        </th>
                        <th width="*" class="text-xs-left">
                          {{$t('AccountPage.status')}}
                        </th>
                      </tr>
                      <tr>
                        <td>
                          {{props.item.amount}}
                        </td>
                        <td>
                          {{props.item.rate}}
                        </td>
                        <td>
                          {{props.item.potentialReturns}}
                        </td>
                        <td>
                        </td>
                        <td>
                          <div v-if="props.item.couponResultAlias == 'W'" style="color:green">{{ props.item.couponResult }}</div>
                          <div v-else-if="props.item.couponResultAlias == 'L'" style="color:red">{{ props.item.couponResult }}</div>
                          <div v-else-if="props.item.couponResultAlias == 'P'" style="color:blue">{{ props.item.couponResult }}</div>
                          <div v-else-if="props.item.couponResultAlias == 'C'" style="color:grey">{{ props.item.couponResult }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="5" style="padding: 5px !important;">
                          <v-data-table
                            v-if="bet_detail != undefined && bet_detail.combinations != undefined && bet_detail.combinations.length > 0"
                            light 
                            :headers="detailHeaders"
                            :items="bet_detail.combinations"
                            :loading="is_updating_page"
                            class="table-mybets"
                            style="width: 100%;"
                            hide-actions
                          >
                            <template slot="headers" slot-scope="props">
                              <tr style="background:green;height:3.5rem;border:solid 1px #e09007;border-radius:3px !important;">
                                <th
                                  v-for="(header, id) in props.headers"
                                  :key="id"
                                  :class="`text-xs-${header.align}`"
                                  :width="header.width">
                                  <div class="body-2 font-weight-medium" style="color:white">{{header.text}}</div>
                                </th>
                              </tr>
                            </template>
                            <template v-slot:items="props">
                              <template v-for="(odd, oddIdx) in props.item.odds">
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
                                    <div v-if="odd.oddResultAlias == 'W'">{{ odd.finalScoreHome }} - {{odd.finalScoreAway}}/{{ odd.oddResult }}</div>
                                    <div v-else-if="odd.oddResultAlias == 'L'">{{ odd.finalScoreHome }} - {{odd.finalScoreAway}}/{{ odd.oddResult }}</div>
                                    <div v-else-if="odd.oddResultAlias == 'P'">{{ odd.finalScoreHome }} - {{odd.finalScoreAway}}/{{ odd.oddResult }}</div>
                                    <div v-else-if="odd.oddResultAlias == 'C'">{{ odd.finalScoreHome }} - {{odd.finalScoreAway}}/{{ odd.oddResult }}</div>
                                  </td>
                                </tr>
                              </template>

                            </template>
                          </v-data-table>
                        </td>
                      </tr>
                    </table>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-card-text>
  </v-card>
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
        { text: this.$t('AccountPage.user_name'), value: 'user_name', align: 'left', width:'*' },
        { text: this.$t('AccountPage.date_time'), value: 'date_time', align: 'left', width:'20%' },
        { text: this.$t('AccountPage.coupon_code'), value: 'coupon_code', align: 'center', width:'10%' },
        { text: this.$t('AccountPage.complete'), value: 'complete', align: 'left', width:'10%' },
        { text: this.$t('Betting.amount'), value: 'amount', align: 'left', width:'10%' },
        { text: this.$t('Betting.potential_returns'), value: 'potential_returns', align: 'left', width:'10%' },
        { text: this.$t('AccountPage.status'), value: 'status', align: 'left', width:'10%' },
        { text: this.$t('AccountPage.action'), value: 'action', align: 'center', width:'10%' }
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
