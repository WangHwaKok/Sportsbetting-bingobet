<template>
  <div id="core-view">
    <v-container fluid pa-0 style="min-height:40px;">
      <v-card color="black" class="bet-slip-card">
        <v-card-title class="pa-1" style="padding-right:5px;">
          <div class="d-flex" style="width:100%;">
            <v-icon color="black">mdi-format-list-bulleted</v-icon>
            <div class="subheading font-weight-bold" style="color:black;width:100%;float:left;align-self:center">{{$t('Betting.bets')}}</div>
            <div class="caption" style="color:white;background:rgba(0, 0, 0, 0.3);padding:3px;border-radius:3px;width:100px;">{{Object.keys(slipList).length}}{{$t('Betting.selection')}}</div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-layout column fill-height>
            <!-- <v-flex class="justify-center align-center">
              <v-layout row justify-center class="ma-0">
                <v-flex class="pa-0">
                  <v-toolbar light height="36px" id="bet_menu" color="black">
                    <v-toolbar-items style="width:100%">
                      <v-layout align-center justify-center>
                        <v-flex xs4 d-flex fill-height>
                          <v-btn
                              flat
                              :class="`${toggle_slip_type == 0 ? 'betslip-btntoggle' : 'white'}`"
                              @click="betMenuSelected(0, 'single')"
                          >
                            <v-layout justify-center align-center column>
                              <span>{{$t('Betting.single')}}</span>
                            </v-layout>
                          </v-btn>
                        </v-flex>
                        <v-flex xs4 d-flex fill-height>
                          <v-btn
                              flat
                              :class="`${toggle_slip_type == 1 ? 'betslip-btntoggle' : 'white'}`"
                              @click="betMenuSelected(1, 'Multiple')"
                          >
                            <v-layout justify-center align-center column>
                              <span>{{$t('Betting.multiple')}}</span>
                            </v-layout>
                          </v-btn>
                        </v-flex>
                        <v-flex xs4 d-flex fill-height>
                          <v-btn
                              flat
                              :class="`${toggle_slip_type == 2 ? 'betslip-btntoggle' : 'white'}`"
                              @click="betMenuSelected(2, 'System')"
                          >
                            <v-layout justify-center align-center column>
                              <span>{{$t('Betting.system')}}</span>
                            </v-layout>
                          </v-btn>
                        </v-flex>
                      </v-layout>

                    </v-toolbar-items>
                  </v-toolbar>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex> -->

            <v-flex class="justify-center align-center">
              <v-container class="pa-0" style="position:relative">
                <div v-if="Object.keys(slipList).length == 0">
                  <v-container fluid pa-2 class="white">
                    <div class="d-flex body-1 justify-center align-center" style="color:black;font-weight:500;">
                      {{$t('Betting.no_odds_selected')}}
                    </div>
                  </v-container>
                </div>

                <template v-if="!(index = 0)">
                  <template v-if="Object.keys(slipList).length != 0" v-for="(event) in Object.values(slipList)">
                    <template
                            v-for="(oddType) in Object.values(event)"
                    >
                      <v-card
                              light
                              v-for="odd in Object.values(oddType)"
                              :key="odd.oddID"
                              class="pa-1 pb-2 pr-2 white"
                              style="font-size:1.16rem;position: relative;border-radius:unset;background:#e5e5e5"
                      >
                        <div class="d-flex">
                          <div class="num" style="flex:0 0 auto !important;">{{(++index)}}</div>
                          <div style="font-weight:bold;width:100%;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;">{{ odd.homeTeam }} - {{odd.awayTeam}}</div>
                          <div class="align-center" style="float:right;" >
                            <v-icon size="20px" class="betslip-closeicon" @click="remove_bet(odd.eventID, odd.oddTypeID, odd.oddID)">mdi-close</v-icon>
                          </div>
                        </div>

                        <div
                                :class="`${odd.type == 'live'?'bet-slip-live':''}`"
                                style="position: relative;">
                          <div class="odd-info">
                            <div class="evname">{{odd.oddTypeName}}</div>
                          </div>
                          <div class="odd-info d-flex">
                            <div class="evname" v-if="odd.special != undefined && odd.special != ''">{{$t('Betting.pick')}} {{odd.pick}}({{odd.special}})</div>
                            <div class="evname" v-else>{{$t('Betting.pick')}} {{odd.pick}}</div>
                            <div class="coef" v-if="odd.isSuspended == 1">
                              <v-icon color="grey">mdi-lock-outline</v-icon>
                            </div>
                            <div v-else class="coef"
                                  :class="`${odd.changes != undefined?odd.changes:''} live-cell`"
                            >{{odd.oddValue}}</div>
                          </div>

                          <!-- <div class="odd-info with-inp"
                                v-if="toggle_slip_type == 0"
                          >
                            <div>
                              <span class="evname">{{$t('Betting.treble')}}:</span>
                              <v-text-field
                                      class="bet-amount-input ma-0 pa-0"
                                      label=""
                                      v-model="slipList[odd.eventID][odd.oddTypeID][odd.oddID].treble"
                                      @keyup="update_values()"
                                      @change="update_single_format(odd.eventID, odd.oddTypeID, odd.oddID, 'treble')"
                                      single-line
                                      :disabled="is_updating_page"
                                      hide-details
                                      filled
                                      style="min-width:auto;min-height:auto;"
                              ></v-text-field>
                            </div>
                          </div>

                          <div class="odd-info with-inp"
                                v-if="toggle_slip_type == 0"
                          >
                            <div>
                              <span class="evname">{{$t('Betting.potential_returns')}}:</span>
                              <div class="bet-amount">
                                {{odd.potentialReturns}}
                              </div>
                            </div>
                          </div> -->

                          <div class="odd-info with-inp"
                                v-if="odd.hasError == true || odd.isSuspended == 1"
                          >
                            <div class="d-flex justify-center align-center">
                              <v-icon color="red" style="font-size: 20px;width:20px;margin-right:4px;">mdi-alert-circle</v-icon>
                              <span style="font-size: 14px;width:100%;">{{$t('Betting.this_pick_cannot_be_combined')}}</span>
                            </div>
                          </div>
                        </div>
                      </v-card>
                      <v-divider></v-divider>
                    </template>
                  </template>
                </template>
                <v-card style="position:absolute;bottom:5px;border:3px solid white;border-radius:3px;width:90%;left:5%" v-if="showCombinationBox && Object.keys(slipList).length > 1">
                  <v-card-title style="background:#090909;border-radius:3px;" class="pa-0 px-1">
                    <div class="d-flex" style="width:100%;">
                      <div class="body-2" style="color:#e09007;width:100%;float:left">{{$t('Betting.system_bets')}}</div>
                      <v-icon color="#e09007" @click="showCombinationBox = false">mdi-close</v-icon>
                    </div>
                  </v-card-title>
                  <div style="width:100%;background:black">
                    <div class="body-2 pa-1" style="color:#c0c0c0;transform:translate(30%, 0)">{{$t('Betting.combination')}}</div>
                    <div style="max-height:150px;overflow-y:auto;overflow-x:hidden">
                      <div v-for="n in (1,total_item_count-1)" :key="n" 
                          @click="select_combination(n)"
                          :class="`pa-1 combination_btn ${is_combine(n)?'active':''} ${n == total_item_count-1?'bottom-line':''}`">
                        <div class="body-2" style="transform:translate(45%, 0);">{{total_item_count - n + 1}}</div>
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-container>
            </v-flex>

            <v-flex v-if="Object.keys(slipList).length != 0" class="justify-center align-center">
              <!-- <v-card
                      v-if="toggle_slip_type == 2"
                      class="pa-1 px-2 justify-center tertiary1"
                      style="-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;flex-direction: column;">
                <v-flex class="overflow-x:auto;" style="width:100%">
                  <v-btn-toggle v-model="slipInfo.combination_group" multiple>
                    <v-btn
                        v-for="n in (1,total_item_count-1)"
                        :key="n"
                        @click="update_values()"
                        class="combination_btn"
                        style="min-width: auto !important;"
                        flat>
                      <span>{{total_item_count - n + 1}}</span>
                    </v-btn>
                  </v-btn-toggle>
                </v-flex>
                <div class="d-flex xs12">

                  <span>{{total_item_count}} {{$t('Betting.matched', {combination:total_combination}) }}</span>
                </div>
              </v-card>
              <v-divider v-if="toggle_slip_type == 2"></v-divider> -->
              <v-card dark style="background:black;-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;flex-direction: column;">
                <div class="d-flex pa-1" style="width:100%;">
                  <div class="body-2" style="color:white;width:100%;float:left;">{{$t('Betting.system_bets')}}</div>
                  <v-icon color="white" @click="showCombinationBox = !showCombinationBox">mdi-arrow-up-bold-circle</v-icon>
                </div>
              </v-card>
              <v-card dark style="background:black;-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;flex-direction: column;">
                <div class="d-flex pa-1" style="width:100%;background:#303030;border:1px solid #202020;">
                  <div class="body-2 font-weight-regular" style="color:#c0c0c0;float:left">{{total_combination+$t('Betting.combinations')}}</div>
                  <!-- <div class="body-2" style="color:#c0c0c0;float:left">{{total_item_count}} {{$t('Betting.matched', {combination:total_combination}) }}</div> -->
                  <div class="body-2 font-weight-regular" style="color:#c0c0c0;">{{$t('Betting.total_rate')+': '+totalRate_system}}</div>
                </div>
              </v-card>
              <v-card dark style="background:black;-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;flex-direction: column;">
                <div class="d-flex pa-1" style="width:100%;background:#303030;border:1px solid #202020;">
                  <v-text-field
                    ref="bet_amount"
                    light
                    solo
                    class="ma-0 pa-0 bet-box"
                    suffix="TRY"
                    :label='$t("Betting.bet_amount")'
                    :hide-details="true"
                    :height="25"
                    @change="update_system_format()"
                    @keyup="update_values()"
                    v-model="slipInfo.amount_system"
                    :disabled="is_updating_page"
                    :rules="[v => !!v || $t('AccountPage.required')]" required
                    style="width:6rem;"
                  ></v-text-field>
                  <div class="body-2 font-weight-regular pl-2" style="color:#c0c0c0;float:right;align-self:center;">{{$t('Betting.potential_returns')+': '+potentialReturns_system}}</div>
                </div>
              </v-card>
              <!-- <v-card dark class="pa-2 d-flex justify-center align-center column tertiary" style="height:40px;-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;">
                <v-flex>
                  <v-checkbox
                          v-model="acceptChangingRates"
                          :label='$t("Betting.accept_price_change")'
                          hide-details
                          class="ma-0 pa-0"
                  ></v-checkbox>
                </v-flex>
                <v-flex ml-1>
                  <v-text-field
                          ref="bet_amount"
                          v-if="toggle_slip_type == 1"
                          align="center"
                          single-line
                          height="24px"
                          @change="update_multi_format()"
                          @keyup="update_values()"
                          v-model="slipInfo.amount_multi"
                          :disabled="is_updating_page"
                          class="ma-0 pa-0"
                          :rules="[v => !!v || $t('AccountPage.required')]" required
                          :label="$t('Betting.bet_amount')">
                  </v-text-field>
                  <v-text-field
                          ref="bet_amount"
                          v-if="toggle_slip_type == 2"
                          align="center"
                          hide-details
                          single-line
                          height="24px"
                          @change="update_system_format()"
                          @keyup="update_values()"
                          v-model="slipInfo.amount_system"
                          :disabled="is_updating_page"
                          class="ma-0 pa-0"
                          :rules="[v => !!v || $t('AccountPage.required')]" required
                          :label="$t('Betting.bet_amount')">
                  </v-text-field>
                </v-flex>
              </v-card>
              <v-divider></v-divider> -->
              <v-layout column justify-center class="ma-0">
                <v-flex class="pa-0">
                  <!-- <v-card dark class="pa-2 px-3" color="black">
                    <span style="font-weight:500;font-size:1.1rem;">{{$t('Betting.amount')}}:</span>
                    <span style="float: right;font-weight:500;font-size:1.2rem;">{{ amount_system }}</span>
                  </v-card> -->
                  <v-card dark class="pa-2 px-3" color="black">
                    <div class="body-2 font-weight-bold" v-if="Object.keys(slipList).length > 1 && slipInfo.combination_group.length > 0"
                      style="text-align:center;color:#e09007">{{$t('Betting.total_stake')+': '+totalStake_system}}</div>
                  </v-card>
                  <v-card dark class="pa-2 px-3" color="black">
                    <v-checkbox
                      v-model="acceptChangingRates"
                      :label='$t("Betting.accept_price_change")'
                      hide-details
                      class="ma-0 pa-0"
                    ></v-checkbox>
                  </v-card>
                  <v-card dark class="pa-2 px-3" color="black">
                    <v-layout row align-center justify-center>
                      <div class="body-2 font-weight-bold mr-2" style="text-align:center;color:#e09007">{{$t('AccountPage.note')}}:</div>
                      <v-text-field
                        light
                        solo
                        class="ma-0 pa-0"
                        :hide-details="true"
                        :height="25"
                      ></v-text-field>
                    </v-layout>
                  </v-card>
                </v-flex>

                <v-flex class="pa-0 pl-2 pr-2 tertiary">
                  <v-layout row mt-4 mb-2>
                    <!-- <v-btn
                      style="border: 1px solid red;"
                      outlined
                      @click="reset_bets"
                      >{{$t('Betting.reset')}}
                    </v-btn>
                    <v-spacer></v-spacer> -->
                    <v-btn
                        block
                        :loading="is_updating_page"
                        :disabled="is_updating_page"
                        outlined color="primary"
                        @click="send_coupon"
                        class="body-2 font-weight-bold"
                        style="color:black">
                      <template v-if="is_updating_page == true">
                        <v-icon>mdi-loading</v-icon>
                      </template>
                      {{hasChanged == true?$t('Betting.accept_changes'):$t('Betting.save_slip')}}
                      <v-icon color="black">mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
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
  </div>
</template>

<script>
import { constants } from 'crypto';
    export default {
        props: {
        },
        data() {
            return {
                is_updating_page: false,
                hasChanged: false,
                toggle_slip_type: 1,
                bulletinType: 1,

                amount_single: 0.00,
                totalRate_single: 0.00,
                potentialReturns_single: 0.00,

                amount_multi: 0.00,
                totalRate_multi: 0.00,
                potentialReturns_multi: 0.00,

                amount_system: 0.00,
                totalRate_system: 0.00,
                potentialReturns_system: 0.00,
                totalStake_system: 0.00,

                acceptChangingRates: true,
                valid: false,
                slipList: {},
                slipInfo: {
                    amount_multi:'',
                    amount_system:'',
                    combination_group:[],
                },

                total_item_count:0,
                total_combination:0,

                snackbar: false,
                color_type: '',
                alertMessage: '',
                showCombinationBox: false,
            }
        },
        methods:{
            product_Range(a,b) {
                var prd = a,i = a;

                while (i++< b) {
                    prd*=i;
                }
                return prd;
            },


            combinations(n, r)
            {
                if (n==r)
                {
                    return 1;
                }
                else
                {
                    r=(r < n-r) ? n-r : r;
                    return this.product_Range(r+1, n)/this.product_Range(1,n-r);
                }
            },
            send_coupon(){
                if (!this.$refs.bet_amount.validate()) {
                  this.snack('error', this.$t('Betting.bet_amount_is_required'))
                  return;
                }
                if(this.is_updating_page == true){
                    return;
                }
                if(this.hasChanged == true)
                {
                    this.hasChanged = false;
                }
                else {
                    //send
                    this.is_updating_page = true;

                    var odds = [];
                    this.collectOdds(odds, this.slipList, 3);
                    var self = this;

                    if(Object.keys(this.slipList).length == 1){
                        this.axios
                            .post(
                                "zt_create_coupon_single",
                                {
                                    amount: self.amount_system,
                                    totalRate: self.totalRate_system,
                                    totalStake: 1,
                                    potentialReturns: self.potentialReturns_system,
                                    acceptPriceChange: self.acceptChangingRates==true?1:0,
                                    bulletinType: self.bulletinType,
                                    odds: odds
                                },
                                {
                                    headers: {
                                        "X-localization": self.$store.getters.getLanguage,
                                        "Authorization": 'Bearer ' + localStorage.betic_storage
                                    }
                                }
                            )
                            .then(response => {

                                if (response.data.success == undefined){
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
                                        this.snack('error', msg)
                                    }
                                    return;
                                }
                                else {
                                  this.updateBalance()
                                  this.snack('success', response.data.success.message)
                                }
                                this.is_updating_page = false;
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    }
                    else if(this.slipInfo.combination_group.length == 0){
                        this.axios
                            .post(
                                "zt_create_coupon_combined",
                                {
                                    amount: self.amount_system,
                                    totalRate: self.totalRate_system,
                                    totalStake: 1,
                                    potentialReturns: self.potentialReturns_system,
                                    acceptPriceChange: self.acceptChangingRates==true?1:0,
                                    bulletinType: self.bulletinType,
                                    odds: odds
                                },
                                {
                                    headers: {
                                        "X-localization": self.$store.getters.getLanguage,
                                        "Authorization": 'Bearer ' + localStorage.betic_storage
                                    }
                                }
                            )
                            .then(response => {

                                if (response.data.success == undefined){
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
                                        this.snack('error', msg)
                                    }
                                    return;
                                }
                                else {
                                  this.updateBalance()
                                  this.snack('success', response.data.success.message)
                                }
                                this.is_updating_page = false;
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    }
                    else if(Object.keys(this.slipList).length > 1 && this.slipInfo.combination_group.length > 0){
                        var combinations = [];
                        this.slipInfo.combination_group.forEach((item) => {
                            combinations.push(this.total_item_count - item);
                        });
                        this.axios
                            .post(
                                "zt_create_coupon_system",
                                {
                                    combinations: combinations,
                                    amount: self.amount_system,
                                    totalRate: self.totalRate_system,
                                    totalStake: self.totalStake_system,
                                    potentialReturns: self.potentialReturns_system,
                                    acceptPriceChange: self.acceptChangingRates==true?1:0,
                                    bulletinType: self.bulletinType,
                                    // note:'xxxx',
                                    note:'',
                                    odds: odds
                                },
                                {
                                    headers: {
                                        "X-localization": self.$store.getters.getLanguage,
                                        "Authorization": 'Bearer ' + localStorage.betic_storage
                                    }
                                }
                            )
                            .then(response => {

                                if (response.data.success == undefined){
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
                                        this.snack('error', msg)
                                    }
                                    else if(response.data.exception){
                                        this.snack('error', this.$t('Betting.server_is_unavailable_now'))
                                    }
                                    return;
                                }
                                else {
                                  this.updateBalance()
                                  this.snack('success', response.data.success.message)
                                }
                                this.is_updating_page = false;
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    }
                }
            },
            update_single_format(eventID, oddTypeID, oddID, val){
                this.slipList[eventID][oddTypeID][oddID][val] = this.decimalFormat(this.slipList[eventID][oddTypeID][oddID][val]);
                localStorage.betslip_array = JSON.stringify(this.slipList);
                this.update_values();
            },
            update_multi_format(){
                if(this.slipInfo.amount_multi != '')
                  this.slipInfo.amount_multi = this.decimalFormat(this.slipInfo.amount_multi);
                localStorage.betslip_info = JSON.stringify(this.slipInfo);
                this.update_values();
            },
            update_system_format(){
                if(this.slipInfo.amount_system != '')
                  this.slipInfo.amount_system = this.decimalFormat(this.slipInfo.amount_system);
                localStorage.betslip_info = JSON.stringify(this.slipInfo);
                this.update_values();
            },
            decimalFormat(val, decimals=2){
                val = (val?val:0.00);
                if(isNaN(parseFloat(val)))
                    val = 0.00;
                return Math.trunc(parseFloat(val)*Math.pow(10, decimals))/Math.pow(10, decimals);
            },
            getOddValue(obj, start_level=1){
              if(start_level == 2){
                if(obj[Object.keys(obj)[0]].type == 'live'){
                  this.bulletinType = 2;
                }
                return this.decimalFormat(obj[Object.keys(obj)[0]].oddValue)
              }
              else{
                return this.getOddValue(obj[Object.keys(obj)[0]], start_level+1)
              }
            },
            updateAllValues(all_odds, obj, level, start_level=1) {
              if(Object.keys(obj).length == 1){     //single
                this.totalRate_system = parseFloat(this.getOddValue(obj[Object.keys(obj)[0]])).toFixed(2);
                this.potentialReturns_system = parseFloat(this.amount_system*this.getOddValue(obj[Object.keys(obj)[0]])).toFixed(2);
              }
              else if(this.slipInfo.combination_group.length == 0){   //multiple
                this.totalRate_system = 1
                this.potentialReturns_system = 1
                for(var key in obj){
                  for(var secondKey in obj[key]){
                    for(var thirdKey in obj[key][secondKey]){
                      if(obj[key][secondKey][thirdKey].type == 'live'){
                        this.bulletinType = 2;
                      }
                      this.totalRate_system = this.decimalFormat(this.totalRate_system * obj[key][secondKey][thirdKey].oddValue);
                      this.potentialReturns_system = this.decimalFormat(this.amount_system * this.totalRate_system);
                    }
                  }
                }
              }
              else{     //system
                for(var key in obj){
                  for(var secondKey in obj[key]){
                    for(var thirdKey in obj[key][secondKey]){
                      if(obj[key][secondKey][thirdKey].type == 'live'){
                        this.bulletinType = 2;
                      }
                      all_odds.push(obj[key][secondKey][thirdKey])
                    }
                  }
                }
              }
            },
            collectOdds(odds, obj, level, start_level=1) {
                for(var key in obj) {
                    if(start_level == level)
                    {
                        odds.push({"oddID":obj[key].oddID,"value":obj[key].oddValue});
                    }
                    if(typeof(obj[key]) == 'object' && !(obj[key] instanceof Array))
                        this.collectOdds(odds, obj[key], level, start_level + 1);
                }
            },
            k_combinations(set, k) {
                var i, j, combs, head, tailcombs;

                if (k > set.length || k <= 0) {
                    return [];
                }

                if (k == set.length) {
                    return [set];
                }

                if (k == 1) {
                    combs = [];
                    for (i = 0; i < set.length; i++) {
                        combs.push([set[i]]);
                    }
                    return combs;
                }

                combs = [];
                for (i = 0; i < set.length - k + 1; i++) {
                    head = set.slice(i, i + 1);
                    tailcombs = this.k_combinations(set.slice(i + 1), k - 1);
                    for (j = 0; j < tailcombs.length; j++) {
                        combs.push(head.concat(tailcombs[j]));
                    }
                }
                return combs;
            },
            update_values(is_update_betslip_item=false){
                if(is_update_betslip_item == true)
                    this.get_betslip_items();

                localStorage.betslip_array = JSON.stringify(this.slipList);
                localStorage.betslip_info = JSON.stringify(this.slipInfo);

                this.bulletinType = 1;

                //single
                // this.amount_single = 0.00;
                // this.totalRate_single = 0.00;
                // this.potentialReturns_single = 0.00;

                //multi
                // this.amount_multi = this.decimalFormat(this.slipInfo.amount_system == ''? 0: this.slipInfo.amount_system);
                // this.totalRate_multi = 1;
                // this.potentialReturns_multi = 1;
                
                //system
                this.amount_system = this.decimalFormat(this.slipInfo.amount_system == '' ? 0: this.slipInfo.amount_system);

                //update all
                var all_odds = [];
                this.updateAllValues(all_odds, this.slipList, 3);

                // console.log(all_odds)
                //calc combination rate

                if(Object.keys(this.slipList).length > 1 && this.slipInfo.combination_group.length > 0){
                  var rate_system = 0;
  
                  this.slipInfo.combination_group.forEach((item)=>{
                      var temp_set = this.k_combinations(all_odds, this.total_item_count - item);
                      temp_set.forEach((subItem)=>{
                          var temp_multi = 1;
                          subItem.forEach((odd)=>{
                              temp_multi = this.decimalFormat(temp_multi * parseFloat(odd.oddValue));
                          });
                          rate_system = parseFloat((rate_system + temp_multi).toFixed(2));
                      });
                  });
  
                  this.totalRate_system = rate_system;
                  this.totalStake_system = this.decimalFormat(this.amount_system * this.total_combination);
                  this.potentialReturns_system = this.decimalFormat(this.amount_system * this.totalRate_system);
                }

                localStorage.betslip_array = JSON.stringify(this.slipList);
                localStorage.betslip_info = JSON.stringify(this.slipInfo);
            },
            getKeys(keys, obj, level, start_level=1) {
                for(var key in obj) {
                    if(start_level == level)
                        keys.push(obj[key]);
                    if(typeof(obj[key]) == 'object' && !(obj[key] instanceof Array))
                        this.getKeys(keys, obj[key], level, start_level + 1);
                }
            },
            get_betslip_items(){
                var betslip_array = {};
                if(localStorage.betslip_array)
                    betslip_array = JSON.parse(localStorage.betslip_array);
                this.slipList = betslip_array;

                var betslip_info = {
                    amount_multi: '',
                    amount_system: '',
                    combination_group:[],
                };
                if(localStorage.betslip_info)
                    betslip_info = JSON.parse(localStorage.betslip_info);
                this.slipInfo = betslip_info;

                if(Object.keys(this.slipList).length == 0)
                {
                    localStorage.betslip_info = JSON.stringify(this.slipInfo);

                    return;
                }
                else if(Object.keys(this.slipList).length == 1){
                    this.toggle_slip_type = 0;
                }
                else{
                    var keys = [];
                    this.getKeys(keys, this.slipList, 1);
                    if(keys.length >= 2){
                        this.toggle_slip_type = 1;
                    }
                    // console.log(keys)
                    this.total_item_count = keys.length;
                    this.slipInfo.combination_group = [];
                    // for(var k=0;k<this.total_item_count-1;k++)
                    // {
                    //     this.slipInfo.combination_group.push(k);
                    // }

                    // var total_combination = 0;
                    // this.slipInfo.combination_group.forEach((item, n)=>{
                    //     total_combination += this.combinations(this.total_item_count, this.total_item_count - item);
                    // });

                    // this.total_combination = total_combination;
                }

                localStorage.betslip_info = JSON.stringify(this.slipInfo);
            },
            detectSingle(){
              var betslip_array = {};
              if(localStorage.betslip_array)
                  betslip_array = JSON.parse(localStorage.betslip_array);
              this.slipList = betslip_array;
              if(Object.keys(this.slipList).length == 1){
                  this.toggle_slip_type = 0;
              }
            },
            betMenuSelected(slip_type, slip_name){
                this.toggle_slip_type = slip_type;
                this.detectSingle()
            },
            refresh_page(){
                this.update_values(true);
                this.closeOverviewSocket();
                this.connectOverviewSocket();
            },
            reset_bets(){
                localStorage.betslip_array="{}";

                var betslip_info={
                    amount_multi:'',
                    amount_system:'',
                    combination_group:[],
                }
                localStorage.betslip_info = JSON.stringify(betslip_info);

                this.update_values(true);
                this.$root.$emit('update-list')
                // this.$forceUpdate()
                // this.$root.$forceUpdate()
            },
            remove_bet(eventID, oddTypeID, oddID){
                var betslip_array = {};
                if(localStorage.betslip_array)
                    betslip_array = JSON.parse(localStorage.betslip_array);
                if(betslip_array[eventID] && betslip_array[eventID][oddTypeID] && betslip_array[eventID][oddTypeID][oddID])
                {
                    delete betslip_array[eventID][oddTypeID][oddID];
                    if(Object.keys(betslip_array[eventID][oddTypeID]).length == 0)
                        delete betslip_array[eventID][oddTypeID];
                    if(Object.keys(betslip_array[eventID]).length == 0)
                        delete betslip_array[eventID];
                    localStorage.betslip_array = JSON.stringify(betslip_array);
                    // this.$root.$emit('update-bet-slip');
                    this.update_values(true);
                    this.$root.$emit('update-list')
                    // this.$root.$forceUpdate()
                }
            },
            setOverViewList(updateOddsData = "", removeOddTypeData = "") {
                var self = this;
                if(updateOddsData != "" && updateOddsData.odds != undefined && updateOddsData.odds.length > 0){
                    if(self.slipList[updateOddsData.eventID]!=undefined && self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID] != undefined){
                        updateOddsData.odds.forEach(function(updateOdd, upt_odd_index){
                            if(self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID] != undefined
                            && self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID]['type'] !="prematch")
                            {
                                if(self.acceptChangingRates == true)
                                    self.hasChanged = false;
                                else
                                    self.hasChanged = true;
                                var orgVal = self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].oddValue;

                                // self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes = "";

                                // var changes = "";

                                if( orgVal > updateOdd.value)
                                {
                                  if(self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes == undefined)
                                    self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes = 'decrease1'
                                  else if(self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes == 'decrease1')
                                    self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes = 'decrease2'
                                  else if(self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes == 'decrease2')
                                    self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes = 'decrease1'
                                }
                                else if(orgVal < updateOdd.value){
                                  if(self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes == undefined)
                                    self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes = 'increase1'
                                  else if(self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes == 'increase1')
                                    self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes = 'increase2'
                                  else if(self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes == 'increase2')
                                    self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes = 'increase1'
                                }

                                // self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].changes = changes;

                                self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].oddValue = updateOdd.value;

                                if(updateOdd.isSuspended != undefined)
                                  self.slipList[updateOddsData.eventID][updateOddsData.oddTypeID][updateOdd.oddID].isSuspended = updateOdd.isSuspended;
                            }
                        });
                        self.update_values();
                        self.$forceUpdate()
                    }
                }
                else if(removeOddTypeData != "" && removeOddTypeData.leagueID != undefined && removeOddTypeData.eventID != undefined && removeOddTypeData.oddTypeAlias != undefined){
                    if(self.slipList[removeOddTypeData.eventID]!=undefined && self.slipList[removeOddTypeData.eventID][removeOddTypeData.oddTypeID] != undefined
                        && self.slipList[removeOddTypeData.eventID][removeOddTypeData.oddTypeID][removeOddTypeData.oddID] != undefined
                        && self.slipList[removeOddTypeData.eventID][removeOddTypeData.oddTypeID][removeOddTypeData.oddID]['type'] !="prematch"){
                        Object.keys(self.slipList[removeOddTypeData.eventID][removeOddTypeData.oddTypeID]).forEach(function(key, index){
                            self.slipList[removeOddTypeData.eventID][removeOddTypeData.oddTypeID][key].error = true;
                        });
                        self.update_values();
                        self.$forceUpdate()
                    }
                }
            },
            connectOverviewSocket() {
              // var lan = this.$store.getters.getLanguage ? this.$store.getters.getLanguage : 'en'
              // localStorage.socketChannelBetslip = "live.sport.all." + lan
              // // console.log("hello")
              // // console.log(localStorage.socketChannelBetslip)
              // window.Echo.private(localStorage.socketChannelBetslip).listen(
              //     "LiveSportDetailSent",
              //     e => {
              //         // console.log("LiveSportDetailSent");
              //         //if(e.message.method == 'insertOddType')
              //         //console.log(e.message.method, e.message);
              //         if(Object.keys(this.slipList).length > 0){
              //             switch (e.message.method) {
              //                 case "updateOdds": {
              //                     this.setOverViewList(e.message);
              //                     break;
              //                 }
              //                 case "removeOddType": {
              //                     this.setOverViewList("", e.message);
              //                     break;
              //                 }
              //             }
              //
              //         }
              //
              //     }
              // );
            },
            closeOverviewSocket() {
              // if (localStorage.socketChannelBetslip == undefined || localStorage.socketChannelBetslip.length == 0)
              //   return;
              // window.Echo.leave(localStorage.socketChannelBetslip)
              // localStorage.socketChannelBetslip = ""
            },
            snack (type, msg) {
              this.color_type = type
              this.alertMessage = msg
              this.snackbar = true
            },
            updateBalance(){
              this.$root.$emit('updateBalance')
              this.reset_bets()
            },
            is_combine(n){
              var number = -1
              if(this.slipInfo.combination_group.length > 0){
                this.slipInfo.combination_group.find((val, i) => {
                  if(val == n-1){
                    number = i
                    return
                  }
                })
                if(number != -1){
                  return true
                }
              }
              return false
            },
            select_combination(n){
              var number = -1
              if(this.slipInfo.combination_group.length > 0){
                this.slipInfo.combination_group.find((val, i) => {
                  if(val == n-1){
                    number = i
                    return
                  }
                })
                if(number != -1){
                  this.slipInfo.combination_group.splice(number, 1)
                }
                else{
                  this.slipInfo.combination_group.push(n-1)
                }
              }
              else{
                this.slipInfo.combination_group.push(n-1)
              }
              this.update_values()
            }
        },
        watch:{
            // $route(val) {
            //     this.refresh_page();
            // },
            toggle_slip_type:function(){
              // this.update_values(true);
              // this.toggle_slip_type = 2
            },
            "slipInfo.combination_group"(){
                var total_combination = 0;
                this.slipInfo.combination_group.forEach((item, n)=>{
                    total_combination += this.combinations(this.total_item_count, this.total_item_count - item);
                });

                this.total_combination = total_combination;
                this.update_values();
            }
        },
        mounted(){
            this.refresh_page();
            this.$root.$on("update-bet-slip", ()=>{
              // self.update_values(true);
              // self.$forceUpdate()
              this.refresh_page();
            })
        },
    }
</script>

<style>
  html{
    overflow-y: hidden;
  }
  .num{
    color:#505050;
    font-weight:bold;
    font-size:14px;
    text-align: center;
    width: 30px;
    float:left;
  }
  .odd-info{
    padding-left: 30px;
    color:black;
    font-size:12px;
  }

  .evname{
    color: #606060;
    width: 100%;
    align-self: center;
    font-weight: 500;
    font-size: 1.15rem;
    white-space:nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
  }
  .coef{
    float: right;
    color: #323232;
    font-size:1.15rem;
    font-weight: bold;
    line-height: 3rem;
    padding-right: 1rem;
    height: 3rem;
  }
  .odd-info.with-inp{
    height: 2.08rem !important;
    line-height: 2.08rem!important;
    color: #b6b9bf;
    font-size: 12px;
  }
  .bet-amount-input{
    width: 6.25rem;
    float: right;
  }
  .bet-amount-input .v-input__control{
    height: 2.08rem !important;
    line-height: 2.08rem!important;
  }
  .bet-amount-input .v-input__slot{
    height: 2.08rem !important;
    line-height: 2.08rem !important;
    padding:0 !important;
    min-height: 100% !important;
  }
  .bet-amount-input input{
    height: 2.08rem !important;
    line-height: 2.08rem !important;
    max-height: 100% !important;
    width: 100%;
    background-color: #c5c5c5;
    border: 1px solid #303030;
    padding: 0 4px !important;
    margin:0 !important;
    text-align: right;
    color: black !important;
  }
  .bet-amount{
    height: 2.08rem !important;
    line-height: 2.08rem!important;
    width: 6.25rem;
    background-color: #c5c5c5;
    border: 1px solid #101010;
    border-top: 0px !important;
    padding: 0 4px !important;
    text-align: right;
    float: right;
    color: black;
  }
  #bet_menu .v-toolbar__content{
    padding:0;
  }
  #bet_menu .v-btn{
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    border-radius: 0px;
  }

  .v-btn:hover:before{
    /* background-color:currentColor; */
  }
  .combination_btn{
    margin-left:5px;
    margin-right:5px;
    background-color:#202020;
    color:#c0c0c0;
    border-top:1px solid #505050;
    width: 100%;
    cursor:pointer;
  }
  .combination_btn.bottom-line{
    border-bottom:1px solid #505050;
  }
  .combination_btn.active{
    background-color:#e09007;
    color:black;
  }
  .combination_btn:hover{
    background-color:#303030;
    color:#c0c0c0;
  }
</style>
