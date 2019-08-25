<template></template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    closeOverviewSocket() {
      if (localStorage.socketChannelOverview == undefined || localStorage.socketChannelOverview == '')
        return;
      // console.log("closeOverviewSocket", localStorage.socketChannelOverview)
      window.Echo.leave(localStorage.socketChannelOverview)
      localStorage.socketChannelOverview = "";
    },
    closeEventviewSocket() {
      if (localStorage.socketChannelEventDetail == undefined || localStorage.socketChannelEventDetail == '')
        return;
      // console.log("closeEventviewSocket", localStorage.socketChannelEventDetail)
      window.Echo.leave(localStorage.socketChannelEventDetail)
      // window.Echo.private(localStorage.socketChannelEventDetail).stopListening(
      //   "LiveEventDetailSent",
      //   e => {
      //     console.log("CloseLiveEventDetailSent");
      //     console.log(e);
      //     // this.messages.push({
      //     //   message: e.message.message
      //     // });
      //   }
      // );
      localStorage.socketChannelEventDetail = "";
    },
    closeLiveEventScoreSocket() {
      if (localStorage.socketChannelEventScore == undefined || localStorage.socketChannelEventScore == '')
        return;
      // console.log("closeLiveEventScoreSocket", localStorage.socketChannelEventScore)
      window.Echo.leave(localStorage.socketChannelEventScore)
      // window.Echo.private(localStorage.socketChannelEventScore).stopListening(
      //   "LiveEventDetailSent",
      //   e => {
      //     console.log("CloseLiveEventDetailSent");
      //     console.log(e);
      //     // this.messages.push({
      //     //   message: e.message.message
      //     // });
      //   }
      // );
      localStorage.socketChannelEventScore = "";
    },
    closeBetslipSocket() {
      if (localStorage.socketChannelBetslip == undefined || localStorage.socketChannelBetslip == '')
        return;
      // console.log("closeBetslipSocket", localStorage.socketChannelBetslip)
      window.Echo.leave(localStorage.socketChannelBetslip)
      // window.Echo.private(localStorage.socketChannelBetslip).stopListening(
      //   "LiveSportDetailSent",
      //   e => {
      //     // console.log("CloseLiveSportDetailSent");
      //     console.log(e);
      //     // this.messages.push({
      //     //   message: e.message.message
      //     // });
      //   }
      // );
      localStorage.socketChannelBetslip = "";
    },
    closeSocket() {
      this.closeOverviewSocket();
      this.closeEventviewSocket();
      this.closeLiveEventScoreSocket();
      this.closeBetslipSocket();
    }
  },
  mounted() {
      this.closeSocket()
      this.$root.$on('closeAllSocket', ()=>{
        this.closeSocket()
      })
  }
};
</script>

<style>
</style>
