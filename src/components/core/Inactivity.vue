<template>
    <v-dialog v-model="showIdleDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">SessionTimeOut</v-card-title>
        <v-card-text>Refresh Page.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="setActivityTime">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
  data() {
    return {
        idleTime:0,
        showIdleDialog: false,
    }
  },
  methods: {
    setIdleTime(){
        this.idleTime = this.idleTime + 1
        if(this.idleTime >= 5 * 60){
            this.$root.$emit('closeAllSocket')
            clearInterval(localStorage.idleTimer)
            localStorage.idleTimer = ''
            this.showIdleDialog = true
        }
    },
    setActivityTime(){
        this.showIdleDialog = false
        location.reload()
    },
    resetIdleTime(){
        this.idleTime = 0
    },
    timerSet(){
        var self = this
        if(localStorage.idleTimer != undefined && localStorage.idleTimer != ''){
            clearInterval(localStorage.idleTimer)
        }
        localStorage.idleTimer = setInterval(function(){
            self.setIdleTime()
        }, 1000)
    }
  },
  mounted() {
      this.timerSet()
  },
  created(){
      window.addEventListener('mousemove', this.resetIdleTime)
      window.addEventListener('mousedown', this.resetIdleTime)
      window.addEventListener('mousewheel', this.resetIdleTime)
      window.addEventListener('touchmove', this.resetIdleTime)
      window.addEventListener('keypress', this.resetIdleTime)
  }
  
};
</script>

<style>
</style>
