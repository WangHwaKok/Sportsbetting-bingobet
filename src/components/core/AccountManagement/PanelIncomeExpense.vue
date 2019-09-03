<template>
  <v-card id="p_mybets" class="ma-0 pa-0 card-account">
    <v-card-title>
      <div class="subheading font-weight-medium">
        {{$t('AccountPage.income_expense')}}
      </div>
    </v-card-title>
    <v-card-text>
      <v-layout column>
        <!-- <v-layout row class="mb-4 mt-2">
          <v-flex xs3 class="mr-5">
            <v-layout row class="pb-2 mb-2" style="border-bottom: 4px solid blue"
            >
              <v-flex xs8 class="text-xs-center">{{$t('AccountPage.amount_played')}}</v-flex>
              <v-flex xs4 class="text-xs-center">{{amount_played}}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3 class="mr-5">
            <v-layout row class="pb-2 mb-2" style="border-bottom: 4px solid lawngreen">
              <v-flex xs8 class="text-xs-center">{{$t('AccountPage.winner_amount')}}</v-flex>
              <v-flex xs4 class="text-xs-center">{{winner_amount}}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3 class="mr-5">
            <v-layout row class="pb-2 mb-2" style="border-bottom: 4px solid red">
              <v-flex xs8 class="text-xs-center">{{$t('AccountPage.losing_amount')}}</v-flex>
              <v-flex xs4 class="text-xs-center">{{losing_amount}}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3 class="mr-5">
            <v-layout row class="pb-2 mb-2" style="border-bottom: 4px solid yellow">
              <v-flex xs8 class="text-xs-center">{{$t('AccountPage.pending_amount')}}</v-flex>
              <v-flex xs4 class="text-xs-center">{{pending_amount}}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3 class="mr-5">
            <v-layout row class="pb-2 mb-2" style="border-bottom: 4px solid #00ffdc">
              <v-flex xs8 class="text-xs-center">{{$t('AccountPage.difference_amount')}}</v-flex>
              <v-flex xs4 class="text-xs-center">{{difference_amount}}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3 class="mr-5">
            <v-layout row class="pb-2 mb-2" style="border-bottom: 4px solid #ff9900">
              <v-flex xs8 class="text-xs-center">{{$t('AccountPage.commission_amount')}}</v-flex>
              <v-flex xs4 class="text-xs-center">{{commission_amount}}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout> -->
        <v-layout row>
          <v-flex xs2>
            <v-autocomplete
              v-model="filter_userid"
              :items="items_filter_username"
              autocomplete
              :label='$t("AccountPage.user_name")'
            ></v-autocomplete>
          </v-flex>
          <v-flex xs2 class="pl-2 pr-2">
            <v-menu
              v-model="menu1"
              ref="menu1"
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
              <v-date-picker light no-title v-model="start_date" @input="menu1 = false" :locale="calendarLanguage"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs2 class="pl-2 pr-2">
            <v-menu
              v-model="menu2"
              ref="menu2"
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
              <v-date-picker v-model="end_date" light no-title @input="menu2 = false" :locale="calendarLanguage"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-btn light @click="getIncomeOutcomeList">{{$t('AccountPage.accounts')}}</v-btn>
        </v-layout>
        <v-card>
          <v-card-title style="background:#101010" class="pa-2">
            <div class="subheading" style="color:#e09007">{{start_date}} - {{end_date}}</div>
          </v-card-title>
          <v-card-text style="background:#101010;height:calc(100vh - 425px);" class="scroll-y fill-height pa-2">
            <v-layout column v-scroll:#main-scroll="onMainScrollPos" class="account-table">
              <v-data-table
                light
                :headers="headers"
                :items="incomeOutcomeList"
                :loading="is_updating_page"
                class="table-mybets"
                style="width: 100%;"
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
                  <td>{{ props.item.username }}</td>
                  <td>
                    <span style="color: blue">{{ props.item.played }}</span>
                  </td>
                  <td>
                    <span style="color: lawngreen">{{ props.item.won }}</span>
                  </td>
                  <td>
                    <span style="color: red">{{ props.item.lost }}</span>
                  </td>
                  <td>
                    <span style="color: #bbbb02">{{ props.item.pending }}</span>
                  </td>
                  <td>
                    <span style="color: #00ffdc">{{ props.item.difference }}</span>
                  </td>
                  <td>
                    <span style="color: #ff9900">{{ props.item.commission }}</span>
                  </td>
                </template>
              </v-data-table>
              <v-card class="mt-4">
                <v-card-title style="background:#e09007" class="pa-2">
                  <div class="subheading font-weight-medium" style="color:black">{{$t('AccountPage.graphical_analysis_of_slip')}}</div>
                </v-card-title>
                <v-card-text style="background:white">
                  <material-chart v-if="chartLoad" :chartdata="chartData"></material-chart>
                  <!-- <material-chart></material-chart> -->
                </v-card-text>
              </v-card>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-layout>
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
      headers: [
        { text: this.$t('AccountPage.user_name'), value: 'user_name', align: 'left' },
        { text: this.$t('AccountPage.amount_played'), value: 'winner_amount', align: 'left' },
        { text: this.$t('AccountPage.winner_amount'), value: 'winner_amount', align: 'left' },
        { text: this.$t('AccountPage.losing_amount'), value: 'losing_amount', align: 'left' },
        { text: this.$t('AccountPage.pending_amount'), value: 'pending_amount', align: 'left' },
        { text: this.$t('AccountPage.difference_amount'), value: 'difference_amount', align: 'left' },
        { text: this.$t('AccountPage.commission_amount'), value: 'commission_amount', align: 'left' },
      ],
      amount_played:0,
      winner_amount:0,
      losing_amount:0,
      pending_amount:0,
      difference_amount:0,
      commission_amount:0,
      start_date: moment(new Date()).subtract(1, 'years').format("YYYY-MM-DD"),
      end_date: moment(new Date()).format("YYYY-MM-DD"),
      items_filter_username:[],
      filter_userid:'',

      items_bulletin_type:['All', 'Live', 'Prematch'],
      bulletin_type:'All',

      is_updating_page: false,
      incomeOutcomeList: [],

      color_type:'',
      snackbar: false,
      alertMessage: '',
      calendarLanguageList:{
        'en': 'en-US',
        'tr': 'tr-TR',
      },
      calendarLanguage: 'en-US',
      chartData: {},
      chartLoad: false,
    }
  },
  methods:{
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
    },
    getIncomeOutcomeList(){
        this.is_updating_page = true;
        this.chartLoad = false;
        this.axios.post("zt_income_outcome",
            {
                startDate: this.computedStartDateFormatted,
                endDate: this.computedEndDateFormatted,
                /*
                query:{
                    bulletin: this.bulletin_type,
                    couponType: this.CouponType,
                    couponID: this.CouponID,
                    couponStatus: this.couponResult,
                    userID: this.filter_userid
                },
                */
            },
            {
                headers: {
                    "X-localization": this.$store.getters.getLanguage,
                    "Authorization": 'Bearer ' + localStorage.betic_storage
                }
            }).then(response => {
            if (response.data.success == undefined){
                console.log("get income-outcome list Error");
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

            this.incomeOutcomeList = [];
            Object.keys(response.data.success.data.userList).forEach((key, i) => {
                this.incomeOutcomeList.push(response.data.success.data.userList[key]);
            });

            this.amount_played = response.data.success.data.total.played;
            this.winner_amount = response.data.success.data.total.won;
            this.losing_amount = response.data.success.data.total.lost;
            this.pending_amount = response.data.success.data.total.pending;
            this.difference_amount = response.data.success.data.total.difference;
            this.commission_amount = response.data.success.data.total.commission;
            
            this.amount_played = parseFloat(this.amount_played.replace(' TRY', ''))
            this.winner_amount = parseFloat(this.winner_amount.replace(' TRY', ''))
            this.losing_amount = parseFloat(this.losing_amount.replace(' TRY', ''))
            this.pending_amount = parseFloat(this.pending_amount.replace(' TRY', ''))
            this.difference_amount = parseFloat(this.difference_amount.replace(' TRY', ''))
            this.commission_amount = parseFloat(this.commission_amount.replace(' TRY', ''))

            this.chartData.datasets = []
            this.chartData.labels = []
            this.chartData.labels = [
              this.$t('AccountPage.amount_played'),
              this.$t('AccountPage.winner_amount'),
              this.$t('AccountPage.losing_amount'),
              this.$t('AccountPage.pending_amount'),
              this.$t('AccountPage.difference_amount'),
              this.$t('AccountPage.commission_amount'),
            ]
            this.chartData.datasets = [{
              label: 'Amount',
              backgroundColor: ["#0000FF", "#7CFC00", "#FF0000", "#FFFF00", "#00FFDC", "#FF9900"],
              // backgroundColor: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
              data: [this.amount_played, this.winner_amount, this.losing_amount, this.pending_amount, this.difference_amount, this.commission_amount]
              // data:[1, 2, 3, 4, 5, 6]
              // data: [2478, 5267, 734, 784, 433, 4563]
            }]
            // console.log(this.chartData)
            this.is_updating_page = false;
            this.chartLoad = true;
        }).catch(e => {
            console.log(e);
            this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))
            this.is_updating_page = false;
        });
    },
    showNotify(type, msg){
      this.color_type = type
      this.alertMessage = msg
      this.snackbar = true
    },
    onMainScrollPos(e){
      // console.log('yes')
      // console.log(e.target.scrollTop, e.target.scrollHeight, e.target.offsetHeight)
      // let scrollBottom = e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight
      // if(scrollBottom){
      //   if(this.is_updating_page == true || this.is_last_page == true){
      //     return
      //   }

      //   // console.log(this.pageNumber)
      //   this.getAccountActivityList()
      // }

    },
  },
  computed: {
      computedStartDateFormatted () {
          return this.formatDate(this.start_date)
      },
      computedEndDateFormatted () {
          return this.formatDate(this.end_date)
      }
  },
  created(){
    window.addEventListener('scroll', this.onMainScrollPos);
  },
  mounted(){
    this.getIncomeOutcomeList()
    this.calendarLanguage = this.calendarLanguageList[this.$store.getters.getLanguage]
  },
}
</script>

<style scoped></style>
