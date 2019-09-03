<template>
  <v-card id="p_chpwd" class="ma-0 pa-0 card-account">
    <v-card-title>
      <div class="subheading font-weight-medium">
        {{$t('AccountPage.user_balance')}}
      </div>
    </v-card-title>
    <v-card-text>
      <v-layout row>
        <v-flex xs2>
          <v-text-field :label='$t("AccountPage.enter_user_name")' v-model="filter_user_name"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row class="pr-3 scroll-y account-table" id="main-scroll" fill-height>
        <v-flex v-scroll:#main-scroll="onMainScrollPos">
          <v-data-table
            :headers="headers"
            :items="filter_users"
            class="elevation-1"
            style="width: 100%;"
            hide-headers
            hide-actions
          >
            <template v-slot:items="props">
              <td width="100%">
                <v-layout row>
                  <v-flex style="max-width: 60px;">
                    <v-layout
                      justify-center
                      align-center
                      fill-height
                      class="tertiary"
                    >
                      <v-img
                        v-if="!!props.item.avatar"
                        :src="props.item.avatar"
                      ></v-img>
                      <v-icon v-if="!props.item.avatar" x-large>mdi-account</v-icon>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout class="pl-3">
                      <template v-if="props.item.email != undefined && props.item.email != ''">
                        <v-flex xs12>{{ props.item.username }} ({{ props.item.email }})</v-flex>
                      </template>
                      <template v-else>
                        <v-flex xs12>{{ props.item.username }}</v-flex>
                      </template>
                    </v-layout>
                    <v-layout row>
                      <template v-if="props.item.isCombined">
                        <v-flex xs1>
                          <v-subheader class="justify-end">{{$t('AccountPage.balance')}}:</v-subheader>
                        </v-flex>
                        <v-flex
                          xs2
                          style="justify-content: start; align-items: center; display: flex;"
                        >
                          <!-- <v-chip label color="warning">{{props.item.balance}} {{props.item.currency}}</v-chip> -->
                          <v-layout column>
                            <v-btn
                              color="green"
                              round
                              small 
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[0].name, props.item.userID, 'balance', props.item.currency)"
                            >
                              {{balanceActions[0].text}}
                            </v-btn>
                            <v-btn
                                color="warning"
                                round
                                small 
                                class="user-balance-btn"
                                @click="BalanceDlg(balanceActions[1].name, props.item.userID, 'balance', props.item.currency)"
                              >
                                {{balanceActions[1].text}}
                            </v-btn>
                          </v-layout>
                          <!-- <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="warning"
                                dark
                                v-on="on"
                              >
                                {{props.item.balance}} {{props.item.currency}}
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-tile
                                v-for="(item, index) in balanceActions"
                                :key="index"
                                @click="BalanceDlg(item.name, props.item.userID, 'balance', props.item.currency)"
                              >
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu> -->
                        </v-flex>
                      </template>
                      <template v-else>
                        <v-flex>
                          <v-subheader class="justify-end">{{$t('AccountPage.sports')}}: {{props.item.sportBalance}} {{props.item.currency}}</v-subheader>
                        </v-flex>
                        <v-flex
                          style="justify-content: start; align-items: center; display: flex;"
                        >
                        <v-layout column>
                          <v-btn
                              color="green"
                              round
                              small 
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[0].name, props.item.userID, 'sportBalance', props.item.currency)"
                            >
                              {{balanceActions[0].text}}
                          </v-btn>
                          <v-btn
                              color="warning"
                              round
                              small 
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[1].name, props.item.userID, 'sportBalance', props.item.currency)"
                            >
                              {{balanceActions[1].text}}
                          </v-btn>
                          <!-- <v-chip label color="warning">{{props.item.sportBalance}} {{props.item.currency}}</v-chip> -->
                          <!-- <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="warning"
                                dark
                                v-on="on"
                              >
                                {{props.item.sportBalance}} {{props.item.currency}}
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-tile
                                v-for="(item, index) in balanceActions"
                                :key="index"
                                @click="BalanceDlg(item.name, props.item.userID, 'sportBalance', props.item.currency)"
                              >
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu> -->
                        </v-layout>
                        </v-flex>
                        <v-flex>
                          <v-subheader style="justify-content: flex-end;"
                            >{{$t('AccountPage.casino')}}: {{props.item.casinoBalance}} {{props.item.currency}}</v-subheader>
                        </v-flex>
                        <v-flex
                          style="justify-content: start; align-items: center; display: flex;"
                        >
                        <v-layout column>
                          <v-btn
                              color="green"
                              round
                              small
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[0].name, props.item.userID, 'casinoBalance', props.item.currency)"
                            >
                              {{balanceActions[0].text}}
                          </v-btn>
                          <v-btn
                              color="warning"
                              round
                              small 
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[1].name, props.item.userID, 'casinoBalance', props.item.currency)"
                            >
                              {{balanceActions[1].text}}
                          </v-btn>
                          <!-- <v-chip label color="warning">
                            {{props.item.casinoBalance}} {{props.item.currency}}
                          </v-chip> -->
                          <!-- <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="warning"
                                dark
                                v-on="on"
                              >
                                {{props.item.casinoBalance}} {{props.item.currency}}
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-tile
                                v-for="(item, index) in balanceActions"
                                :key="index"
                                @click="BalanceDlg(item.name, props.item.userID, 'casinoBalance', props.item.currency)"
                              >
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu> -->
                        </v-layout>
                        </v-flex>
                        <v-flex>
                          <v-subheader style="justify-content: flex-end;"
                            >{{$t('AccountPage.poker')}}: {{props.item.pokerBalance}} {{props.item.currency}}</v-subheader>
                        </v-flex>
                        <v-flex
                          style="justify-content: start; align-items: center; display: flex;"
                        >
                        <v-layout column>
                          <v-btn
                              color="green"
                              round
                              small 
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[0].name, props.item.userID, 'pokerBalance', props.item.currency)"
                            >
                              {{balanceActions[0].text}}
                          </v-btn>
                          <v-btn
                              color="warning"
                              round
                              small 
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[1].name, props.item.userID, 'pokerBalance', props.item.currency)"
                            >
                              {{balanceActions[1].text}}
                          </v-btn>
                          <!-- <v-chip label color="warning">
                            {{props.item.pokerBalance}} {{props.item.currency}}
                          </v-chip> -->
                          <!-- <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="warning"
                                dark
                                v-on="on"
                              >
                                {{props.item.pokerBalance}} {{props.item.currency}}
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-tile
                                v-for="(item, index) in balanceActions"
                                :key="index"
                                @click="BalanceDlg(item.name, props.item.userID, 'pokerBalance', props.item.currency)"
                              >
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu> -->
                        </v-layout>
                        </v-flex>
                        <v-flex>
                          <v-subheader style="justify-content: flex-end;"
                            >{{$t('AccountPage.tombala')}}: {{props.item.tombalaBalance}} {{props.item.currency}}</v-subheader>
                        </v-flex>
                        <v-flex
                          style="justify-content: start; align-items: center; display: flex;"
                        >
                        <v-layout column>
                          <v-btn
                              color="green"
                              round
                              small 
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[0].name, props.item.userID, 'tombalaBalance', props.item.currency)"
                            >
                              {{balanceActions[0].text}}
                          </v-btn>
                          <v-btn
                              color="warning"
                              round
                              small 
                              class="user-balance-btn"
                              @click="BalanceDlg(balanceActions[1].name, props.item.userID, 'tombalaBalance', props.item.currency)"
                            >
                              {{balanceActions[1].text}}
                          </v-btn>
                          <!-- <v-chip label color="warning">
                            {{props.item.tombalaBalance}} {{props.item.currency}}
                          </v-chip> -->
                          <!-- <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                color="warning"
                                dark
                                v-on="on"
                              >
                                {{props.item.tombalaBalance}} {{props.item.currency}}
                              </v-btn>
                            </template>
                            <v-list>
                              <v-list-tile
                                v-for="(item, index) in balanceActions"
                                :key="index"
                                @click="BalanceDlg(item.name, props.item.userID, 'tombalaBalance', props.item.currency)"
                              >
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu> -->
                        </v-layout>
                        </v-flex>
                      </template>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-dialog v-model="dialog_balance_setting" persistent max-width="300px">
      <v-form v-model="valid">
        <v-card>
          <v-card-title>
            <span class="headline">{{current_transfer_type == 'deposit'?$t('Common.deposit'):$t('Common.withdraw')}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="current_amount" :label='$t("Betting.amount")+"*"'
                                value=''
                                :rules="[rules.required, rules.number]"
                                :suffix="current_currency"
                                required></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field v-model="current_note" :label='$t("AccountPage.note")+"*"'
                                ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="dialog_balance_setting = false">{{$t('Common.cancel')}}</v-btn>
            <v-btn color="blue darken-1" flat
                    :disabled="is_processing"
                    @click="Balance_Setting">{{current_transfer_type == 'deposit'?$t('Common.deposit'):$t('Common.withdraw')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      current_userid: 0,
      current_balance_type: 'balance',
      current_transfer_type: 'deposit',
      current_amount: '',
      current_note: '',
      current_currency: 'USD',
      dialog_balance_setting: false,

      headers: [{ text: 'item' }],
      expand:false,
      rules: {
          required: value => !!value || this.$t('AccountPage.required'),
          number: v => !isNaN(parseFloat(v)) || this.$t('AccountPage.numbers_only')
      },
      is_updating_page: false,
      is_last_page: false,
      is_processing:false,
      page:0,
      filter_user_name:'',
      search_userID:'',
      users: [],
      balanceActions: [{name:'deposit', text:this.$t('Common.deposit')}, {name:'withdraw', text:this.$t('Common.withdraw')}],

      color_type:'',
      snackbar: false,
      alertMessage: '',
    }
  },
  methods:{
    showNotify(type, msg){
      this.color_type = type
      this.alertMessage = msg
      this.snackbar = true
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
        this.getUserList()
      }

    },
    Balance_Setting(){
        if(this.valid == false)
            return;
        this.is_processing = true;
        this.axios.post("zt_balance_setting",
            {
                userID: this.current_userid,
                balanceType:this.current_balance_type,
                balanceNote: this.current_note,
                transferType: this.current_transfer_type,
                balance:this.current_amount
            },
            {
                headers: {
                    "X-localization": this.$store.getters.getLanguage,
                    "Authorization": 'Bearer ' + localStorage.betic_storage
                }
            }).then(response => {
            if (response.data.success == undefined){
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

                this.dialog_balance_setting = false;
                this.is_processing = false;
                return;
            }

            this.showNotify('success', this.$t('AccountPage.balance_has_been_updated_successfully'))

            this.dialog_balance_setting = false;
            this.is_processing = false;
            this.getUserList(1)

        }).catch(e => {
            console.log(e);

            this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))

            this.dialog_balance_setting = false;
            this.is_processing = false;
        });
    },
    getUserList(refresh = 0){
      if(refresh == 1){
        this.is_updating_page = false
        this.is_last_page = false
        this.page = 0
      }
        this.is_updating_page = true;
        this.axios.post("zt_supplier_list_users",
            {
                page: this.page+1,
                userID: this.search_userID,
            },
            {
                headers: {
                    "X-localization": this.$store.getters.getLanguage,
                    "Authorization": 'Bearer ' + localStorage.betic_storage
                }
            }).then(response => {
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
                    this.showNotify('error', msg)
                }
                return;
            }

            this.page = parseInt(response.data.success.data.page);
            if(response.data.success.data.users.length == 0){
              this.is_last_page = true
            }
            if(this.page == 1)
                this.users = [];
            this.users = [].concat.apply(this.users, response.data.success.data.users);

            this.is_updating_page = false;
        }).catch(e => {
            console.log(e);

            this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))

            this.is_updating_page = false;
        });
    },
    BalanceDlg(type, userid, balanceType, currency){
        this.current_userid = userid;
        this.current_balance_type = balanceType;
        this.current_transfer_type = type;
        this.current_amount = '';
        this.current_note = '';
        this.current_currency = currency;
        this.dialog_balance_setting=true;
    },
  },
  computed: {
      filter_users() {
          return this.users.filter((item,i)=>{
              return item.username.toLowerCase().includes(this.filter_user_name.toLowerCase());
          });
      }
  },
  mounted(){
    this.getUserList()
  },
  created(){
    window.addEventListener('scroll', this.onMainScrollPos);
  },
}
</script>
