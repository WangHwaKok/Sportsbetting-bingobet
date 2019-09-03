<template>
  <v-card id="p_printer" class="ma-0 pa-0 card-account">
    <v-card-title>
      <div class="subheading font-weight-medium">
        {{$t('AccountPage.printer_settings')}}
      </div>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <v-container class="ma-0" style="max-width: 800px;">
          <v-layout>
            <v-flex xs3>
              <v-subheader>Printer Mode:</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-autocomplete solo></v-autocomplete>
            </v-flex>
            <v-flex xs6>
              <v-btn color="primary" class="ma-0 ml-5" style="height: 40px"
                >Preview</v-btn
              >
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs3>
              <v-subheader>Coupon Style:</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-autocomplete solo></v-autocomplete>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs3>
              <v-subheader>% Deduction:</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-text-field solo></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs3>
              <v-subheader>Show Coupon Interruption:</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-autocomplete solo></v-autocomplete>
            </v-flex>
            <v-flex xs6>
              <v-subheader style="color: green">
                * Commission breaks the coupon!
              </v-subheader>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs3>
              <v-subheader>Koupon Yer Alacak Notlar:</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-textarea id="textarea_coupon" solo></v-textarea>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs3>
              <v-subheader>Currency:</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-autocomplete solo></v-autocomplete>
            </v-flex>
            <v-flex xs6>
              <v-subheader style="color: green"
                >* Prints the specified currency (£, €, $, TL)</v-subheader
              >
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs3></v-flex>
            <v-flex xs3></v-flex>
            <v-flex xs6>
              <v-btn color="primary" class="ml-5">Update Settings</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      valid: true
    }
  }
}
</script>
