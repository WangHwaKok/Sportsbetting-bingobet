<template>
  <v-container id="p_users" fluid class="pr-0 ma-0">
    <v-layout row justify-space-between>
      <v-flex xs2>
        <v-text-field :label='$t("AccountPage.enter_user_name")' v-model="filter_user_name"></v-text-field>
      </v-flex>
      <v-flex xs2 class="pr-3">
        <v-btn block color="primary" @click.stop="AddDlg">
          <v-icon>mdi-plus</v-icon>&nbsp;{{$t('AccountPage.add_new_user')}}
        </v-btn>
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
            <td width="80%">
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
                    <v-flex xs12>{{ props.item.username }}</v-flex>
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
                        <v-chip label color="warning">{{props.item.balance}} {{props.item.currency}}</v-chip>
                      </v-flex>
                    </template>
                    <template v-else>
                      <v-flex xs1>
                        <v-subheader class="justify-end">{{$t('AccountPage.sports')}}:</v-subheader>
                      </v-flex>
                      <v-flex
                              xs2
                              style="justify-content: start; align-items: center; display: flex;"
                      >
                        <v-chip label color="warning">{{
                          props.item.sportBalance
                          }} {{props.item.currency}}</v-chip>
                      </v-flex>
                      <v-flex xs1>
                        <v-subheader style="justify-content: flex-end;"
                        >{{$t('AccountPage.casino')}}:</v-subheader
                        >
                      </v-flex>
                      <v-flex
                              xs2
                              style="justify-content: start; align-items: center; display: flex;"
                      >
                        <v-chip label color="warning">
                          {{props.item.casinoBalance}} {{props.item.currency}}
                        </v-chip>
                      </v-flex>
                      <v-flex xs1>
                        <v-subheader style="justify-content: flex-end;"
                        >{{$t('AccountPage.poker')}}:</v-subheader
                        >
                      </v-flex>
                      <v-flex
                              xs2
                              style="justify-content: start; align-items: center; display: flex;"
                      >
                        <v-chip label color="warning">
                          {{props.item.pokerBalance}} {{props.item.currency}}
                        </v-chip>
                      </v-flex>
                      <v-flex xs1>
                        <v-subheader style="justify-content: flex-end;"
                        >{{$t('AccountPage.tombala')}}:</v-subheader
                        >
                      </v-flex>
                      <v-flex
                              xs2
                              style="justify-content: start; align-items: center; display: flex;"
                      >
                        <v-chip label color="warning">
                          {{props.item.tombalaBalance}} {{props.item.currency}}
                        </v-chip>
                      </v-flex>
                    </template>
                  </v-layout>
                </v-flex>
              </v-layout>
            </td>
            <td width="20%">
              <v-layout justify-end>
                <v-btn small icon @click.stop="ModifyDlg(props.item.userID, props.item.username, props.item.status, props.item.isLiveActive, props.item.isSystemPlay, '')">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small icon @click.stop="DeleteDlg(props.item.userID, props.item.username)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-layout>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-dialog v-model="dialog_add_user" persistent max-width="300px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('AccountPage.add_user')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="current_username"
                              :rules="[rules.required]"
                              :label='$t("AccountPage.user_name")+"*"' required></v-text-field>
              </v-flex>
              <!-- <v-flex xs12>
                <v-text-field v-model="current_email"
                              :label='$t("AccountPage.email")+"*"'></v-text-field>
              </v-flex> -->
              <v-flex xs12>
                <v-text-field v-model="current_password"
                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                              :rules="[rules.required, rules.min]"
                              :type="show1 ? 'text' : 'password'"
                              counter
                              @click:append="show1 = !show1"
                              :label='$t("AccountPage.password")+"*"' :hint='$t("AccountPage.at_least_4_characters")' required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="confirm_password"
                              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                              :rules="[rules.required, rules.min, rules.confirm]"
                              :type="show3 ? 'text' : 'password'"
                              counter
                              v-on:keyup.enter="AddUser"
                              @click:append="show3 = !show3"
                              :label='$t("AccountPage.confirm_password")+"*"' :hint='$t("AccountPage.at_least_4_characters")' required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-checkbox
                  v-model="statusCheck"
                  :label='$t("AccountPage.status")'
                ></v-checkbox>
              </v-flex>
              <v-flex xs12>
                <v-checkbox
                  v-model="liveActiveCheck"
                  :label='$t("AccountPage.isliveactive")'
                ></v-checkbox>
              </v-flex>
              <v-flex xs12>
                <v-checkbox
                  v-model="systemPlayCheck"
                  :label='$t("AccountPage.issystemplay")'
                ></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog_add_user = false">{{$t('Common.cancel')}}</v-btn>
          <v-btn color="blue darken-1" flat
                 :disabled="is_processing"
                 @click.stop="AddUser">{{$t('Common.add')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_delete_user" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{$t('Common.remove_user')}}</v-card-title>
        <v-card-text>{{$t('AccountPage.the_user')}} <strong class="title error--text">{{current_username}}</strong> {{$t('AccountPage.will_be_deleted')}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.stop="dialog_delete_user = false">{{$t('Common.no')}}</v-btn>
          <v-btn color="green darken-1" flat
                 :disabled="is_processing"
                 @click.stop="DeleteUser">{{$t('Common.yes')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_modify_user" persistent max-width="300px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('AccountPage.update_user')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <!-- <v-flex xs12>
                <v-text-field v-model="current_email" :label='$t("AccountPage.email")+"*"'
                ></v-text-field>
              </v-flex> -->
              <v-flex xs12>
                <v-text-field v-model="current_password"
                              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                              :rules="[rules.required, rules.min]"
                              :type="show2 ? 'text' : 'password'"
                              counter
                              @click:append="show2 = !show2"
                              :label='$t("AccountPage.password")+"*"' :hint='$t("AccountPage.at_least_4_characters")' required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="confirm_password"
                              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                              :rules="[rules.required, rules.min, rules.confirm]"
                              :type="show3 ? 'text' : 'password'"
                              counter
                              @click:append="show3 = !show3"
                              :label='$t("AccountPage.confirm_password")+"*"' :hint='$t("AccountPage.at_least_4_characters")' required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-checkbox
                  v-model="statusCheck"
                  :label='$t("AccountPage.status")'
                ></v-checkbox>
              </v-flex>
              <v-flex xs12>
                <v-checkbox
                  v-model="liveActiveCheck"
                  :label='$t("AccountPage.isliveactive")'
                ></v-checkbox>
              </v-flex>
              <v-flex xs12>
                <v-checkbox
                  v-model="systemPlayCheck"
                  :label='$t("AccountPage.issystemplay")'
                ></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog_modify_user = false">{{$t('Common.cancel')}}</v-btn>
          <v-btn color="blue darken-1" flat
                 :disabled="is_processing"
                 @click="ModifyUser">{{$t('Common.save')}}</v-btn>
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
  export default {
    data() {
      return {
        headers: [{ text: 'item' }],
        current_userid: 0,
        current_username:'',
        current_email:'',
        current_password:'',
        confirm_password: '',
        dialog_delete_user:false,
        dialog_modify_user:false,
        dialog_add_user: false,
        headers: [{ text: 'item' }],
        expand:false,
        show1: false,
        show2: false,
        show3: false,
        rules: {
          required: value => !!value || this.$t('AccountPage.required'),
          min: v => v.length >= 4 || this.$t('Login.password_must_be_more_than_4_characters'),
          confirm: value => value == this.current_password || this.$t('AccountPage.password_does_not_match')
        },
        is_updating_page: false,
        is_last_page: false,
        is_processing:false,
        page:0,
        filter_user_name:'',
        search_userID:'',
        users: [],

        color_type:'',
        snackbar: false,
        alertMessage: '',
        statusCheck: true,
        liveActiveCheck: true,
        systemPlayCheck: true,
      }
    },
    methods:{
      AddUser(){
        this.is_processing = true;
        this.axios.post("zt_supplier_add_user",
                {
                  username:this.current_username,
                  password: this.current_password,
                  // email: this.current_email,
                  status: this.statusCheck,
                  isLiveActive: this.liveActiveCheck,
                  isSystemPlay: this.systemPlayCheck
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

            this.dialog_add_user = false;
            this.is_processing = false;
            return;
          }

          this.showNotify('success', this.$t('AccountPage.user_has_been_added_successfully'))
          this.dialog_add_user = false;
          this.is_processing = false;
          this.getUserList(1)
        }).catch(e => {
          console.log(e);

          this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))

          this.dialog_add_user = false;
          this.is_processing = false;
        });
      },
      ModifyUser(){
        if(this.current_userid == 0)
        {
          this.dialog_modify_user = false;
          return;
        }

        this.is_processing = true;
        this.axios.put("zt_supplier_update_user/" + this.current_userid.toString(),
                {
                  password: this.current_password,
                  status: this.statusCheck,
                  isLiveActive: this.liveActiveCheck,
                  isSystemPlay: this.systemPlayCheck
                  // email: this.current_email,
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

            this.dialog_modify_user = false;
            this.is_processing = false;
            return;
          }

          this.showNotify('success', this.$t('AccountPage.user_has_been_updated_successfully'))

          this.dialog_modify_user = false;
          this.is_processing = false;
          this.getUserList(1)
        }).catch(e => {
          console.log(e);

          this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))

          this.dialog_modify_user = false;
          this.is_processing = false;
        });
      },
      DeleteUser(){
        if(this.current_userid == 0)
        {
          this.dialog_delete_user = false;
          return;
        }

        this.is_processing = true;
        this.axios.delete("zt_supplier_delete_user/" + this.current_userid.toString(),
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

            this.dialog_delete_user = false;
            this.is_processing = false;
            return;
          }

          this.showNotify('success', this.$t('AccountPage.user_has_been_deleted_successfully'))

          this.dialog_delete_user = false;
          this.is_processing = false;
          this.getUserList(1)
        }).catch(e => {
          console.log(e);

          this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))

          this.dialog_delete_user = false;
          this.is_processing = false;
        });
      },
      getUserList(refresh = 0){
        if(refresh){
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
      DeleteDlg(userID, userName){
        this.current_userid = userID;
        this.current_username = userName;
        this.dialog_delete_user=true;
      },
      AddDlg(){
        this.current_userid = 0;
        this.current_username = '';
        // this.current_email = '';
        this.current_password = '';
        this.confirm_password = '';
        this.dialog_add_user = true;
      },
      ModifyDlg(userID, userName, status, isLiveActive, isSystmePlay, Password){
        this.current_userid = userID;
        this.current_username = userName;
        // this.current_email = Email;
        this.current_password = Password;
        this.confirm_password = '';
        this.dialog_modify_user=true;
        this.statusCheck = status;
        this.liveActiveCheck = isLiveActive;
        this.systemPlayCheck = isSystmePlay;
      },
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
    },
    computed: {
      filter_users() {
        return this.users.filter((item,i)=>{
          return item.username.toLowerCase().includes(this.filter_user_name.toLowerCase());
        });
      }
    },
    created(){
      window.addEventListener('scroll', this.onMainScrollPos);
    },
    mounted(){
      this.getUserList()
    }
  }
</script>
