<template>
  <v-container id="p_activities" row fluid class="ma-0">
    <v-layout row>
      <v-flex xs2>
        <v-autocomplete
          v-model="filter_userid"
          :search-input.sync="filter_username_input"
          :items="items_filter_username"
          item-text="username"
          item-value="userID"
          :loading="isLoadingUserFilter"
          :label='$t("AccountPage.user_name")'
          return-object
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
          full-width
          min-width="290px"
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
      <v-flex xs2>
        <v-autocomplete
          v-model="transaction_type"
          :items="items_transaction_type"
          item-text = 'text'
          item-value="value"
          autocomplete
          :label='$t("AccountPage.transaction")'
        ></v-autocomplete>
      </v-flex>
      <v-flex xs2 class="pl-3 pr-3">
        <v-btn color="primary" @click="getAccountActivityList(1)">Account History</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row class="scroll-y account-table" id="main-scroll">
      <v-flex v-scroll:#main-scroll="onMainScrollPos">
        <v-data-table
          :headers="headers"
          :items="accountActivityList"
          :loading="is_updating_page"
          class="elevation-1"
          style="width: 100%;"
          hide-actions
        >
          <v-progress-linear v-slot:progress color="green" indeterminate></v-progress-linear>
          <template v-slot:items="props">
            <td>{{ props.item.created_at | moment("DD/MM/YYYY HH:mm") }}</td>
            <td class="text-xs-left">{{ props.item.userName }}</td>
            <td class="text-xs-left">{{ props.item.balance }} {{props.item.currency}}</td>
            <td class="text-xs-left">{{ props.item.previousBalance }} {{props.item.currency}}</td>
            <td class="text-xs-left">{{ props.item.amount }} {{props.item.currency}}</td>
            <td class="text-xs-left">{{ props.item.description }}</td>
            <td class="text-xs-left">{{props.item.isSystemTransaction==true?'(System)':''}}{{ props.item.transaction }}</td>
          </template>
        </v-data-table>
      </v-flex>
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
      date: new Date().toISOString().substr(0, 10),
      menu1: false,
      menu2: false,
      page: 0,
      headers: [
        {
          text: this.$t('AccountPage.date_time'),
          align: 'left',
          sortable: false,
          color: 'success',
          value: 'date_time'
        },
        { text: this.$t('AccountPage.user_name'), value: 'user_name', align: 'left' },
        { text: this.$t('AccountPage.balance'), value: 'cur_balance', align: 'left' },
        { text: this.$t('AccountPage.previous_balance'), value: 'prev_balance', align: 'left' },
        { text: this.$t('Betting.amount'), value: 'amount', align: 'left' },
        { text: this.$t('AccountPage.description'), value: 'note', align: 'left' },
        { text: this.$t('AccountPage.transaction'), value: 'transaction', align: 'left' },
      ],
      accountActivityList: [],
      is_updating_page: false,
      is_last_page: false,
      
      start_date: moment(new Date()).subtract(1, 'years').format("YYYY-MM-DD"),
      end_date: moment(new Date()).format("YYYY-MM-DD"),
      
      items_filter_username:[],
      filter_userid:'',

      items_transaction_type:[{text:'', value:''}],
      transaction_type:'',

      color_type:'',
      snackbar: false,
      alertMessage: '',
      filter_username_input:'',
      isLoadingUserFilter: false,
      calendarLanguageList:{
        'en': 'en-US',
        'tr': 'tr-TR',
      },
      calendarLanguage: 'en-US',
    }
  },
  methods:{
    refresh_parameters(){
      if(this.$store.getters.getParameters == undefined || Object.keys(this.$store.getters.getParameters).length == 0)
        return
      var transaction_params = (this.$store.getters.getParameters).balanceTransactions;
      this.items_transaction_type = [{
          text:'',
          value:''
      }];
      Object.keys(transaction_params).forEach((key, i)=>{
          this.items_transaction_type.push({
              text: transaction_params[key],
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
    getAccountActivityList(refersh = 0){
      if(refersh){
        this.page = 0
        this.is_updating_page = false
        this.is_last_page = false
      }
      this.is_updating_page = true;


      this.axios.post("zt_balance_transactions",
          {
              page: this.page+1,
              startDate: this.computedStartDateFormatted,
              endDate: this.computedEndDateFormatted,
              transaction: this.transaction_type,
              query: this.filter_userid?this.filter_userid.username:''
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
              console.log("get account-activities list Error");
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

          this.page = parseInt(response.data.success.data.page);
          if(response.data.success.data.transactions.length == 0)
            this.is_last_page = true
          if(this.page == 1)
              this.accountActivityList = [];
          this.accountActivityList = [].concat.apply(this.accountActivityList, response.data.success.data.transactions);

          this.is_updating_page = false;
      }).catch(e => {
          console.log(e);
          
          this.is_updating_page = false;
      });
    },
    onMainScrollPos(e){
      // console.log('yes')
      // console.log(e.target.scrollTop, e.target.scrollHeight, e.target.offsetHeight)
      let scrollBottom = e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight
      if(scrollBottom){
        if(this.is_updating_page == true || this.is_last_page == true){
          return
        }

        // console.log(this.pageNumber)
        this.getAccountActivityList()
      }

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
  watch:{
    filter_username_input(val){
        this.getCurrentUserFilterList(val);
    }
  },
  mounted(){
    this.getAccountActivityList(1)
    this.refresh_parameters()
    this.calendarLanguage = this.calendarLanguageList[this.$store.getters.getLanguage]
    this.$root.$on("update-parameters", ()=>{
      // console.log("yes of course")
      this.refresh_parameters()
    })
  }
}
</script>
