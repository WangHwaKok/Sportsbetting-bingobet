<template>
  <v-container id="p_mybets" fluid class="pr-0 ma-0">
    <v-layout row class="mb-4 mt-2">
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
    </v-layout>
    <v-layout row>
      <v-flex xs3>
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
          <v-date-picker v-model="start_date" @input="menu1 = false" :locale="calendarLanguage"></v-date-picker>
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
          <v-date-picker v-model="end_date" @input="menu2 = false" :locale="calendarLanguage"></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs3>
        <v-autocomplete
          v-model="bulletin_type"
          :items="items_bulletin_type"
          autocomplete
          :label='$t("AccountPage.bulletin_type")'
        ></v-autocomplete>
      </v-flex>
      <v-flex xs2 class="pl-3 pr-4">
        <v-btn color="primary" style="width: 100%" @click="getIncomeOutcomeList">{{$t('AccountPage.get_list')}}</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row class="pr-3">
      <v-data-table
        :headers="headers"
        :items="incomeOutcomeList"
        :loading="is_updating_page"
        class="elevation-1"
        style="width: 100%;"
      >
      <v-progress-linear v-slot:progress color="green" indeterminate></v-progress-linear>
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
            <span style="color: yellow">{{ props.item.pending }}</span>
          </td>
          <td>
            <span style="color: #00ffdc">{{ props.item.difference }}</span>
          </td>
          <td>
            <span style="color: #ff9900">{{ props.item.commission }}</span>
          </td>
        </template>
      </v-data-table>
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


            this.is_updating_page = false;
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
    this.getIncomeOutcomeList()
    this.calendarLanguage = this.calendarLanguageList[this.$store.getters.getLanguage]
  },
}
</script>

<style scoped></style>
