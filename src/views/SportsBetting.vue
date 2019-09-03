<template>
  <v-app style="min-width:1280px;background: url('/img/bingo_bet.jpg'); background-size: 100% 100%;">
    <!-- <core-filter /> -->
    <v-content class="main-content">
      <core-header/>
      <core-socket/>
      <core-inactivity/>
      <div id="core-view" style="background:black;">
        <v-fade-transition mode="out-in">
          <v-layout class="sports-betting-view pb-1" fill-height style="background: url('/img/bingo_bet.jpg'); background-size: 100% 100%;">
            <v-flex class="pl-1 mt-2 scroll-y" style="width:200px">
              <v-card color="primary" class="sports-tree">
                <v-card-title class="pa-1" style="padding-right:5px;">
                  <span class="subheading font-weight-bold">{{$t('Betting.sports')}}</span>
                </v-card-title>
                <core-sports-betting-tree-list/>
              </v-card>
            </v-flex>

            <v-flex xs8 class="mid-panel mx-1 mt-2 scroll-y" id="main-scroll" ref="matchTable">
              <v-layout v-if="!is_refresh_page" column class="pa-0" v-scroll:#main-scroll="onMainScrollPos" >
                <v-card color="black" height="60" class="overflow-hidden mb-3">
                  <v-img
                    :src="`/img/prematch_banner/${getBoardSportImage()}.png`"
                    height="120"
                    width="120"
                    class="prematch-game-img"
                  ></v-img>
                  <div class="d-flex align-center justify-start">
                    <img :src="`/img/prematch_banner/${getBoardSportImage()}_small.png`" height="19" width="19" style="margin-left:1rem;"/>
                    <v-subheader class="board-name headline ma-2 px-0">{{getBoardSportName()}}</v-subheader>
                    <v-btn-toggle v-model="timeFilterModel" style="margin-right:1rem;">
                      <v-btn>3 {{$t('Betting.hours')}}</v-btn>
                      <v-btn>12 {{$t('Betting.hours')}}</v-btn>
                      <v-btn>{{$t('Betting.today')}}</v-btn>
                      <v-btn>{{$t('Betting.tomorrow')}}</v-btn>
                      <v-btn>{{$t('Betting.all')}}</v-btn>
                    </v-btn-toggle>
                  </div>
                </v-card>
                <v-card dark color="#171717" v-if="prematchListTable[0] == undefined || prematchListTable[0].data == undefined || Object.keys(prematchListTable[0].data).length == 0">
                  <v-card-title>
                    <v-layout align-center justify-center>
                      <div class="subheading">{{$t('Betting.there_are_no_event_yet')}}</div>
                    </v-layout>
                  </v-card-title>
                </v-card>
                <v-expansion-panel v-else v-model="mainPanel" expand>
                  <v-expansion-panel-content class="prematchMainPanel">
                    <template v-slot:actions>
                      <v-icon color="primary">$vuetify.icons.expand</v-icon>
                    </template>
                    <template v-slot:header>
                      <div class="d-flex justify-start align-center pl-2">
                        <img style="margin-right:5px;" :src="`/img/country_flag/${prematchListTable[0].data[0].categoryAlias}.png`" />
                        <div class="body-2 font-weight-bold" style="width:100%;color:#e09007">{{ prematchListTable[0].data[0].categoryName }}</div>
                      </div>
                    </template>
                    <v-expansion-panel v-model="leaguePanel" expand>
                      <v-expansion-panel-content v-for="(table, index) in prematchListTable" :key="index" class="league-panel mb-3">
                        <template v-slot:actions>
                          <v-icon color="primary">$vuetify.icons.expand</v-icon>
                        </template>
                        <template v-slot:header>
                          <v-layout row align-center justify-start>
                            <div class="body-2 font-weight-medium ml-2 mr-2" style="color:#e09007">{{ table.data[0].leagueName }}</div>
                            <v-icon class="mr-1" color="#53442d" style="font-size:1.5rem !important;">mdi-star</v-icon>
                            <img style="margin-right:5px;" :src="`/img/country_flag/${table.data[0].categoryAlias}.png`" />
                            <v-icon color="primary" style="font-size:1.7rem !important;">mdi-chart-bar</v-icon>
                          </v-layout>
                        </template>
                        <v-data-table
                          :id="`table_${index}`"
                          :headers="table.headers"
                          :items="table.data"
                          class="elevation-1"
                          :pagination.sync="pagination"
                          :expand="true"
                          item-key="eventID"
                          hide-actions
                        >
                          <template slot="headers" slot-scope="props">
                            <tr>
                              <th
                                      v-for="(header, id) in props.headers"
                                      :key="id"
                                      :class="`text-xs-${header.align}`"
                                      :width="header.width"
                                      style="color:black;"
                              >
                                <v-layout column v-if="header.cell != undefined">
                                    <v-flex>{{header.text}}</v-flex>
                                  <v-flex>
                                    <v-layout row>
                                      <v-flex
                                              v-for="(cell, cellIndex) in header.cell"
                                              :key="cellIndex"
                                              :class="`xs${12/header.cellCount}`"
                                      >{{cell.name}}</v-flex>
                                    </v-layout>
                                  </v-flex>
                                </v-layout>
                                <span v-else>{{header.text}}</span>
                                <v-layout align-center justify-center v-if="header.sportID || header.countryFlag">
                                  <div v-if="header.sportID"
                                    style="margin-right: 1rem;"
                                    :class="`sport-title-icon ds-sport-icon ds-icon-${header.sportID}`">
                                  </div>
                                  <img
                                    v-if="header.countryFlag"
                                    :src="header.countryFlag"
                                    class="sb-icon"
                                  />
                                </v-layout>
                              </th>
                            </tr>
                          </template>
                          <template v-slot:items="props">
                            <!-- <td class="text-xs-center">{{ props.item.dateTime | moment("DD/MM HH:mm")}}</td> -->
                            <td
                                    class="text-xs-center" style="color:#e09007"
                            >--</td>
                            <td
                                    class="text-xs-center"
                            >{{ props.item.eventDate | moment("HH:mm")}}</td>
                            <td
                                    class="text-xs-center"
                            >{{ props.item.eventDate | moment("DD.MM")}}</td>

                            <td class="text-xs-left" style="color:#e09007">
                              {{props.item.homeTeam}}
                              <br/>
                              {{props.item.awayTeam}}
                            </td>
                            <td
                                    class="text-xs-center"
                                    v-if="oddType = prematchOddTypeRules.oddRules[props.item.sportAlias].oddTypes[0]"
                            >
                              <v-layout row style="height:80%;">
                                <template v-for="(oddCell, oddCellIdx) in prematchOddTypeRules.lineRules[oddType]">
                                  <v-flex d-flex
                                          v-if="props.item.oddTypes[oddType] != undefined && props.item.oddTypes[oddType].lines[0][oddCellIdx] != undefined &&
                                      props.item.oddTypes[oddType].lines[0][oddCellIdx].value > 0 && props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended == 0"
                                          :class="`ma-1 align-center tableCell xs${12/(prematchOddTypeRules.lineRules[oddType].length)} ${is_betslip_odd(props.item.eventID, props.item.oddTypes[oddType].oddTypeID, props.item.oddTypes[oddType].lines[0][oddCellIdx].oddID)?'active':''}`"
                                          @click="update_betslip('prematch', props.item.eventID, props.item.homeTeam, props.item.awayTeam, props.item.oddTypes[oddType].oddTypeID, props.item.oddTypes[oddType].name,
                                      props.item.oddTypes[oddType].lines[0][oddCellIdx].oddID, props.item.oddTypes[oddType].lines[0][oddCellIdx].value, props.item.oddTypes[oddType].lines[0][oddCellIdx].name, props.item.oddTypes[oddType].lines[0][oddCellIdx].special, props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended==undefined?0:props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended)"
                                  >
                                    <div>{{props.item.oddTypes[oddType].lines[0][oddCellIdx].value}}</div>
                                  </v-flex>

                                  <v-flex d-flex
                                          v-else
                                          :class="`ma-1 align-center xs${12/(prematchOddTypeRules.lineRules[oddType].length)}`"
                                  >
                                    <div>
                                      <v-icon color="grey"> mdi-lock-outline</v-icon>
                                    </div>
                                  </v-flex>
                                </template>
                              </v-layout>
                            </td>

                            <td class="text-xs-left">
                              <v-layout row align-center justify-center>
                                <v-chip label small color="#171717" class="chip-table mx-0" @click="gotoEventView(props.item.eventID, eventDetailDialog=true)">
                                  <v-icon color="white" style="cursor:pointer;">mdi-plus</v-icon>
                                </v-chip>
                                <v-chip label small color="#171717" class="chip-table" style="margin-left:2px;" @click="gotoEventView(props.item.eventID, props.expanded = !props.expanded)">
                                  <v-icon color="white" style="cursor:pointer;">mdi-menu-down</v-icon>
                                </v-chip>
                              </v-layout>
                            </td>
                            <td class="text-xs-center">
                              <v-chip label small color="black" class="chip-table">
                                <v-icon color="primary" class="pa-0 ma-0" style="cursor:pointer;">mdi-chart-bar-stacked</v-icon>
                              </v-chip>
                            </td>
                            <td class="text-xs-center">
                              <v-chip label small dark color="#303030">
                                <!-- <div style="cursor:pointer;">{{props.item.marketCount}}</div> -->
                                <div style="cursor:pointer;">0</div>
                              </v-chip>
                            </td>
                          </template>
                          <template v-slot:expand="props">
                            <v-card style="border-radius:0px;background:black">
                              <v-layout v-if="is_waiting_page" justify-center align-center>
                                <FadeLoader
                                    class="fade-loader"
                                    :loading="is_waiting_page"
                                    color="#e09007"
                                    :height=20
                                    :width=10
                                    :radius=20
                                    margin="2px"
                                    sizeUnit="px"
                                />
                              </v-layout>
                              <template v-else>
                                <v-card-title style="padding-top:0px;padding-bottom:0px;background-image: linear-gradient(#b35f0a, #e19107);">
                                  <div class="subheading font-weight-medium" style="color:white">
                                    {{props.item.homeTeam}} - {{props.item.awayTeam}}
                                  </div>
                                  <v-spacer></v-spacer>
                                  <v-btn light small style="margin:0px; margin-right:3px;height:unset; padding:0px;border:1px solid black;background-image:linear-gradient(#eadfd0, #dbccb8)" @click="expandEventDetail(true)">
                                    <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                                    {{$t('Betting.expand')}}
                                  </v-btn>
                                  <v-btn light small style="margin:0px; height:unset; padding:0px;border:1px solid black;background-image:linear-gradient(#eadfd0, #dbccb8)" @click="expandEventDetail(false)">
                                    <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
                                    {{$t('Betting.collapse')}}
                                  </v-btn>
                                  <v-btn icon small @click="props.expanded = !props.expanded" color="#dcaa5d" style="height:unset; padding:0px;">
                                    <v-icon>mdi-close</v-icon>
                                  </v-btn>
                                </v-card-title>
                                <v-card-text style="background:black;">
                                  <v-expansion-panel v-model="eventDetailPanel" expand light>
                                    <v-expansion-panel-content v-for="(oddType, oddTypeIdx) in oddTypeList" :key="oddTypeIdx" class="event-detail-panel eventview" >
                                      <template v-slot:actions>
                                        <v-icon color="primary">$vuetify.icons.expand</v-icon>
                                      </template>
                                      <template v-slot:header>
                                        <div class="d-flex justify-start align-center pl-2">
                                          <div class="body-2 font-weight-bold" style="width:100%;color:#e09007">{{ oddType.name }}</div>
                                        </div>
                                      </template>
                                      <v-flex
                                          v-if="oddType.lines != null"
                                          v-for="(line,index) in oddType.lines"
                                          :key="index"
                                      >
                                        <v-layout xs12 row>
                                          <v-flex
                                                  v-for="(item, idx) in line"
                                                  :key="idx"
                                                  :class="`xs${12/line.length} ma-1 event-detail-cell ${is_betslip_odd(eventViewData.eventID, oddType.oddTypeID, item.oddID)?'active':''}`"
                                                  @click="update_betslip('prematch', eventViewData.eventID, eventViewData.homeTeam, eventViewData.awayTeam, oddType.oddTypeID, oddType.name,
                                              item.oddID, item.value, item.name, item.special, item.isSuspended==undefined?0:item.isSuspended)"
                                          >
                                            <p class="body-2 font-weight-medium pa-1 ma-0 market-odd-name" v-if="item.special != undefined && item.special!= 0">{{item.name}}({{item.special}})</p>
                                            <p class="body-2 font-weight-medium pa-1 ma-0 market-odd-name" v-else>{{item.name}}</p>
                                            <span class="body-2 font-weight-medium pa-1 market-odd-score" v-if="item.isSuspended == 1"><v-icon color="yellow">mdi-lock-outline</v-icon></span>
                                            <span class="body-2 font-weight-medium pa-1 market-odd-score" v-else>{{item.value}}</span>
                                          </v-flex>
                                        </v-layout>
                                      </v-flex>
                                    </v-expansion-panel-content>
                                  </v-expansion-panel>
                                </v-card-text>
                              </template>
                            </v-card>
                          </template>
                        </v-data-table>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-layout>
              <v-layout v-if="is_updating_page || is_refresh_page" justify-center align-center>
                  <FadeLoader
                          class="fade-loader"
                          :loading="is_updating_page || is_refresh_page"
                          color="#e09007"
                          :height=20
                          :width=10
                          :radius=20
                          margin="2px"
                          sizeUnit="px"
                  />
              </v-layout>
            </v-flex>

            <v-flex xs2 class="mr-1 mt-2 scroll-y" style="overflow-x:hidden;min-width:250px;">
              <core-bet-slip/>
            </v-flex>
          </v-layout>
        </v-fade-transition>
        <core-footer/>
      </div>
    </v-content>
    <v-dialog v-model="eventDetailDialog" scrollable max-width="1100px">
      <v-layout v-if="is_waiting_page" justify-center align-center>
        <FadeLoader
            class="fade-loader"
            :loading="is_waiting_page"
            color="#e09007"
            :height=20
            :width=10
            :radius=20
            margin="2px"
            sizeUnit="px"
        />
      </v-layout>
      <v-card v-else color="black" class="pa-1">
        <v-card-title style="background-image:linear-gradient(#39434c, #29333c, #39434c)" class="pa-1">
          <v-layout justify-start align-start fill-height>
            <div style="background:#596167;color:white;margin-right:30px;margin-left:30px;border:1px; border-radius:3px;" class="body-1 font-weight-medium pa-1">
              {{eventViewData.homeTeam}} - {{eventViewData.awayTeam}}
            </div>
            <div style="color:white;" class="body-2 font-weight-medium pa-1">
              {{eventViewData.eventDate | moment("DD/MM")}}-{{eventViewData.eventDate | moment("HH:mm")}}
            </div>
            <v-spacer></v-spacer>
            <v-chip label small color="#cfd1d2" class="chip-event-detail ma-0" @click="expandEventDetail(true)">
              <v-icon color="#303030" style="cursor:pointer;">mdi-plus</v-icon>
            </v-chip>
            <v-chip label small color="#cfd1d2" class="chip-event-detail ma-0" @click="expandEventDetail(false)">
              <v-icon color="#303030" style="cursor:pointer;">mdi-minus</v-icon>
            </v-chip>
            <v-chip label small color="#cfd1d2" class="chip-event-detail ma-0" @click="eventViewData = false">
              <v-icon color="#303030" style="cursor:pointer;">mdi-close</v-icon>
            </v-chip>
          </v-layout>
        </v-card-title>
        <v-card-text style="background:#171717">
          <v-expansion-panel v-model="eventDetailPanel" expand light>
            <v-expansion-panel-content v-for="(oddType, oddTypeIdx) in oddTypeList" :key="oddTypeIdx" class="event-detail-dialog-panel eventview" >
              <template v-slot:actions>
                <v-icon color="primary">$vuetify.icons.expand</v-icon>
              </template>
              <template v-slot:header>
                <div class="d-flex justify-start align-center pl-2">
                  <div class="body-2 font-weight-bold" style="width:100%;color:#e09007">{{ oddType.name }}</div>
                </div>
              </template>
              <v-flex
                  v-if="oddType.lines != null"
                  v-for="(line,index) in oddType.lines"
                  :key="index"
              >
                <v-layout xs12 row>
                  <v-flex
                          v-for="(item, idx) in line"
                          :key="idx"
                          :class="`xs${12/line.length} ma-1 event-detail-cell ${is_betslip_odd(eventViewData.eventID, oddType.oddTypeID, item.oddID)?'active':''}`"
                          @click="update_betslip('prematch', eventViewData.eventID, eventViewData.homeTeam, eventViewData.awayTeam, oddType.oddTypeID, oddType.name,
                      item.oddID, item.value, item.name, item.special, item.isSuspended==undefined?0:item.isSuspended)"
                  >
                    <p class="body-2 font-weight-medium pa-1 ma-0 market-odd-name" v-if="item.special != undefined && item.special!= 0">{{item.name}}({{item.special}})</p>
                    <p class="body-2 font-weight-medium pa-1 ma-0 market-odd-name" v-else>{{item.name}}</p>
                    <span class="body-2 font-weight-medium pa-1 market-odd-score" v-if="item.isSuspended == 1"><v-icon color="yellow">mdi-lock-outline</v-icon></span>
                    <span class="body-2 font-weight-medium pa-1 market-odd-score" v-else>{{item.value}}</span>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import moment from 'moment-timezone'
import { constants } from 'crypto';
import { parse } from 'path';
  export default {
    data() {
      return {
        topLeagues: [],
        leaguePanel: [],
        prematchListTable: [],
        liveListTable: [],
        pagination: {
          rowsPerPage: -1
        },
        mainPanel: [true],
        pageNumber: 1,
        sportID: "",
        leagueID: "",
        categoryID: "",
        timeFilter: "",
        searchPrematchStr: "",
        times: 0,
        eventViewFlag: 0,
        eventViewData: [],
        toggle_kinds: 0,
        oddGroups: [],
        oddTypeList: [],
        rowOddCount: 0,
        prematchOddTypeRules: {
          lineRules:{},
          oddNames:{},
          oddRules:{},
        },
        is_updating_page: false,
        is_last_page: false,
        is_refresh_page: true,
        is_waiting_page: false,
        selectedSportIds: '',
        selectedCategoryIds: '',
        selectedLeagueIds: '',
        menuSelected: false,
        searchSportItem: '',
        prematchFavourites: [],
        marketRow: 1,
        closingMinuteBetting: '',
        hasSize:0,
        timeFilterModel: '',
        eventDetailPanel:[],
        eventDetailDialog: false,
      };
    },
    methods: {
      toggleTable(tableId) {
        let element = document.querySelector(`#${tableId} tbody`);
        if (!element) return;
        let computedStyle = window.getComputedStyle(element);
        let displayValue = computedStyle.getPropertyValue("display");
        if (displayValue === "none") displayValue = "table-row-group";
        else displayValue = "none";
        element.style.display = displayValue;
      },
      getUpcomingResult(pagination = false) {

        // console.log(this.prematchOddTypeRules)

        // if(this.prematchOddTypeRules.oddRules.length == 0)
        //   return
        // this.is_updating_page = true
        // this.axios
        //         .post("zt_prematch_list", {
        //                   sportID: this.sportID,
        //                   timeFilter: this.timeFilter,
        //                   userID: this.$store.getters.getUserId,
        //                   // categoryID: this.categoryID,
        //                   // leagueID: this.leagueID,
        //                   query: this.searchPrematchStr,
        //                   page: this.pageNumber
        //                 },
        //                 {
        //                   headers: {
        //                     "X-localization": this.$store.getters.getLanguage
        //                   }
        //                 })
        //         .then(response => {
        //           if(response.data.success == undefined){
        //             console.log('getPrematchList error')
        //           }
        //           else{
        //             // console.log("call once", pagination)
        //             var apiData = response.data.success.data;
        //             if(apiData.leagues.length == 0){
        //               this.is_last_page = true
        //               this.is_updating_page = false
        //               this.prematchListTable = [{headers:[], data:[]}]
        //               return;
        //             }

        //             if(!pagination){
        //               this.prematchListTable = [{headers:[], data:[]}];
        //               var headers = [
        //                 {
        //                   sportID: apiData.leagues[0].sportID,
        //                   width: "10%",
        //                   align: "center"
        //                 },
        //                 {
        //                   text: apiData.leagues[0].sportName,
        //                   align: "left",
        //                   width: "*"
        //                 },
        //                 { text: "MBS", align: "center", width: "5%" }
        //               ];

        //               if(this.prematchOddTypeRules.oddRules[apiData.leagues[0].sportAlias] != undefined){
        //                 var self = this
        //                 this.prematchOddTypeRules.oddRules[apiData.leagues[0].sportAlias].oddTypes.forEach(function(oddType, oddIndex, Object){
        //                   var partHeader = {}
        //                   partHeader.text = self.prematchOddTypeRules.oddNames[oddType]
        //                   partHeader.align = "center"
        //                   var specialCell = self.prematchOddTypeRules.oddRules[apiData.leagues[0].sportAlias].hasSpecial[oddIndex] ? 1 : 0
        //                   partHeader.specialCell = specialCell
        //                   partHeader.cellCount = self.prematchOddTypeRules.lineRules[oddType].length + specialCell
        //                   partHeader.width = (partHeader.cellCount)*5 + "%"
        //                   partHeader.cell = self.prematchOddTypeRules.lineRules[oddType]
        //                   headers.push(partHeader)
        //                 });
        //               }

        //               headers.push({
        //                 text: "+",
        //                 align: "center",
        //                 width: "5%"
        //               });
        //               headers.push({
        //                 text: "",
        //                 align: "center",
        //                 width: "5%"
        //               });

        //               this.prematchListTable[0].headers = headers
        //             }

        //             var data = []
        //             apiData.leagues.forEach(league => {

        //               if(league.events != undefined && league.events.length > 0){
        //                 league.events.forEach(event => {
        //                   var dataItem = {
        //                     leagueID: league.leagueID,
        //                     sportID: league.sportID,
        //                     sportAlias: league.sportAlias,
        //                     categoryAlias: league.categoryAlias,
        //                     categoryName: league.categoryName,
        //                     leagueName: league.leagueName,
        //                     mbs: league.mbs,

        //                     eventID: event.eventID,
        //                     eventDate: event.eventDate,
        //                     marketCount: event.marketCount,
        //                     homeTeam: event.homeTeam,
        //                     awayTeam: event.awayTeam,

        //                     // oddTypes: event.oddTypes,
        //                     oddTypes: {}
        //                   }
        //                   event.oddTypes.forEach(oddType => {
        //                     dataItem.oddTypes[oddType.alias] = oddType
        //                   })
        //                   data.push(dataItem)
        //                 })
        //               }
        //             })
        //             this.prematchListTable[0].data = this.prematchListTable[0].data.concat(data)
        //             // console.log(this.prematchListTable[0].data.length)
        //             // this.prematchListTable[0].data = data

        //             // console.log(this.prematchListTable)
        //             this.is_updating_page = false
        //           }

        //         })
        //         .catch(e => {
        //           console.log(e);
        //         });
      },
      getLiveList() {

        this.axios
                .post(
                        "zt_live_list",
                        {
                          sportID: this.sportID,
                          timeFilter: this.timeFilter,
                          userID: this.$store.getters.getUserId,
                          eventID: "",
                          // categoryID: this.categoryID,
                          leagueID: this.leagueID,
                          query: this.searchPrematchStr,
                          page: this.pageNumber
                        },
                        {
                          headers: {
                            "X-localization": this.$store.getters.getLanguage
                          }
                        }
                )
                .then(response => {
                  if(response.data.success != undefined){
                    this.setLiveList(response.data.success.data)
                  }
                  else{
                    console.log("getLiveList error")
                  }

                })
                .catch(e => {
                  console.log(e);
                });
      },
      getTopLeagues() {
        this.topLeagues = []
        this.axios
          .post(
              "zt_prematch_top_leagues",
              {},
              {
                headers: {
                  "X-localization": this.$store.getters.getLanguage
                }
              }
          )
          .then(response => {
            if (response.data.success != undefined) {

              if (response.data.success.data != "") {

                response.data.success.data.forEach(league => {

                  var leaguePartTable = {
                    count: league.total,
                    name: league.name,
                    icon: '/img/leagues/'+league.icon,
                    leagueID: league.leagueID,
                    categoryID: league.categoryID,
                    sportID: league.sportID
                  };

                  this.topLeagues.push(leaguePartTable);

                });
              }


            } else {
              console.log("getTopLeagues error");
            }

          })
          .catch(e => {
            console.log(e);
          });
      },
      searchPrematchList() {
        // if (this.searchPrematchStr.length == 0) {
        //   return
        // }
        this.pageNumber = 1
        this.is_updating_page = false
        this.is_last_page = false
        this.mainPanel = [true, true]
        this.getUpcomingResult()
      },
      gotoEventView(eventID) {
          this.is_waiting_page = true
          this.oddTypeList = [];
          this.oddGroups = [];
          this.eventViewData = [];
          this.axios
            .post(
                "zt_prematch_single",
                {
                  eventID: eventID
                },
                {
                  headers: {
                    "X-localization": this.$store.getters.getLanguage
                  }
                }
            )
            .then(response => {
              this.eventViewData = response.data.success.data;
              if (this.eventViewData.oddGroups != null && this.eventViewData.oddGroups.length > 0) {
                var self = this
                this.eventViewData.oddGroups.sort(function(a, b){
                    return parseInt(a.order) - parseInt(b.order)
                  }).forEach(oddGroup => {
                  // console.log(oddGroup)
                  self.oddGroups.push(oddGroup);
                  if (oddGroup.oddTypes != null && oddGroup.oddTypes.length > 0) {
                    oddGroup.oddTypes.sort(function(a, b){
                      return parseInt(a.order) - parseInt(b.order)
                    }).forEach(oddType => {
                      self.oddTypeList.push(oddType);
                    });
                  }
                });
                // if (this.oddTypeList != null && this.oddTypeList.length > 0)
                //   this.rowOddCount = Math.round(this.oddTypeList.length / this.marketRow);
                // console.log(this.oddTypeList)
                this.eventDetailPanel = [...this.oddTypeList].map(_ => true)
              }

              this.is_waiting_page = false
            })
            .catch(e => {
              console.log(e);
            });

      },
      topLeagueSelected(sportID, categoryID, leagueID){
        this.prematchListTable = []
        this.selectedSportIds = []
        this.selectedCategoryIds = []
        this.selectedLeagueIds = []
        this.selectedSportIds.push(sportID)
        this.selectedCategoryIds.push(categoryID)
        this.selectedLeagueIds.push(leagueID)
        this.menuSelected = true
        this.pageNumber = 1
        this.is_updating_page = false
        this.is_last_page = false

        this.leftMenuSelected(false)
      },
      leftMenuSelected(pagination = false) {
        if(this.prematchOddTypeRules.oddRules.length == 0)
          return
        this.is_updating_page = true
        this.axios
                .post("zt_prematch_list", {
                          sportID: this.selectedSportIds.join(),
                          timeFilter: this.timeFilter,
                          userID: this.$store.getters.getUserId,
                          eventID: "",
                          categoryID: this.selectedCategoryIds.join(),
                          leagueID: this.selectedLeagueIds.join(),
                          query: this.searchPrematchStr,
                          page: this.pageNumber
                        },
                        {
                          headers: {
                            "X-localization": this.$store.getters.getLanguage
                          }
                        })
                .then(response => {
                  if(response.data.success == undefined){
                    console.log('getPrematchList error')
                  }
                  else{
                    // console.log("call once", pagination)
                    if(!pagination){
                      this.prematchListTable = [];
                    }
                    var apiData = response.data.success.data;
                    if(apiData.leagues.length == 0){
                      this.is_last_page = true
                      this.is_updating_page = false
                      if(!pagination){
                        this.prematchListTable = [{headers:[], data:[]}];
                      }
                      return;
                    }



                    apiData.leagues.forEach(league => {
                      var data = []
                      var headers = [
                        { text: 'H', align:'center', width:'5%' },
                        { text: this.$t('Betting.time'), align:'center', width:'5%' },
                        { text: this.$t('Betting.date'), align:'center', width:'5%' },
                        { text: this.$t('Betting.event'), align:'left', width:'*' },
                      ];

                      if(this.prematchOddTypeRules.oddRules[league.sportAlias] != undefined){
                        var self = this
                        // this.prematchOddTypeRules.oddRules[league.sportAlias].oddTypes.forEach(function(oddType, oddIndex, Object){
                        //   var partHeader = {}
                        //   partHeader.text = self.prematchOddTypeRules.oddNames[oddType]
                        //   partHeader.align = "center"
                        //   // var specialCell = self.prematchOddTypeRules.oddRules[league.sportAlias].hasSpecial[oddIndex] ? 1 : 0
                        //   partHeader.specialCell = specialCell
                        //   partHeader.cellCount = self.prematchOddTypeRules.lineRules[oddType].length + specialCell
                        //   partHeader.width = (partHeader.cellCount)*5 + "%"
                        //   partHeader.cell = self.prematchOddTypeRules.lineRules[oddType]
                        //   headers.push(partHeader)
                        // });
                        var oddType = this.prematchOddTypeRules.oddRules[league.sportAlias].oddTypes[0]
                        var partHeader = {}
                        partHeader.text = self.prematchOddTypeRules.oddNames[oddType]
                        partHeader.align = "center"
                        // var specialCell = self.prematchOddTypeRules.oddRules[league.sportAlias].hasSpecial[oddIndex] ? 1 : 0
                        var specialCell = 0
                        // partHeader.specialCell = specialCell
                        partHeader.cellCount = self.prematchOddTypeRules.lineRules[oddType].length + specialCell
                        partHeader.width = (partHeader.cellCount)*15 + "%"
                        partHeader.cell = self.prematchOddTypeRules.lineRules[oddType]
                        headers.push(partHeader)
                      }

                      headers.push({
                        text: this.$t('Betting.another'),
                        align: "left",
                        width: "5%"
                      });
                      headers.push({
                        text: '',
                        align: "center",
                        width: "5%"
                      });
                      headers.push({
                        text: this.$t('Betting.min'),
                        align: "center",
                        width: "5%"
                      });

                      if(league.events != undefined && league.events.length > 0){
                        league.events.forEach(event => {
                          var dataItem = {
                            leagueID: league.leagueID,
                            sportID: league.sportID,
                            sportAlias: league.sportAlias,
                            categoryAlias: league.categoryAlias,
                            categoryName: league.categoryName,
                            leagueName: league.leagueName,
                            mbs: league.mbs,

                            eventID: event.eventID,
                            eventDate: event.eventDate,
                            marketCount: event.marketCount,
                            homeTeam: event.homeTeam,
                            awayTeam: event.awayTeam,

                            // oddTypes: event.oddTypes,
                            oddTypes: {}
                          }

                          event.oddTypes.forEach(oddType => {
                            dataItem.oddTypes[oddType.alias] = oddType
                          })
                          data.push(dataItem)
                        })
                      }
                      // this.prematchListTable[0].data = this.prematchListTable[0].data.concat(data)
                      this.prematchListTable.push({headers: headers, data: data})
                    })
                    // console.log(this.prematchListTable[0].data.length)
                    // this.prematchListTable[0].data = data

                    // console.log(this.prematchListTable)
                    this.leaguePanel = [...this.prematchListTable].map(_ => true)
                    this.is_updating_page = false
                  }
                })
                .catch(e => {
                  console.log(e);
                });
      },
      backToPremath() {
        this.eventViewFlag = 0;
        this.toggle_kinds = 0
        this.mainPanel = [true, true]
      },
      topMenuSelected(sportID) {
        this.clearSportItems()

        this.sportID = sportID;

        this.pageNumber = 1
        this.is_updating_page = false
        this.is_last_page = false
        this.menuSelected = false
        this.mainPanel = [true, true]

        this.getUpcomingResult();
        this.getLiveList();
        this.connectOverviewSocket();


      },
      getLanguage(){
        return  this.$store.getters.getLanguage ? this.$store.getters.getLanguage : 'en'

      },
      updatePrematchOddTypeRules(){

        this.prematchOddTypeRules.lineRules = this.$store.getters.getOddTypeLineRulesprematch
        this.prematchOddTypeRules.oddRules = this.$store.getters.getOddTypeOddRulesprematch
        this.prematchOddTypeRules.oddNames = this.$store.getters.getOddTypeOddNamesprematch

        this.pageNumber = 1
        this.is_updating_page = false
        this.is_last_page = false
        if (this.$store.getters.getSports != undefined && this.$store.getters.getSports.length > 0) {
          if(this.sportID == "")
            this.sportID = this.$store.getters.getSports[0].sportID;
          if(this.selectedSportIds == undefined || this.selectedSportIds.length == 0){
            this.selectedSportIds = []
            this.selectedSportIds.push(this.$store.getters.getSports[0].sportID)
          }
          
          this.is_refresh_page = false
          this.getUpcomingResult()
        }
      },
      onMainScrollPos(e){
        // console.log('yes')
        // console.log(e.target.scrollTop, e.target.scrollHeight, e.target.offsetHeight)
        let scrollBottom = e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight
        if(scrollBottom){
          if(this.is_updating_page == true || this.is_last_page == true){
            return
          }

          this.pageNumber ++
          // console.log(this.pageNumber)
          if(this.menuSelected){
            this.leftMenuSelected(true)
          }
          else{
            this.getUpcomingResult(true)

          }
        }

      },
      is_betslip_odd(eventID, oddTypeID, oddID){
        var betslip_array = {};
        if(localStorage.betslip_array)
          betslip_array = JSON.parse(localStorage.betslip_array);
        if(betslip_array[eventID] && betslip_array[eventID][oddTypeID] && betslip_array[eventID][oddTypeID][oddID])
          return true;
        return false;
      },
      update_betslip(type, eventID, homeTeam, awayTeam, oddTypeID, oddTypeName, oddID, oddValue, pick, special, isSuspended = 0){
        if(isSuspended == 1){
          // console.log('suspended')
          return
        }
        // console.log(eventID, oddTypeID, oddID)
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
          this.$root.$emit('update-bet-slip');
          this.$forceUpdate();
          return;
        }


        if(!betslip_array[eventID])
          betslip_array[eventID] = {};

        if(!betslip_array[eventID][oddTypeID])
          betslip_array[eventID][oddTypeID] = {};

        betslip_array[eventID][oddTypeID][oddID] = {
          type: type,
          eventID: eventID,
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          oddTypeID: oddTypeID,
          oddTypeName: oddTypeName,
          oddID: oddID,
          oddValue: oddValue,
          changes: "",
          pick:pick,
          special: special,
          potentialReturns:"0",
          isSuspended: false,
          hasError: false,
        };

        localStorage.betslip_array = JSON.stringify(betslip_array);
        this.$root.$emit('update-bet-slip');
        this.$forceUpdate();
      },
      getPrematchFavourites(){
        if(localStorage.prematchFavouriteAry != undefined && localStorage.prematchFavouriteAry.length > 0)
          this.prematchFavourites = JSON.parse(localStorage.prematchFavouriteAry)
        else
          this.prematchFavourites = []
        this.$forceUpdate()
      },
      clearSportItems(){
        this.prematchFavourites = []
        localStorage.prematchFavouriteAry = []
        this.$root.$emit('clearSportItems')
        this.is_last_page = false
        this.is_updating_page = false
        this.menuSelected = false
        this.getUpcomingResult();
        this.mainPanel = [true, true]
      },
      selectPrematchFavourite(favourite, idx){
        if(favourite.checked == "on"){
          this.prematchFavourites[idx].checked = "off"
        }
        else{
          this.prematchFavourites[idx].checked = "on"
        }
        localStorage.prematchFavouriteAry = JSON.stringify(this.prematchFavourites)
        this.selectedSportIds = []
        this.selectedCategoryIds = []
        this.selectedLeagueIds = []
        this.is_updating_page = false
        this.is_last_page = false
        var searchItem = false
        this.prematchFavourites.forEach(favourite => {
          if(favourite.checked == "on"){
            searchItem = false
            this.selectedSportIds.find(function(sportid, i){
              if(sportid == favourite.sportID){
                searchItem = true
                return
              }
            })
            if(!searchItem){
              this.selectedSportIds.push(favourite.sportID)
            }
            searchItem = false
            this.selectedCategoryIds.find(function(categoryid, i){
              if(categoryid == favourite.categoryID){
                searchItem = true
                return
              }
            })
            if(!searchItem){
              this.selectedCategoryIds.push(favourite.categoryID)
            }
            this.selectedLeagueIds.push(favourite.leagueID)
          }
        })
        // console.log(this.selectedSportIds)
        // console.log(this.selectedCategoryIds)
        // console.log(this.selectedLeagueIds)
        // return
        if(this.selectedSportIds.length > 0){
          this.menuSelected = true
          this.leftMenuSelected()
        }
        else{
          this.menuSelected = false
          this.getUpcomingResult()
          this.mainPanel = [true, true]
        }
      },
      removeFavourite(favourite, idx){
        this.prematchFavourites.splice(idx, 1)
        localStorage.prematchFavouriteAry = JSON.stringify(this.prematchFavourites)
        if(this.prematchFavourites.length == 0){
          this.is_updating_page = false
          this.is_last_page = false
          this.menuSelected = false
          this.getUpcomingResult()
          this.mainPanel = [true, true]
        }
        this.$root.$emit('removeFavourite')
      },
      selectMarketRow(row){
        this.marketRow = row
        this.changeOddGroup(this.toggle_kinds)
      },
      changeOddGroup(selectCell){
        this.oddTypeList = [];
        // console.log(this.toggle_kinds)
        if (this.oddGroups != null && this.oddGroups.length > 0) {
          var self = this
          if (selectCell == 0) {
            this.oddGroups.forEach(oddGroup => {
              if (oddGroup.oddTypes != null && oddGroup.oddTypes.length > 0) {
                oddGroup.oddTypes.sort(function(a, b){
                  return parseInt(a.order) - parseInt(b.order)
                }).forEach(oddType => {
                  self.oddTypeList.push(oddType);
                });
              }
            });
          } else {
            if (this.oddGroups[selectCell - 1].oddTypes != null && this.oddGroups[selectCell - 1].oddTypes.length > 0) {
              this.oddGroups[selectCell - 1].oddTypes.sort(function(a, b){
                return parseInt(a.order) - parseInt(b.order)
              }).forEach(oddType => {
                self.oddTypeList.push(oddType);
              });
            }
          }
          if (this.oddTypeList != null && this.oddTypeList.length > 0)
            this.rowOddCount = Math.round(this.oddTypeList.length / this.marketRow);
        }
      },
      setHasSize(){
        if (window.innerWidth >= 1450) {
          this.hasSize = 0
        }
        else if(window.innerWidth >= 1350){
          this.hasSize = 1
        }
        else {
          this.hasSize = 2
        }
      },
      getBoardSportName(){
        if(this.$store.getters.getSports != undefined && this.$store.getters.getSports.length > 0){
          var sportIdx = -1
          this.$store.getters.getSports.find((sport, index) =>{
            if(sport.sportID == this.selectedSportIds[0]){
              sportIdx = index
              return sportIdx
            }
          })
          if(sportIdx != -1){
            return this.$store.getters.getSports[sportIdx].name
          }
        }
        return ''
      },
      getBoardSportImage(){
        if(this.$store.getters.getSports != undefined && this.$store.getters.getSports.length > 0){
          var sportIdx = -1
          this.$store.getters.getSports.find((sport, index) =>{
            if(sport.sportID == this.selectedSportIds[0]){
              sportIdx = index
              return sportIdx
            }

          })
          if(sportIdx != -1){
            return this.$store.getters.getSports[sportIdx].alias
          }
        }
        return ''
      },
      expandEventDetail(flag){
        if(flag)
          this.eventDetailPanel = [...this.oddTypeList].map(_ => true)
        else
          this.eventDetailPanel = [...this.oddTypeList].map(_ => false)
      }
    },
    watch: {
      toggle_kinds: function(selectCell) {
        this.changeOddGroup(selectCell)
      },
      times: function() {
        this.$root.$emit("timeFilterEvent", { timeFilter: this.times })
      },
      searchSportItem: function(){
        this.$root.$emit("searchSportItem", { searchStr: this.searchSportItem })
      },
      timeFilterModel: function(){
        if(this.timeFilterModel == 0)
          this.timeFilter = 3 * 60 * 60
        else if(this.timeFilterModel == 1)
          this.timeFilter = 12 * 60 * 60
        else if(this.timeFilterModel == 2)
          this.timeFilter = 24 * 60 * 60
        else if(this.timeFilterModel == 3)
          this.timeFilter = 2 * 24 * 60 * 60
        else
          this.timeFilter = ''
        if(this.menuSelected)
          this.leftMenuSelected()
        else
          this.getUpcomingResult()
      }
    },
    mounted() {
      var self = this
      if(localStorage.prematchFavouriteAry != undefined && localStorage.prematchFavouriteAry.length > 0){
        this.prematchFavourites= JSON.parse(localStorage.prematchFavouriteAry)
        for(var i = 0; i< this.prematchFavourites.length; i ++){
          this.prematchFavourites[i].checked = "off"
        }
        localStorage.prematchFavouriteAry = JSON.stringify(this.prematchFavourites)
      }

      this.getTopLeagues()
      
      var system_info = JSON.parse(localStorage.system_conf);
      this.closingMinuteBetting = system_info.closingMinuteBetting
      this.setHasSize()
      this.$root.$on("UpdatePrematchOddTypeRules", payload => {
        this.updatePrematchOddTypeRules()

      })
      this.$root.$on("update-list", function(){
        // console.log("yes of course")
        self.$forceUpdate()
      })

      this.$root.$on("selectLeftMenu", payload => {
        // console.log(payload)
        this.selectedSportIds = payload.sportids
        this.selectedCategoryIds = payload.categoryids
        this.selectedLeagueIds = payload.leagueids
        this.pageNumber = 1
        // console.log(this.$refs.matchTable)
        if(this.$refs.matchTable != undefined && this.$refs.matchTable.scrollTop != undefined)
          this.$refs.matchTable.scrollTop = 0

        this.is_last_page = false
        this.is_updating_page = false

        if(this.selectedSportIds.length == 0 && this.selectedCategoryIds.length == 0 && this.selectedLeagueIds.length == 0){
          this.menuSelected = false
          this.getUpcomingResult();
          this.mainPanel = [true, true]
        }
        else{
          this.menuSelected = true
          this.leftMenuSelected();
        }
      });
      this.$root.$on("prematchFavouriteSelected", function(){
        self.getPrematchFavourites()
      })
      this.$root.$on('resizeEvent', payload=>{
        this.hasSize = payload.hasSize
      })
      this.$root.$on('searchEvent', payload=>{
        this.searchPrematchStr = payload.searchPrematchStr
        this.searchPrematchList()
      })
    },
    created(){
      window.addEventListener('scroll', this.onMainScrollPos);
    },
    destroyed(){
      // window.removeEventListener('scroll', this.onMainScrollPos);
    }
  };
</script>