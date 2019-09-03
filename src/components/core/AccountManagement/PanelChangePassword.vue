<template>
  <v-card id="p_chpwd" class="ma-0 pa-0 card-account">
    <v-card-title>
      <div class="subheading font-weight-medium">
        {{$t('AccountPage.change_password')}}
      </div>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-container class="ma-0" style="max-width: 800px;">
          <v-layout>
            <v-flex xs12>
              <v-text-field v-model="old_password"
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required]"
                            :type="show2 ? 'text' : 'password'"
                            counter
                            @click:append="show2 = !show2"
                            :label='$t("AccountPage.old_password")+"*"' required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-text-field v-model="current_password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            counter
                            @click:append="show1 = !show1"
                            :label='$t("AccountPage.new_password")+"*"' :hint='$t("AccountPage.min_8_characters")' required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-text-field v-model="confirm_password"
                            :rules="[rules.required, rules.pwdMatch]"
                            :type="show1 ? 'text' : 'password'"
                            counter
                            :label='$t("AccountPage.password_repeat")+"*"' required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12></v-flex>
            <v-flex xs12></v-flex>
            <v-flex xs12>
              <v-btn color="primary"
                      :disabled="is_processing"
                      @click.stop="update_password"
              >{{$t('AccountPage.change_password')}}</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
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
        is_processing:false,
        current_password:'',
        confirm_password:'',
        old_password:'',
        show1: false,
        show2: false,
        rules: {
            required: value => !!value || this.$t('AccountPage.required'),
            min: v => v.length >= 8 || this.$t('AccountPage.required'),
            pwdMatch: v=> this.current_password == v || this.$t('AccountPage.password_is_mismatched')
        },
      valid: true,

      color_type:'',
      snackbar: false,
      alertMessage: '',
    }
  },
  mounted() {
  },
  methods: {
    update_password(){
      if(this.valid == false)
          return;
      if(this.current_password != this.confirm_password)
      {
          this.showNotify('warn', this.$t('AccountPage.new_password_is_mismatched'))
          return;
      }
      this.is_processing = true;
      this.axios.put("zt_update_password/" + this.$store.getters.getUserId.toString(),
          {
              oldPassword: this.old_password,
              newPassword: this.current_password,
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

              this.is_processing = false;
              return;
          }

          this.showNotify('error', this.$t('AccountPage.password_has_been_updated_successfully'))

          this.is_processing = false;
          
      }).catch(e => {
          console.log(e);

          this.showNotify('error', this.$t('AccountPage.server_is_unavailable_now'))
          this.is_processing = false;
      });
    },
    showNotify(type, msg){
      this.color_type = type
      this.alertMessage = msg
      this.snackbar = true
    },
  },
}
</script>

<style scoped></style>
