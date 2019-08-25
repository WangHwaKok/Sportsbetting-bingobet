<template>
  <v-app dark style="min-width:1280px;">
    <!-- <core-filter/> -->
    <core-header/>
    <core-socket/>
    <core-inactivity/>
    <v-content>
      <div id="core-view" class="fill-height">
        <v-fade-transition mode="out-in">
          <v-layout
            fill-height
            pb-4
            style="background: url('/img/bg_sports_betting.jpg'); background-size: 100% 100%;"
          >
            <v-flex v-if="view == 0" xs10 class="pl-2 mt-2 mr-2 overview scroll-y" id="main-scroll" ref="matchTable">
              <v-container style="max-width: unset;" class="fluid ma-0 pa-0 tertiary overview-menu" v-scroll:#main-scroll="onMainScrollPos">
                <v-layout>
                  <v-btn flat :class="view == 0 ? 'v-btn--active' : ''" @click="liveMenuSelected(0)">
                    <v-icon>mdi-format-list-bulleted</v-icon>&nbsp;{{$t('Betting.overview')}}
                  </v-btn>
                  <v-btn flat :class="view == 1 ? 'v-btn--active' : ''" @click="liveMenuSelected(1)">
                    <v-icon>mdi-folder-outline</v-icon>&nbsp;{{$t('Betting.event_view')}}
                  </v-btn>
                  <!-- <v-btn flat>
                    <v-icon>mdi-calendar</v-icon>&nbsp;Calendar
                  </v-btn> -->
                </v-layout>
                <v-layout>
                  <v-btn-toggle v-model="toggle_sports" class="toggle-sports tertiary" mandatory>
                    <v-btn
                      v-for="(sport, sportIndex) in $store.getters.getLiveSports"
                      :key="sportIndex"
                      :class="sportID == sport.sportID ? 'tertiary' : ''"
                      @click="sportMenuSelected(sport.sportID)"
                    >
                      <div class="mr-1" :class="`sport-title-icon ds-sport-icon ds-icon-${sport.sportID}`"></div>
                      &nbsp;{{sport.name}}
                    </v-btn>
                  </v-btn-toggle>
                </v-layout>
                <v-layout column v-if="Object.keys(overViewList).length > 0" class="mt-2">
                  <v-data-table
                    v-for="(table, index) in setOverviewOrderList()"
                    :id="`livetable_${index}`"
                    :key="index"
                    :headers="table.headers"
                    :items="Object.values(table.data.dataList)"
                    class="elevation-1"
                    :pagination.sync="pagination"
                    hide-actions
                  >
                    <template slot="headers" slot-scope="props">
                      <tr>
                        <th
                          v-for="(header, id) in props.headers"
                          :key="id"
                          :class="`text-xs-${header.align}`"
                          :width="header.width"
                        >
                          <v-layout column v-if="header.cell != undefined">
                            <template v-if="header.specialCell">
                              <v-flex :class="`offset-xs${12/header.cellCount}`">{{header.text}}</v-flex>
                            </template>
                            <template v-else>
                              <v-flex>{{header.text}}</v-flex>
                            </template>
                            <v-flex>
                              <v-layout row>
                                <v-flex
                                  :v-if="header.specialCell"
                                  :class="`xs${12/header.cellCount}`"
                                ></v-flex>
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
                              style="margin-right:1rem"
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
                      <tr>
                        <td
                          class="text-xs-center"
                        >{{ props.item.liveMinute}}</td>

                        <td class="text-xs-left">{{props.item.homeTeam+' - '+props.item.awayTeam}}</td>
                        <td class="text-xs-center green--text subheading font-weight-bold">{{ props.item.liveScoreHome+" - "+props.item.liveScoreAway }}</td>
                        <td
                          class="text-xs-center"
                          v-for="(oddType, oddTypeIdx) in liveOddTypeRules.oddRules[table.data.sportAlias].oddTypes"
                        >
                          <v-layout row style="height:80%;">
                            <v-flex d-flex
                              v-if="liveOddTypeRules.oddRules[table.data.sportAlias].hasSpecial[oddTypeIdx]"
                              :class="`ma-1 align-center xs${12/(liveOddTypeRules.lineRules[oddType].length+1)}`"
                            >
                              <div class="yellow--text text--darken-4" v-if="props.item.oddTypes[oddType] != undefined && props.item.oddTypes[oddType].lines[0][0].special > 0">
                                {{props.item.oddTypes[oddType].lines[0][0].special}}
                              </div>
                              <div v-else>
                                <!-- <v-icon color="grey"> mdi-lock-outline</v-icon> -->
                              </div>
                            </v-flex>
                            <template v-for="(oddCell, oddCellIdx) in liveOddTypeRules.lineRules[oddType]">
                              <v-flex d-flex
                                v-if="props.item.oddTypes[oddType] != undefined && props.item.oddTypes[oddType].lines[0][oddCellIdx] != undefined &&
                                  props.item.oddTypes[oddType].lines[0][oddCellIdx].value > 0 && props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended == 0 && isClosedTime(props.item.liveMinute, table.data.sportAlias)"
                                :class="`ma-1 align-center tableCell xs${12/(liveOddTypeRules.lineRules[oddType].length +
                                  (liveOddTypeRules.oddRules[table.data.sportAlias].hasSpecial[oddTypeIdx] ? 1 : 0))} ${props.item.oddTypes[oddType].lines[0][oddCellIdx].changes != undefined?props.item.oddTypes[oddType].lines[0][oddCellIdx].changes:''} ${is_betslip_odd(props.item.eventID, props.item.oddTypes[oddType].oddTypeID, props.item.oddTypes[oddType].lines[0][oddCellIdx].oddID)?'active':''}`"
                                @click="update_betslip('live', props.item.eventID, props.item.homeTeam, props.item.awayTeam, props.item.oddTypes[oddType].oddTypeID, props.item.oddTypes[oddType].name,
                                  props.item.oddTypes[oddType].lines[0][oddCellIdx].oddID, props.item.oddTypes[oddType].lines[0][oddCellIdx].value, props.item.oddTypes[oddType].lines[0][oddCellIdx].name, props.item.oddTypes[oddType].lines[0][oddCellIdx].special, props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended==undefined?0:props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended)"
                              >
                                <div>{{props.item.oddTypes[oddType].lines[0][oddCellIdx].value}}</div>
                              </v-flex>

                              <v-flex d-flex
                                v-else
                                :class="`ma-1 align-center xs${12/(liveOddTypeRules.lineRules[oddType].length +
                                  (liveOddTypeRules.oddRules[table.data.sportAlias].hasSpecial[oddTypeIdx] ? 1 : 0))}`"
                              >
                                <div>
                                  <v-icon color="grey">mdi-lock-outline</v-icon>
                                </div>
                                <!-- <div v-if="props.item.oddTypes != undefined && props.item.oddTypes[oddType] != undefined && props.item.oddTypes[oddType].lines[0][oddCellIdx] != undefined">
                                  {{props.item.oddTypes[oddType].lines[0][oddCellIdx].value}}
                                  {{props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended}}
                                </div> -->
                              </v-flex>
                            </template>
                          </v-layout>
                        </td>

                        <td class="text-xs-center">
                          <div
                            class="align-center marketCell"
                            @click="gotoEventView(props.item.eventID)"
                          >+{{ props.item.marketCount }}</div>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-layout>
                <v-layout v-else-if="Object.keys(overViewList).length == 0 && is_updating_page==false"
                column
                justify-center align-center
                class="ma-2">
                  <v-flex d-flex class="ma-2" style="height:4.1rem">
                    <span class="headline">{{$t('Betting.no_data_available')}}</span>
                  </v-flex>
                </v-layout>
              </v-container>
              <!-- <v-layout align-center justify-center>
                <v-progress-circular
                  v-if="is_updating_page == true"
                  :size="70"
                  :width="7"
                  color="green"
                  indeterminate
                ></v-progress-circular>
              </v-layout> -->
              <v-layout v-if="is_updating_page" justify-center align-center>
                <v-flex>
                  <ScaleLoader
                    class="scale-loader"
                    :loading="is_updating_page"
                    color="lawngreen"
                    :height=100
                    :width=10
                    :radius=1
                    margin="2px"
                    sizeUnit="px"
                  />
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-if="view == 1" xs2 class="pl-2 mt-2 eventview scroll-y" style="min-width:250px;">
              <v-expansion-panel v-model="expandEventViewPanel" expand>
                <v-expansion-panel-content expand-icon="mdi-menu-down" class="tertiary">
                  <template v-slot:header>
                    <div class="d-flex align-center subheading">
                      <div><v-icon color="yellow">mdi-star</v-icon></div>
                      <div style="width:100%;">{{$t('Betting.favourites')}}</div>
                    </div>
                  </template>
                  <v-card color="tertiary">
                    <template v-if="favouriteScoreList.length == 0">
                      <v-card-text style="border: 1px solid grey;">
                        {{$t('Betting.to_select_favourites')}}
                      </v-card-text>
                    </template>
                    <template v-else>
                      <div v-for="event in favouriteScoreList" @click="getLiveEventSingle(event.eventID)" style="cursor:pointer;" :class="`matchScoreList ${is_event_selected(event.eventID)?'active':''}`">
                        <v-divider></v-divider>
                        <v-list-tile ripple class="pt-2 pb-2">
                          <v-list-tile-avatar>
                            <v-icon @click.stop="favouriteSelect(1, event.eventID, event.sportID, event.leagueID)" color="yellow">mdi-star</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>
                              <v-layout>
                                <v-flex xs8 class="text-xs-left score-list">
                                  {{event.homeTeam}}
                                  <br>
                                  {{event.awayTeam}}

                                </v-flex>
                                <v-flex xs4 class="text-xs-right">
                                  <span
                                    class="score"
                                  >{{event.liveScoreHome}}:{{event.liveScoreAway}}</span>
                                  <br>
                                  <span class="time">
                                    {{event.liveMinute}}
                                  </span>
                                </v-flex>
                              </v-layout>
                            </v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </div>
                    </template>
                    <v-text-field
                      v-model="searchEventScoreStr"
                      append-icon="mdi-magnify"
                      class="mt-2"
                      :label='$t("Betting.event_search")'
                      solo-inverted
                      hide-details
                    ></v-text-field>
                  </v-card>
                </v-expansion-panel-content>

                <v-expansion-panel-content
                  expand-icon="mdi-menu-down"
                  v-for="(sport, idx) in liveEventScoreList"
                  :key="sport.sportID"
                  v-if="sport != null"
                >
                  <template v-slot:header>
                    <div class="d-flex align-center body-1 font-weight-bold">
                      <div :class="`sport-title-icon ds-sport-icon ds-icon-${sport.sportID}`"></div>
                      <span style="width:100%; float:left; margin-left:5px">{{ sport.sportName }}</span>
                    </div>
                  </template>
                    <v-expansion-panel-content
                      class="tertiary" expand-icon=""
                      v-for="league in sport.leagues" :key="league.leagueID"
                    >
                    <template v-slot:header>
                      <div class="d-flex align-center caption font-weight-regular tertiary1">
                        <img :src="`/img/country_flag/${league.countryFlag}`" style="width:20px;height:13px;">
                        <span style="width:100%; float:left; margin-left:5px">{{ league.leagueName }}</span>
                      </div>
                    </template>
                    <div v-for="event in league.events" @click="getLiveEventSingle(event.eventID)" style="cursor:pointer;" :class="`matchScoreList ${is_event_selected(event.eventID)?'active':''}`">
                      <v-divider></v-divider>
                      <v-list-tile ripple class="pt-2 pb-2">
                        <v-list-tile-avatar>
                          <v-icon @click.stop="favouriteSelect(0, event.eventID, sport.sportID, league.leagueID)" class="starIcon">mdi-star</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            <v-layout>
                              <v-flex xs8 class="text-xs-left score-list caption font-weight-thin">
                                {{event.homeTeam}}
                                <br>
                                {{event.awayTeam}}
                              </v-flex>
                              <v-flex xs4 class="text-xs-right">
                                <span
                                  class="score"
                                >{{event.liveScoreHome}}:{{event.liveScoreAway}}</span>
                                <br>
                                <span class="time">
                                  {{event.liveMinute}}
                                </span>
                              </v-flex>
                            </v-layout>
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>
                    </v-expansion-panel-content>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>
            <v-flex v-if="view == 1" xs8 class="eventview mx-1 mt-2 scroll-y">

              <v-container fluid class="pa-0 ma-0 tertiary" v-if="is_updating_page == false">
                <v-layout>
                  <v-btn flat :class="view == 0 ? 'v-btn--active' : ''" @click="liveMenuSelected(0)">
                    <v-icon>mdi-format-list-bulleted</v-icon>&nbsp;{{$t('Betting.overview')}}
                  </v-btn>
                  <v-btn flat :class="view == 1 ? 'v-btn--active' : ''" @click="liveMenuSelected(1)">
                    <v-icon>mdi-folder-outline</v-icon>&nbsp;{{$t('Betting.event_view')}}
                  </v-btn>
                  <v-spacer>
                  </v-spacer>
                    <!-- <v-icon>mdi-calendar</v-icon>&nbsp;Calendar -->
                  <v-layout align-center justify-end style="margin-right:20px;">
                    <v-layout row wrap align-center justify-center fill-height :class="`market-row ${marketRow==1?'active':''}`" @click="selectMarketRow(1)">
                      <v-flex xs12 v-for="n in (1, 3)" :key="n">
                        <div class="market-row-line"></div>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap align-center justify-center fill-height :class="`market-row ${marketRow==2?'active':''}`" @click="selectMarketRow(2)">
                      <v-flex xs6 v-for="n in (1, 6)" :key="n">
                        <div class="market-row-line"></div>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap align-center justify-center fill-height :class="`market-row ${marketRow==3?'active':''}`" @click="selectMarketRow(3)">
                      <v-flex xs4 v-for="n in (1, 9)" :key="n">
                        <div class="market-row-line"></div>
                      </v-flex>
                    </v-layout>
                  </v-layout>
                </v-layout>
                <v-layout>
                  <v-img :src="`/img/${eventViewList.sportAlias}board.png`">
                    <!-- <v-flex class="black" style="opacity: .4; height: 100%;"></v-flex> -->
                    <v-flex
                      style="position: relative; left: 0px;"
                      v-if="eventViewList != undefined && Object.keys(eventViewList).length > 0"
                    >
                      <v-layout class="pa-3 pt-1">
                        <v-flex>
                          <img :src="`/img/country_flag/${eventViewList.categoryAlias}.png`" style="width:20px;height:13px;margin-right:10px;">
                          <span class="subheading">{{eventViewList.sportName}} - {{eventViewList.leagueName}}</span>
                        </v-flex>
                      </v-layout>
                      <v-layout class="pa-3" align-center justifiy-center>
                        <v-flex offset-xs3 xs6 d-flex>
                          <table v-if="eventViewList.sportAlias =='soccer'" cellspacing="0" cellpadding="0" class="scoreboard-table">
                            <tr>
                              <th class="text-xs-left" style="padding-left:10px;" width="*">
                                <span v-if="eventViewList.liveGamePeriod != undefined && eventViewList.liveGamePeriod == 'HT' ">{{eventViewList.liveGamePeriod}}</span>
                                <span v-else-if="eventViewList.liveMinute != undefined">{{eventViewList.liveMinute}}</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <img src="/img/corner.png">
                              </th>
                              <th class="text-xs-center" width="8%">
                                <img src="/img/yellowcard.png">
                              </th>
                              <th class="text-xs-center" width="8%">
                                <img src="/img/redcard.png">
                              </th>
                              <th class="text-xs-center" width="8%">
                                <img src="/img/foul.png">
                              </th>
                              <th class="text-xs-center" width="8%">
                                <img src="/img/goal.png">
                              </th>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.homeTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ft-corners'] != undefined">{{eventViewList.scores['ft-corners'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ft-yellow_cards'] != undefined">{{eventViewList.scores['ft-yellow_cards'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ft-red_cards'] != undefined">{{eventViewList.scores['ft-red_cards'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore">{{eventViewList.liveScoreHome}}</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.awayTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ft-corners'] != undefined">{{eventViewList.scores['ft-corners'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ft-yellow_cards'] != undefined">{{eventViewList.scores['ft-yellow_cards'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ft-red_cards'] != undefined">{{eventViewList.scores['ft-red_cards'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore">{{eventViewList.liveScoreAway}}</span>
                              </td>
                            </tr>
                          </table>

                          <table v-else-if="eventViewList.sportAlias =='volleyball'" cellspacing="0" cellpadding="0" class="scoreboard-table">
                            <tr>
                              <th class="text-xs-left" style="padding-left:10px;" width="*">
                                <span v-if="eventViewList.liveClockIsStopped == false">{{eventViewList.liveMinute}}</span>
                                <span v-else-if="eventViewList.liveClockIsStopped == true && eventViewList.liveGamePeriod != undefined">{{eventViewList.liveGamePeriod}}</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>1S</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>2S</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>3S</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>S</span>
                              </th>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.homeTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['1s-points'] != undefined">{{eventViewList.scores['1s-points'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['2s-points'] != undefined">{{eventViewList.scores['2s-points'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['3s-points'] != undefined">{{eventViewList.scores['3s-points'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore" v-if="eventViewList.scores != undefined && eventViewList.scores['ft-sets'] != undefined">{{eventViewList.scores['ft-sets'].home}}</span>
                                <span class="livescore" v-else>-</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.homeTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['1s-points'] != undefined">{{eventViewList.scores['1s-points'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['2s-points'] != undefined">{{eventViewList.scores['2s-points'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['3s-points'] != undefined">{{eventViewList.scores['3s-points'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore" v-if="eventViewList.scores != undefined && eventViewList.scores['ft-sets'] != undefined">{{eventViewList.scores['ft-sets'].away}}</span>
                                <span class="livescore" v-else>-</span>
                              </td>
                            </tr>
                          </table>

                          <table v-else-if="eventViewList.sportAlias =='tennis'" cellspacing="0" cellpadding="0" class="scoreboard-table">
                            <tr>
                              <th class="text-xs-left" style="padding-left:10px;" width="*">
                                <span v-if="eventViewList.liveClockIsStopped == false">{{eventViewList.liveMinute}}</span>
                                <span v-else-if="eventViewList.liveClockIsStopped == true && eventViewList.liveGamePeriod != undefined">{{eventViewList.liveGamePeriod}}</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>1S</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>2S</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>3S</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>S</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>P</span>
                              </th>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.homeTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['1s-games'] != undefined">{{eventViewList.scores['1s-games'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['2s-games'] != undefined">{{eventViewList.scores['2s-games'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['3s-games'] != undefined">{{eventViewList.scores['3s-games'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ft-sets'] != undefined">{{eventViewList.scores['ft-sets'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore" v-if="eventViewList.scores != undefined && eventViewList.scores['ft-games'] != undefined">{{eventViewList.scores['ft-games'].home}}</span>
                                <span class="livescore" v-else>-</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.homeTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['1s-games'] != undefined">{{eventViewList.scores['1s-games'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['2s-games'] != undefined">{{eventViewList.scores['2s-games'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['3s-games'] != undefined">{{eventViewList.scores['3s-games'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ft-sets'] != undefined">{{eventViewList.scores['ft-sets'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore" v-if="eventViewList.scores != undefined && eventViewList.scores['ft-games'] != undefined">{{eventViewList.scores['ft-games'].away}}</span>
                                <span class="livescore" v-else>-</span>
                              </td>
                            </tr>
                          </table>

                          <table v-else-if="eventViewList.sportAlias =='basketball'" cellspacing="0" cellpadding="0" class="scoreboard-table">
                            <tr>
                              <th class="text-xs-left" style="padding-left:10px;" width="*">
                                <span v-if="eventViewList.liveClockIsStopped == false">{{eventViewList.liveMinute}}</span>
                                <span v-else-if="eventViewList.liveClockIsStopped == true && eventViewList.liveGamePeriod != undefined">{{eventViewList.liveGamePeriod}}</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>1Q</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>2Q</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>HT</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>3Q</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>4Q</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>P</span>
                              </th>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.homeTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['1q-points'] != undefined">{{eventViewList.scores['1q-points'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['2q-points'] != undefined">{{eventViewList.scores['2q-points'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ht-points'] != undefined">{{eventViewList.scores['ht-points'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['3q-points'] != undefined">{{eventViewList.scores['3q-points'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['4q-points'] != undefined">{{eventViewList.scores['4q-points'].home}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore" v-if="eventViewList.scores != undefined && eventViewList.scores['ft-points'] != undefined">{{eventViewList.scores['ft-points'].home}}</span>
                                <span class="livescore" v-else>-</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.awayTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['1q-points'] != undefined">{{eventViewList.scores['1q-points'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['2q-points'] != undefined">{{eventViewList.scores['2q-points'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['ht-points'] != undefined">{{eventViewList.scores['ht-points'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['3q-points'] != undefined">{{eventViewList.scores['3q-points'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span v-if="eventViewList.scores != undefined && eventViewList.scores['4q-points'] != undefined">{{eventViewList.scores['4q-points'].away}}</span>
                                <span v-else>-</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore" v-if="eventViewList.scores != undefined && eventViewList.scores['ft-points'] != undefined">{{eventViewList.scores['ft-points'].away}}</span>
                                <span class="livescore" v-else>-</span>
                              </td>
                            </tr>
                          </table>

                          <table v-else cellspacing="0" cellpadding="0" class="scoreboard-table">
                            <tr>
                              <th class="text-xs-left" style="padding-left:10px;" width="*">
                                <span v-if="eventViewList.liveClockIsStopped == false">{{eventViewList.liveMinute}}</span>
                                <span v-else-if="eventViewList.liveClockIsStopped == true && eventViewList.liveGamePeriod != undefined">{{eventViewList.liveGamePeriod}}</span>
                              </th>
                              <th class="text-xs-center" width="8%">
                                <span>P</span>
                              </th>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.homeTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore">{{eventViewList.liveScoreHome}}</span>
                              </td>
                            </tr>
                            <tr>
                              <td class="text-xs-left" style="padding-left:10px;">
                                <span>{{eventViewList.awayTeam}}</span>
                              </td>
                              <td class="text-xs-center">
                                <span class="livescore">{{eventViewList.liveScoreAway}}</span>
                              </td>
                            </tr>
                          </table>

                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-img>
                </v-layout>

                <v-layout>
                  <v-btn-toggle v-model="toggle_kinds" mandatory class="bet-type tertiary"
                    v-if="Object.keys(eventViewList).length > 0 && eventViewList.oddGroups != undefined">
                    <v-btn flat style="opacity: 1;width:7.333rem" @click="changeOddGroup(0)">{{$t('Betting.all')}}</v-btn>
                    <v-btn
                      flat
                      style="opacity: 1;width:7.333rem"
                      v-for="oddGroup in Object.values(eventViewList.oddGroups).sort(function(a, b){return parseInt(a.order) - parseInt(b.order)})"
                      :key="oddGroup.oddGroupID"
                      @click="changeOddGroup(oddGroup.oddGroupID)"
                    >{{oddGroup.name}}</v-btn>
                  </v-btn-toggle>
                </v-layout>
                <v-layout class="mid-panel">
                  <template xs12 v-if="eventFilterViewList.length > 0">
                    <v-flex v-for="count in marketRow" :key="count" :class="`pa-1 tertiary xs${12/marketRow}`">
                      <v-layout
                        xs12
                        column
                        v-for="(oddType,firstIndex) in eventFilterViewList"
                        :key="firstIndex"
                        v-if="(firstIndex >= (count-1)*rowOddCount) && (firstIndex < count*rowOddCount)"
                        class="mid-panel"
                      >
                        <v-flex>
                          <span class="subheading pa-1 odd-type-text">{{oddType.name}}</span>
                        </v-flex>
                        <v-flex
                          :v-if="oddType.lines != undefined && oddType.lines.length > 0"
                          v-for="(line,index) in oddType.lines"
                          :key="index"
                        >
                          <v-layout xs12 row align-center justify-center>
                            <v-flex
                              v-for="(item, idx) in line"
                              :key="idx"
                              :class="`xs${12/line.length} ma-1 event-detail-cell ${item.changes && (item.isSuspended==undefined||item.isSuspended==0)?item.changes:''} ${is_betslip_odd(eventViewList.eventID, oddType.oddTypeID, item.oddID)?'active':''}`"
                              @click="update_betslip('live', eventViewList.eventID, eventViewList.homeTeam, eventViewList.awayTeam, oddType.oddTypeID, oddType.name,
                                item.oddID, item.value, item.name, item.special, item.isSuspended==undefined?0:item.isSuspended)"
                            >
                              <p class="body-2 font-weight-regular pa-1 ma-0 market-odd-name" v-if="item.special != undefined && item.special!= 0">{{item.name}}({{item.special}})</p>
                              <p class="body-2 font-weight-regular pa-1 ma-0 market-odd-name" v-else>{{item.name}}</p>
                              <span class="body-2 font-weight-regular pa-1 market-odd-score odd-price-text" v-if="item.isSuspended == 1 || !isClosedTime(eventViewList.liveMinute, eventViewList.sportAlias)"><v-icon color="grey">mdi-lock-outline</v-icon></span>
                              <span class="body-2 font-weight-regular pa-1 market-odd-score odd-price-text" v-else>{{item.value}}</span>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                  </template>
                  <template v-else>
                    <v-flex d-flex xs12 justify-center align-center style="height:100px;">
                      <span class="headline pa-2" style="text-align:center">{{$t('Betting.at_this_moment_odds_not_available')}}</span>
                    </v-flex>
                  </template>
                </v-layout>
              </v-container>
              <v-layout v-else justify-center align-center fill-height>
                <v-flex>
                  <ScaleLoader
                    class="scale-loader"
                    :loading="is_updating_page"
                    color="lawngreen"
                    :height=100
                    :width=10
                    :radius=1
                    margin="2px"
                    sizeUnit="px"
                  />
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2 class="mr-2 mt-2 scroll-y" style="overflow-x:hidden;min-width:250px;">
              <!-- <div class="text-xs-center pa-1 tertiary">China 0:0 Uzbekistan</div>
              <v-img src="/img/football_game.png"></v-img> -->
              <core-bet-slip/>
            </v-flex>
          </v-layout>
        </v-fade-transition>
      </div>
    </v-content>
    <core-footer/>
  </v-app>
</template>

<script lang="ts">
import { constants } from 'crypto';
export default {
  data() {
    return {
      liveEventScoreList: {},
      favouriteScoreList: [],
      eventScoreData: [],
      favouriteIDList:{},
      sportID: "",
      eventID: 0,

      toggle_sports: 0,

      pagination: {
        rowsPerPage: -1
      },
      toggle_kinds: 0,
      expandEventViewPanel: [],
      view: 1,
      marketRow:1,
      overViewList: {},
      eventViewList: {},
      eventFilterViewList: [],
      timeFilter: "",
      pageNumber:1,
      expandOverviewPanel:[],
      noData:0,
      rowOddCount: 0,
      oddGroupID: 0,
      liveOddTypeRules: {
        lineRules:{},
        oddNames:{},
        oddRules:{},
      },
      is_updating_page: true,
      is_last_page: false,
      searchEventScoreStr:'',
      closingMinuteBetting: '',
    };
  },
  methods: {
    sportMenuSelected(sportID) {
      this.closeOverviewSocket();
      this.sportID = sportID;
      this.pageNumber = 1;
      this.is_updating_page = false
      this.is_last_page = false
      this.getLiveList()
      this.connectOverviewSocket()
    },
    getLiveEventScores() {
      this.axios
        .post(
          "zt_live_event_scores",
          {
            userID: this.$store.getters.getUserId,
            timeFilter: this.timeFilter
          },
          {
            headers: {
              "X-localization": this.$store.getters.getLanguage
            }
          }
        )
        .then(response => {
          if(response.data.success != undefined)
            this.setLiveEventScores(response.data.success.data, "", "", "", "")
          else
            console.log('getLiveEventScores error')
        })
        .catch(e => {
          console.log(e);
        });
    },
    setLiveEventScores(apiData="", aliveScoreData="", insertEventData="", removeEventData="", updateEventData=""){
      if(apiData != ""){
        this.eventScoreData = apiData.leagues != undefined ? apiData.leagues : []
        this.getFilterScoreList(1)
      }
      else if(aliveScoreData != "" && this.eventScoreData.length > 0){
        var leagueIndex;
        this.eventScoreData.find(function(league, i){
          if(aliveScoreData.sportID == league.sportID && aliveScoreData.leagueID == league.leagueID){
            leagueIndex = i
            return
          }
        })

        var eventIndex;
        if(leagueIndex != undefined){
          this.eventScoreData[leagueIndex].events.find(function(event, eventIdx){
            if(event.eventID == aliveScoreData.eventID){
              eventIndex = eventIdx
              return
            }
          })
        }

        if(eventIndex != undefined){
          if(aliveScoreData.liveScoreAway != undefined)
            this.eventScoreData[leagueIndex].events[eventIndex].liveScoreAway = aliveScoreData.liveScoreAway
          if(aliveScoreData.liveScoreHome != undefined)
            this.eventScoreData[leagueIndex].events[eventIndex].liveScoreHome = aliveScoreData.liveScoreHome

          this.getFilterScoreList()
        }

      }

      else if(insertEventData != "" && insertEventData.leagues != undefined && insertEventData.leagues.length > 0 && this.eventScoreData.length > 0){

        var leagueIndex
        var self = this
        insertEventData.leagues.forEach(newLeague => {
          leagueIndex = -1
          self.eventScoreData.find(function(league, i){
            if(newLeague.sportID == league.sportID && newLeague.leagueID == league.leagueID){
              leagueIndex = i
              return
            }
          })

          if(leagueIndex != -1){
            if(newLeague.events != undefined && newLeague.events.length > 0){
              self.eventScoreData[leagueIndex].events = self.eventScoreData[leagueIndex].events.concat(newLeague.events)
            }
          }
          else{
            self.eventScoreData.push(newLeague)
          }

        })
        this.getFilterScoreList()
      }

      else if(removeEventData != "" && this.eventScoreData.length > 0){
        var leagueIndex = -1
        this.eventScoreData.find(function(league, i){
          if(league.sportID == removeEventData.sportID && league.leagueID == removeEventData.leagueID){
            leagueIndex = i
            return
          }
        })
        if(leagueIndex != -1 && this.eventScoreData[leagueIndex].events != undefined && this.eventScoreData[leagueIndex].events.length > 0){
          var eventIndex = -1
          this.eventScoreData[leagueIndex].events.find(function(event, j){
            if(event.eventID == removeEventData.eventID){
              eventIndex = j
              return
            }
          })

          if(eventIndex != -1){
            this.eventScoreData[leagueIndex].events.splice(eventIndex, 1)
            if(this.eventScoreData[leagueIndex].events.length == 0){
              this.eventScoreData.splice(leagueIndex, 1)
            }

            //removeEvent from favouriteIDList
            if(this.favouriteIDList[removeEventData.sportID] != undefined && this.favouriteIDList[removeEventData.sportID][removeEventData.leagueID] != undefined
              && this.favouriteIDList[removeEventData.sportID][removeEventData.leagueID][removeEventData.eventID] != undefined){
                delete this.favouriteIDList[removeEventData.sportID][removeEventData.leagueID][removeEventData.eventID]
                if(Object.keys(this.favouriteIDList[removeEventData.sportID][removeEventData.leagueID]).length == 0){
                  delete this.favouriteIDList[removeEventData.sportID][removeEventData.leagueID]
                  if(Object.keys(this.favouriteIDList[removeEventData.sportID]).length == 0)
                    delete this.favouriteIDList[removeEventData.sportID]
                }
              localStorage.liveFavouriteAry = JSON.stringify(this.favouriteIDList)
            }
            this.getFilterScoreList()
          }
        }
      }

      else if(updateEventData != "" && this.eventScoreData.length > 0){
        var leagueIndex = -1
        this.eventScoreData.find(function(league, i){
          if(league.sportID == updateEventData.sportID && league.leagueID == updateEventData.message.leagueID){
            leagueIndex = i
            return
          }
        })
        if(leagueIndex != -1 && this.eventScoreData[leagueIndex].events != undefined && this.eventScoreData[leagueIndex].events.length > 0){
          var eventIndex = -1
          this.eventScoreData[leagueIndex].events.find(function(event, j){
            if(event.eventID == updateEventData.message.eventID){
              eventIndex = j
              return
            }
          })

          if(eventIndex != -1){
            var self = this
            Object.keys(updateEventData.message).forEach(key => {
              if(key != "eventID" && key != "leagueID" && key != "updateEvent"){
                self.eventScoreData[leagueIndex].events[eventIndex][key] = updateEventData.message[key]
              }
            })
            this.getFilterScoreList()
          }
        }
      }
    },
    getLiveEventView() {
      // var userID = "";
      this.is_updating_page = true
      this.axios
        .post("zt_live_event_view", {
          sportID: '',
          timeFilter: this.timeFilter,
          userID: this.$store.getters.getUserId,
        },
        {
          headers: {
            "X-localization": this.$store.getters.getLanguage
          }
        }
        )
        .then(response => {
          if(response.data.success != undefined){
            this.eventID = response.data.success.data.eventID
            this.connectEventviewSocket()
            this.setLiveEventDetailView(response.data.success.data)
          }
          else{
            console.log("getLiveEventView error")
            this.is_updating_page = false
          }
        })
        .catch(e => {
          console.log(e);
          this.is_updating_page = false
        });
    },
    setLiveEventDetailView(apiData="",
      updateOddsData = "",
      insertOddTypeData = "",
      removeOddTypeData = "",
      updateEventData = "",
      removeEventData = ""){
      if(apiData != ""){
        if(this.$store.getters.getSelectLiveEvent != '')
          this.$store.commit('setSelectLiveEvent', '')

        this.eventViewList = {}
        this.eventFilterViewList = []
        this.toggle_kinds = 0
        var self = this
        Object.keys(apiData).forEach(function(key){
          if(key == "oddGroups"){
            return
          }
          if(key == "scores" && apiData[key]){
            self.eventViewList[key] = {}
            apiData[key].forEach(score => {
              self.eventViewList[key][score.set] = score
            })
            return
          }
          self.eventViewList[key] = apiData[key]
        })
        this.eventViewList.oddGroups = {}
        // console.log(this.eventViewList)

        if(apiData.oddGroups != undefined && apiData.oddGroups.length > 0){
          apiData.oddGroups.forEach(oddGroup => {
            var newOddGroup = {
              name: oddGroup.name,
              alias: oddGroup.alias,
              order: oddGroup.order,
              oddGroupID: oddGroup.oddGroupID,
              oddTypes:{},
            }
            if(oddGroup.oddTypes != undefined && oddGroup.oddTypes.length > 0){
              oddGroup.oddTypes.sort(function(a, b){
                return parseInt(a.order) - parseInt(b.order)
              }).forEach(oddType => {

                newOddGroup.oddTypes[oddType.oddTypeID] = oddType
              })
            }
            // console.log(oddGroup)
            self.eventViewList.oddGroups[oddGroup.oddGroupID] = newOddGroup
          })

          var oddTypeCount = 0

          // console.log(this.eventViewList.oddGroups)
          // var ret = Object.values(this.eventViewList['oddGroups']).sort(function(a, b){
          //   return parseInt(a.order) - parseInt(b.order);
          // })
          // console.log(ret)

          Object.values(this.eventViewList.oddGroups).sort(function(a, b){
            return parseInt(a.order) - parseInt(b.order);
          }).forEach(function(foddGroup){
            if(foddGroup.oddTypes != undefined && Object.keys(foddGroup.oddTypes).length > 0){
              oddTypeCount += Object.keys(foddGroup.oddTypes).length
              // foddGroup['oddTypes'].sort(function(a, b){
              //   return parseInt(a.order) - parseInt(b.order);
              // })
              Object.values(foddGroup.oddTypes).sort(function(a, b){
                return parseInt(a.order) - parseInt(b.order);
              }).forEach(function(oddType){
                // console.log(oddType)
                self.eventFilterViewList.push(oddType)
              })
            }
          })
          this.rowOddCount = oddTypeCount/this.marketRow
          this.rowOddCount = Math.round(this.rowOddCount)
          // console.log(oddTypeCount)
          // console.log(this.eventFilterViewList)
        }
        // console.log(this.eventFilterViewList)
        // console.log(Object.values(this.eventViewList))
        this.is_updating_page = false
      }

      else if(updateOddsData != "" && updateOddsData.odds != undefined && updateOddsData.odds.length > 0 &&
          this.eventViewList.oddGroups[updateOddsData.oddGroupID] != undefined &&
          this.eventViewList.oddGroups[updateOddsData.oddGroupID].oddTypes[updateOddsData.oddTypeID] != undefined){

        this.eventViewList.oddGroups[updateOddsData.oddGroupID].oddTypes[updateOddsData.oddTypeID].lines.forEach(function(line, lineIdx, lineObject){
          if(updateOddsData.odds.length == 0 || line.length == 0)
            return
          line.forEach(function(odd, oddIdx, oddObject){
            if(updateOddsData.odds.length > 0){
              var searchOddId = -1
              updateOddsData.odds.find(function(newOdd, newOddIdx){
                if(newOdd.oddID == odd.oddID){
                  searchOddId = newOddIdx
                  return newOddIdx
                }
              })
              if(searchOddId != -1){
                Object.keys(updateOddsData.odds[searchOddId]).forEach(key => {
                  if(key == 'value'){
                    if(oddObject[oddIdx].value > updateOddsData.odds[searchOddId].value){
                      if(oddObject[oddIdx].changes == undefined)
                        oddObject[oddIdx].changes = 'decrease1'
                      else if(oddObject[oddIdx].changes == 'decrease1'){
                        oddObject[oddIdx].changes = 'decrease2'
                      }
                      else if(oddObject[oddIdx].changes == 'decrease2'){
                        oddObject[oddIdx].changes = 'decrease1'
                      }

                    }
                    else if(oddObject[oddIdx].value < updateOddsData.odds[searchOddId].value){
                      if(oddObject[oddIdx].changes == undefined)
                        oddObject[oddIdx].changes = 'increase1'
                      else if(oddObject[oddIdx].changes == 'increase1'){
                        oddObject[oddIdx].changes = 'increase2'
                      }
                      else if(oddObject[oddIdx].changes == 'increase2'){
                        oddObject[oddIdx].changes = 'increase1'
                      }
                    }
                  }
                  oddObject[oddIdx][key] = updateOddsData.odds[searchOddId][key]
                })
                updateOddsData.odds.splice(searchOddId, 1)
              }
            }
          })
        })

        this.changeOddGroup(this.oddGroupID)
      }

      else if(insertOddTypeData != ""){
        if(this.eventViewList.oddGroups[insertOddTypeData.oddGroupID] == undefined){
          var newOddGroup = {
            name: insertOddTypeData.oddGroupName,
            alias: insertOddTypeData.oddGroupAlias,
            oddGroupID: insertOddTypeData.oddGroupID,
            oddTypes:{},
          }
          this.eventViewList.oddGroups[insertOddTypeData.oddGroupID] = newOddGroup
        }
        this.eventViewList.oddGroups[insertOddTypeData.oddGroupID].oddTypes[insertOddTypeData.oddTypeID] = insertOddTypeData

        this.changeOddGroup(this.oddGroupID)
      }

      else if(removeOddTypeData != "" && this.eventViewList.oddGroups[removeOddTypeData.oddGroupID] != undefined &&
        this.eventViewList.oddGroups[removeOddTypeData.oddGroupID].oddTypes[removeOddTypeData.oddTypeID] != undefined){
          delete this.eventViewList.oddGroups[removeOddTypeData.oddGroupID].oddTypes[removeOddTypeData.oddTypeID]
          if(Object.keys(this.eventViewList.oddGroups[removeOddTypeData.oddGroupID].oddTypes).length == 0){
            delete this.eventViewList.oddGroups[removeOddTypeData.oddGroupID]
          }
          this.changeOddGroup(this.oddGroupID)
      }

      else if(updateEventData != "" && this.eventViewList.eventID == updateEventData.eventID){
        var self = this
        Object.keys(updateEventData).forEach(function(key){
          if(key == "oddGroups"){
            return
          }
          if(key == "scores" && updateEventData[key]){
            if(self.eventViewList[key] == undefined)
              self.eventViewList[key] = {}
            updateEventData[key].forEach(score => {
              self.eventViewList[key][score.set] = score
            })
            return
          }
          self.eventViewList[key] = updateEventData[key]
        })
        this.changeOddGroup(this.oddGroupID)
      }

      // else if(removeEventData != "" && this.eventViewList.eventID == removeEventData.eventID){
      //   this.eventViewList = {}
      //   this.eventFilterViewList = {}
      // }
    },
    getLiveEventSingle(eventID) {
      this.is_updating_page = true
      this.closeEventviewSocket()
      this.eventID = eventID;
      this.connectEventviewSocket()
      this.axios
        .post("zt_live_single", {
          // sportID: this.sportID,
          timeFilter: this.timeFilter,
          eventID: eventID,
          userID: this.$store.getters.getUserId
        },
        {
          headers: {
            "X-localization": this.$store.getters.getLanguage
          }
        })
        .then(response => {
          if(response.data.success != undefined){
            this.setLiveEventDetailView(response.data.success.data)
          }
          else{
            console.log('zt_live_single error')
            this.is_updating_page = false
          }

        })
        .catch(e => {
          console.log(e);
          this.is_updating_page = false
        });
    },
    getLiveList(pagination=false) {
      this.is_updating_page = true
      this.axios
        .post(
          "zt_live_list",
          {
            sportID: this.sportID,
            timeFilter: this.timeFilter,
            userID: this.$store.getters.getUserId,
            eventID: "",
            // categoryID: this.categoryID,
            // leagueID: this.leagueID,
            // query: this.searchPrematchStr,
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
            if(response.data.success.data.leagues.length == 0){
              if(!pagination){
                this.overViewList = {}
                this.is_updating_page = false
                return
              }
              this.is_last_page = true
              this.is_updating_page = false
              return;
            }
            this.setOverViewList(pagination, response.data.success.data)
          }
          else{
            console.log("getLiveList error")
            this.is_updating_page = false
          }

        })
        .catch(e => {
          console.log(e);
          this.is_updating_page = false
        });
    },
    setOverViewList(
      pagination=false,
      apiData = "",
      updateOddsData = "",
      insertOddTypeData = "",
      removeOddTypeData = "",
      updateEventData = "",
      removeEventData = "",
      insertEventData = ""
    ) {

      if(this.liveOddTypeRules.oddRules.length == 0)
        return
      if (apiData != "") {
        // console.log(this.overViewList)

        if(!pagination)
          this.overViewList = {}
        apiData.leagues.forEach((league, leagueCount, leagueObj) => {

          var headers = [
            {
              sportID: league.sportID,
              countryFlag:
                "/img/country_flag/" + league.categoryAlias + ".png",
              width: "8%",
              align: "center"
            },
            {
              text: league.leagueName,
              align: "left",
              width: "*"
            },
            { text: "", align: "center", width: "8%" }
          ];
          if(this.liveOddTypeRules.oddRules[league.sportAlias] != undefined){
            var self = this
            this.liveOddTypeRules.oddRules[league.sportAlias].oddTypes.forEach(function(oddType, oddIndex, Object){
              var partHeader = {}
              partHeader.text = self.liveOddTypeRules.oddNames[oddType]
              partHeader.align = "center"
              var specialCell = self.liveOddTypeRules.oddRules[league.sportAlias].hasSpecial[oddIndex] ? 1 : 0
              partHeader.specialCell = specialCell
              partHeader.cellCount = self.liveOddTypeRules.lineRules[oddType].length + specialCell
              partHeader.width = (partHeader.cellCount)*5 + "%"
              partHeader.cell = self.liveOddTypeRules.lineRules[oddType]
              headers.push(partHeader)
            });
          }
          headers.push({
            text: "",
            align: "center",
            width: "5%"
          });

          var leaguePartTable = {
            leagueID: league.leagueID,
            sportID: league.sportID,
            sportAlias: league.sportAlias,
            categoryAlias: league.categoryAlias,
            categoryName: league.categoryName,
            leagueName: league.leagueName,
            leagueOrder: league.leagueOrder,
            dataList: {}
          };
          if(league.events != undefined && league.events.length > 0){
            league.events.forEach(event => {
              var dataItem = {
                eventID: event.eventID,
                eventDate: event.eventDate,
                marketCount: event.marketCount,
                homeTeam: event.homeTeam,
                awayTeam: event.awayTeam,
                liveScoreHome: event.liveScoreHome,
                liveScoreAway: event.liveScoreAway,
                liveMinute: event.liveMinute,
                liveClockTimestamp: event.liveClockTimestamp != undefined ? event.liveClockTimestamp : undefined,
                liveGamePeriod: event.liveGamePeriod != undefined ? event.liveGamePeriod : undefined,
                liveClockStartSeconds: event.liveClockStartSeconds != undefined ? event.liveClockStartSeconds : undefined,
                liveClockIsStopped: event.liveClockIsStopped != undefined ? event.liveClockIsStopped : undefined,
                liveClockIsCountDown: event.liveClockIsCountDown != undefined ? event.liveClockIsCountDown : undefined,
                oddTypes: {},
              }
              if(event.oddTypes.length > 0){
                event.oddTypes.forEach(oddType => {
                  dataItem.oddTypes[oddType.alias] = oddType
                })
              }
              leaguePartTable.dataList[event.eventID] = dataItem
            })
          }

          if(this.overViewList[league.leagueID] == undefined){
            this.overViewList[league.leagueID] = {data:'', headers:''}
            this.overViewList[league.leagueID].data = leaguePartTable
            this.overViewList[league.leagueID].headers = headers
          }
          else{
            this.overViewList[league.leagueID].data.dataList = Object.assign(this.overViewList[league.leagueID].data.dataList, leaguePartTable.dataList)
          }
        })
        // console.log(this.overViewList)
        this.is_updating_page = false
        // this.$forceUpdate()
      }
      else if (updateOddsData != "" && updateOddsData.odds != undefined && updateOddsData.odds.length > 0){
        var index = -1;
        if(this.overViewList[updateOddsData.leagueID] != undefined && this.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID] != undefined
          && this.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes != undefined
          && this.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias] != undefined){

          var self = this;
          this.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0].forEach(function(line, line_index){
            var upt_line_index = -1;
            var filteredLine = updateOddsData.odds.find(function(updateOdd, upt_odd_index){
                if(updateOdd.oddID == line.oddID)
                {
                    upt_line_index = upt_odd_index;
                    return upt_odd_index;
                }
            });
            if(upt_line_index != -1){
              if(updateOddsData.odds[upt_line_index].value != undefined)
              {

                  var orgVal = self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].value;

                  // self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[index].lines[0][line_index].changes = "";

                  // var changes = "";

                  if( orgVal > updateOddsData.odds[upt_line_index].value)
                  {
                    if(self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == undefined)
                      self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'decrease1'
                    else if(self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == 'decrease1'){
                      self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'decrease2'
                    }
                    else if(self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == 'decrease2'){
                      self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'decrease1'
                    }

                  }
                  else if(orgVal < updateOddsData.odds[upt_line_index].value){
                    if(self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == undefined)
                      self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'increase1'
                    else if(self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == 'increase1'){
                      self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'increase2'
                    }
                    else if(self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == 'increase2'){
                      self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'increase1'
                    }
                  }

                  // self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = changes;

                  self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].value = updateOddsData.odds[upt_line_index].value;
              }

              if(updateOddsData.odds[upt_line_index].isSuspended != undefined)
                  self.overViewList[updateOddsData.leagueID].data.dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].isSuspended = updateOddsData.odds[upt_line_index].isSuspended;
            }
          })
          // this.$forceUpdate()
        }
      }
      else if(insertOddTypeData != "" && insertOddTypeData.leagueID != undefined && insertOddTypeData.eventID != undefined && insertOddTypeData.alias != undefined){
        if(insertOddTypeData.lines != undefined && insertOddTypeData.lines[0] != undefined && insertOddTypeData.lines[0].length > 0 && this.overViewList[insertOddTypeData.leagueID] != undefined
          && this.overViewList[insertOddTypeData.leagueID].data.dataList[insertOddTypeData.eventID] != undefined){

            if(this.overViewList[insertOddTypeData.leagueID].data.dataList[insertOddTypeData.eventID].oddTypes != undefined
              && this.overViewList[insertOddTypeData.leagueID].data.dataList[insertOddTypeData.eventID].oddTypes[insertOddTypeData.alias] != undefined)   //update
            {
              this.overViewList[insertOddTypeData.leagueID]['data']['dataList'][insertOddTypeData.eventID]['oddTypes'][insertOddTypeData.alias] = insertOddTypeData;
            }
            else{   //insert
              if(this.overViewList[insertOddTypeData.leagueID]['data']['dataList'][insertOddTypeData.eventID].oddTypes == undefined)
                this.overViewList[insertOddTypeData.leagueID]['data']['dataList'][insertOddTypeData.eventID].oddTypes = {}
              this.overViewList[insertOddTypeData.leagueID]['data']['dataList'][insertOddTypeData.eventID]['oddTypes'][insertOddTypeData.alias] = insertOddTypeData
            }

          // this.$forceUpdate()
        }
      }
      else if(removeOddTypeData != "" && removeOddTypeData.leagueID != undefined && removeOddTypeData.eventID != undefined && removeOddTypeData.oddTypeAlias != undefined){
          if(this.overViewList[removeOddTypeData.leagueID] != undefined && this.overViewList[removeOddTypeData.leagueID].data.dataList[removeOddTypeData.eventID] != undefined
            && this.overViewList[removeOddTypeData.leagueID].data.dataList[removeOddTypeData.eventID].oddTypes != undefined
            && this.overViewList[removeOddTypeData.leagueID].data.dataList[removeOddTypeData.eventID].oddTypes[removeOddTypeData.oddTypeAlias] != undefined){

            delete this.overViewList[removeOddTypeData.leagueID].data.dataList[removeOddTypeData.eventID].oddTypes[removeOddTypeData.oddTypeAlias]
            // this.$forceUpdate()
          }
      }
      else if(updateEventData != "" && updateEventData.eventID != undefined && updateEventData.leagueID != undefined){
          var self = this
          if(this.overViewList[updateEventData.leagueID] != undefined && this.overViewList[updateEventData.leagueID].data.dataList[updateEventData.eventID] != undefined){
              Object.keys(updateEventData).forEach(key => {
                if(key != "method" && key != "eventID" && key != "leagueID" && key != "oddTypes")
                  self.overViewList[updateEventData.leagueID].data.dataList[updateEventData.eventID][key] = updateEventData[key]
              })
            // this.$forceUpdate()
          }
      }
      else if(removeEventData != "" && removeEventData.eventID != undefined && removeEventData.leagueID != undefined){
          if(this.overViewList[removeEventData.leagueID] != undefined && this.overViewList[removeEventData.leagueID].data.dataList[removeEventData.eventID] != undefined){
            delete this.overViewList[removeEventData.leagueID].data.dataList[removeEventData.eventID]
            // this.$forceUpdate()
          }
      }
      else if(insertEventData != "" && insertEventData.eventID != undefined && insertEventData.leagueID != undefined){

        if(this.overViewList[insertEventData.leagueID] == undefined){
          this.overViewList[insertEventData.leagueID] = {headers:'', data:''}
          var headers = [
            {
              sportID: insertEventData.sportID,
              countryFlag:
                "/img/country_flag/" + insertEventData.categoryAlias + ".png",
              width: "8%",
              align: "center"
            },
            {
              text: insertEventData.leagueName,
              align: "left",
              width: "*"
            },
            { text: "", align: "center", width: "8%" }
          ];
          if(this.liveOddTypeRules.oddRules[insertEventData.sportAlias] != undefined){
            var self = this
            this.liveOddTypeRules.oddRules[insertEventData.sportAlias].oddTypes.forEach(function(oddType, oddIndex, Object){
              var partHeader = {}
              partHeader.text = self.liveOddTypeRules.oddNames[oddType]
              partHeader.align = "center"
              var specialCell = self.liveOddTypeRules.oddRules[insertEventData.sportAlias].hasSpecial[oddIndex] ? 1 : 0
              partHeader.specialCell = specialCell
              partHeader.cellCount = self.liveOddTypeRules.lineRules[oddType].length + specialCell
              partHeader.width = (partHeader.cellCount)*5 + "%"
              partHeader.cell = self.liveOddTypeRules.lineRules[oddType]
              headers.push(partHeader)
            });
          }
          headers.push({
            text: "",
            align: "center",
            width: "5%"
          });

          this.overViewList[insertEventData.leagueID].headers = headers
          this.overViewList[insertEventData.leagueID].data = {
              leagueID: insertEventData.leagueID,
              sportID: insertEventData.sportID,
              sportAlias: insertEventData.sportAlias,
              categoryAlias: insertEventData.categoryAlias,
              categoryName: insertEventData.categoryName,
              leagueName: insertEventData.leagueName,
              leagueOrder: insertEventData.leagueOrder != undefined ? insertEventData.leagueOrder : 100000,
              dataList: {}
          }

        }

        var dataItem = {
            eventID: insertEventData.eventID,
            liveMinute: insertEventData.liveMinute != undefined ? insertEventData.liveMinute : undefined,
            liveClockTimestamp: insertEventData.liveClockTimestamp != undefined ? insertEventData.liveClockTimestamp : undefined,
            liveGamePeriod: insertEventData.liveGamePeriod != undefined ? insertEventData.liveGamePeriod : undefined,
            liveClockStartSeconds: insertEventData.liveClockStartSeconds != undefined ? insertEventData.liveClockStartSeconds : undefined,
            liveClockIsStopped: insertEventData.liveClockIsStopped != undefined ? insertEventData.liveClockIsStopped : undefined,
            liveClockIsCountDown: insertEventData.liveClockIsCountDown != undefined ? insertEventData.liveClockIsCountDown : undefined,
            liveScoreHome: insertEventData.liveScoreHome,
            liveScoreAway: insertEventData.liveScoreAway,
            homeTeam: insertEventData.homeTeam,
            awayTeam: insertEventData.awayTeam,
            oddTypes: {},
        }
        if(insertEventData.oddTypes != undefined && insertEventData.oddTypes.length > 0){
          insertEventData.oddTypes.forEach(oddType => {
            dataItem.oddTypes[oddType.alias] = oddType
          })
        }
        this.overViewList[insertEventData.leagueID].data.dataList[insertEventData.eventID] = dataItem
        // this.$forceUpdate()
      }
    },
    connectOverviewSocket() {
      // console.log(this.sportID)
      // console.log("live.sport." + this.sportID + "."+this.$store.getters.getLanguage)
      var lan = this.$store.getters.getLanguage ? this.$store.getters.getLanguage : 'en'
      localStorage.socketChannelOverview = "live.sport." + this.sportID + "."+lan
      // console.log(localStorage.socketChannelOverview)
      window.Echo.private(localStorage.socketChannelOverview).listen(
        "LiveSportDetailSent",
        e => {
          // console.log("LiveSportDetailSent");
          // console.log('LiveSportDetailSent', e.message.method, e);
          if(Object.keys(this.overViewList).length > 0){
            switch (e.message.method) {
              case "updateOdds": {
                this.setOverViewList(false, "", e.message);
                break;
              }
              case "insertOddType": {
                this.setOverViewList(false, "", "", e.message.data);
                break;
              }
              case "removeOddType": {
                this.setOverViewList(false, "", "", "", e.message);
                break;
              }
              case "updateEvent": {
                this.setOverViewList(false, "", "", "", "", e.message);
                break;
              }
              case "removeEvent": {
                this.setOverViewList(false, "", "", "", "", "", e.message);
                break;
              }
              case "insertEvent": {
                this.setOverViewList(false, "", "", "", "", "", "", e.message);
                break;
              }
            }

          }

        }
      );
    },
    getLanguage(){
      return  this.$store.getters.getLanguage ? this.$store.getters.getLanguage : 'en'

    },
    closeOverviewSocket() {

      // var langs = ["en", "tr", "sy", "iq"];
      // var i = 41;
      // var j = 0;
      // for (j = 0; j < langs.length; j++) {
      //   window.Echo.leave("live.sport.all." + langs[j]);
      //   console.log("live.sport.all." + langs[j])
      //   for (i = 41; i < 60; i++) {

      //     window.Echo.leave("live.sport." + i + "." + langs[j]);
      //     console.log("live.sport." + i + "." + langs[j])
      //   }
      // }
      if (localStorage.socketChannelOverview == undefined || localStorage.socketChannelOverview == '')
          return;
      // console.log("closeOverviewSocket", localStorage.socketChannelOverview)
      window.Echo.leave(localStorage.socketChannelOverview)
      localStorage.socketChannelOverview = "";
    },
    connectEventviewSocket() {
      // console.lg("live.event." + this.eventID + "."+this.$store.getters.getLanguage)
      if(this.eventID == 0)
        return
      var lan = this.getLanguage()
      localStorage.socketChannelEventDetail = "live.event." + this.eventID + "."+lan

      // console.log(localStorage.socketChannelEventDetail)
      window.Echo.private(localStorage.socketChannelEventDetail).listen(
        "LiveEventDetailSent",
        e => {
          // console.log("LiveSportDetailSent");
          // console.log('LiveEventDetailSent', e.message.method, e);

          switch (e.message.method) {
            case "updateOdds": {
              this.setLiveEventDetailView("", e.message);
              break;
            }
            case "insertOddType": {
              this.setLiveEventDetailView("", "", e.message.data);
              break;
            }
            case "removeOddType": {
              this.setLiveEventDetailView("", "", "", e.message);
              break;
            }
            case "updateEvent": {
              this.setLiveEventDetailView("", "", "", "", e.message);
              break;
            }
            // case "removeEvent": {
            //   this.setLiveEventDetailView("", "", "", "", "", e.message);
            //   break;
            // }
          }
        }
      );
      // console.log("ok")
    },
    closeEventviewSocket() {
      if(this.eventID == 0)
        return
      if(localStorage.socketChannelEventDetail == undefined || localStorage.socketChannelEventDetail.length == 0)
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
    connectEventScoreSocket(){
      var lan = this.$store.getters.getLanguage ? this.$store.getters.getLanguage : 'en'
      localStorage.socketChannelEventScore = 'live.score.'+ lan

      // console.log(localStorage.socketChannelEventScore)
      window.Echo.private(localStorage.socketChannelEventScore)
        .listen('LiveScoreDetailSent', (e) => {
            // console.log("LiveScoreSent");
            // console.log("LiveScoreDetailSent", e.message.method, e);
            switch(e.message.method){
              case "aliveScore":{
                this.setLiveEventScores("", e.message, "", "", "")
                break;
              }
              case "insertEvent":{
                this.setLiveEventScores("", "", e.message, "", "")
                break;
              }
              case "removeEvent":{
                this.setLiveEventScores("", "", "", e.message, "")
                break;
              }
              case "updateEvent":{
                this.setLiveEventScores("", "", "", "", e)
                break;
              }
            }
        });
    },
    closeLiveEventScoreSocket(){
      if (localStorage.socketChannelEventScore == undefined || localStorage.socketChannelEventScore.length == 0)
        return;

      window.Echo.leave(localStorage.socketChannelEventScore)
      // console.log("closeLiveEventScoreSocket", localStorage.socketChannelEventScore)
      // window.Echo.private(this.socketChannelEventScore).stopListening(
      //   "LiveEventDetailSent",
      //   e => {
      //     console.log("CloseLiveEventDetailSent");
      //     console.log(e);
      //     // this.messages.push({
      //     //   message: e.message.message
      //     // });
      //   }
      // );
      localStorage.socketChannelEventScore = ""
    },
    changeOddGroup(oddGroupID){
      this.oddGroupID = oddGroupID
      // console.log(oddGroupID)
      var oddTypeCount = 0
      this.eventFilterViewList = []
      var self = this
      // console.log(this.toggle_kinds)
      // console.log(this.eventViewList.oddGroups[this.toggle_kinds])
      // Object.values(this.eventViewList.oddGroups).sort(function(a, b){
      //       return parseInt(a.order) - parseInt(b.order);
      //     }).forEach(function(foddGroup){
      //       if(foddGroup.oddTypes != undefined && Object.keys(foddGroup.oddTypes).length > 0){
      //         oddTypeCount += Object.keys(foddGroup.oddTypes).length
      //         // foddGroup['oddTypes'].sort(function(a, b){
      //         //   return parseInt(a.order) - parseInt(b.order);
      //         // })
      //         Object.values(foddGroup.oddTypes).sort(function(a, b){
      //           return parseInt(a.order) - parseInt(b.order);
      //         }).forEach(function(oddType){
      //           // console.log(oddType)
      //           self.eventFilterViewList.push(oddType)
      //         })
      //       }
      //     })

      if(oddGroupID == 0){
        Object.values(this.eventViewList.oddGroups).sort(function(a, b){
            return parseInt(a.order) - parseInt(b.order);
          }).forEach(function(foddGroup){
          if(foddGroup.oddTypes != undefined && Object.keys(foddGroup.oddTypes).length > 0){
            oddTypeCount += Object.keys(foddGroup.oddTypes).length
            Object.values(foddGroup.oddTypes).sort(function(a, b){
                return parseInt(a.order) - parseInt(b.order);
              }).forEach(function(oddType){
                // console.log(oddType)
                self.eventFilterViewList.push(oddType)
              })
          }
        })
        this.rowOddCount = oddTypeCount/this.marketRow
      }
      else{
        Object.values(this.eventViewList.oddGroups[oddGroupID].oddTypes).sort(function(a, b){
          return parseInt(a.order) - parseInt(b.order);
        }).forEach(function(oddType){
          self.eventFilterViewList.push(oddType)
        })
        // this.eventFilterViewList = this.eventViewList.oddGroups[oddGroupID].oddTypes
        this.rowOddCount = this.eventFilterViewList.length/this.marketRow
        // console.log(this.eventFilterViewList)
        // console.log(this.rowOddCount)
        // this.$forceUpdate()
      }
      this.rowOddCount = Math.round(this.rowOddCount)
      // console.log(this.eventViewList)
      this.$forceUpdate()
    },
    updateLiveOddTypeRules(){
      this.liveOddTypeRules.lineRules = this.$store.getters.getOddTypeLineRuleslive
      this.liveOddTypeRules.oddRules = this.$store.getters.getOddTypeOddRuleslive
      this.liveOddTypeRules.oddNames = this.$store.getters.getOddTypeOddNameslive

      this.pageNumber = 1
      this.is_updating_page = false
      this.is_last_page = false

      if (this.$store.getters.getLiveSports != undefined && this.$store.getters.getLiveSports.length > 0) {
        if(this.sportID == "")
          this.sportID = this.$store.getters.getLiveSports[0].sportID;
        this.pageNumber = 1
        this.is_updating_page = false
        this.is_last_page = false

        this.getLiveList()
        this.getLiveEventScores()
        if(this.$store.getters.getSelectLiveEvent != ''){
          this.getLiveEventSingle(this.$store.getters.getSelectLiveEvent)
        }
        else
          this.getLiveEventView()

        this.connectSocketChannels()
      }
    },
    connectSocketChannels(){
      this.connectOverviewSocket()
      this.connectEventviewSocket()
      this.connectEventScoreSocket()
    },
    gotoEventView(eventID){
      this.view = 1
      // this.closeEventviewSocket()
      // this.eventID = eventID
      // this.connectEventviewSocket()

      // if(this.liveEventScoreList.length > 0)
      //   this.expandEventViewPanel = [...Array(Object.values(this.liveEventScoreList)[0].leagues.length + 2).keys()].map(_ => true)
      this.getLiveEventScores()
      this.getLiveEventSingle(eventID)
    },
    liveMenuSelected(selectedValue){
      // console.log("yes", selectedValue, this.liveEventScoreList.length)
      if(selectedValue == 0){   //overView
        this.pageNumber = 1
        this.is_updating_page = false
        this.is_last_page = false

        this.getLiveList()
        this.closeOverviewSocket()
        this.connectOverviewSocket()
      }
      else if(selectedValue == 1){    //eventView
        this.getLiveEventScores()
        this.closeEventviewSocket()
        this.connectEventviewSocket()
      }
      this.view = selectedValue
      // if(selectedValue == 1 && this.liveEventScoreList.length > 0){
      //   this.expandEventViewPanel = [...Array(Object.values(this.liveEventScoreList)[0].leagues.length + 2).keys()].map(_ => true)
      //   console.log(this.expandEventViewPanel)
      // }
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
        this.getLiveList(true)
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
    is_event_selected(eventID){
      if(this.eventID == eventID)
        return true
      return false
    },
    favouriteSelect(type, eventID, sportID, leagueID){
      if(type == 0){      //add
        if(this.favouriteIDList[sportID] == undefined){
          this.favouriteIDList[sportID] = {}
        }
        if(this.favouriteIDList[sportID][leagueID] == undefined){
          this.favouriteIDList[sportID][leagueID] = {}
        }
        this.favouriteIDList[sportID][leagueID][eventID] = 1
      }
      if(type == 1){      //remove
        if(this.favouriteIDList[sportID] != undefined && this.favouriteIDList[sportID][leagueID] != undefined && this.favouriteIDList[sportID][leagueID][eventID] != undefined){
          delete this.favouriteIDList[sportID][leagueID][eventID]
          if(Object.keys(this.favouriteIDList[sportID][leagueID]).length == 0){
            delete this.favouriteIDList[sportID][leagueID]
            if(Object.keys(this.favouriteIDList[sportID]).length == 0)
              delete this.favouriteIDList[sportID]
          }
        }
      }

      localStorage.liveFavouriteAry = JSON.stringify(this.favouriteIDList)
      this.getLiveEventSingle(eventID)
      this.getFilterScoreList()
    },
    getFilterScoreList(refresh = 0){
      this.liveEventScoreList = {}
      this.favouriteScoreList = []
      var self = this
      if(this.eventScoreData.length == 0){
        this.favouriteIDList = {}
        localStorage.liveFavouriteAry = JSON.stringify(this.favouriteIDList)
        return
      }
      this.eventScoreData.forEach(item =>{
        if(item.events.length == 0)
          return
        if(this.liveEventScoreList[item.sportID] == null){
          this.liveEventScoreList[item.sportID]={
              sportID:item.sportID,
              sportName: item.sportName,
              sportAlias: item.sportAlias,
              leagues: [],
          };
        }

        this.liveEventScoreList[item.sportID].leagues.push(Object.assign({}, item))
        this.liveEventScoreList[item.sportID].leagues[this.liveEventScoreList[item.sportID].leagues.length-1].events = []
        if(Object.keys(this.favouriteIDList).length != 0 && this.favouriteIDList[item.sportID] != undefined && this.favouriteIDList[item.sportID][item.leagueID] != undefined){

          item.events.forEach(function(event,eventIndex, Obj){
            if(self.favouriteIDList[item.sportID][item.leagueID][event.eventID] != undefined){
              self.favouriteScoreList.push(event)
            }
            else{
              if(self.searchEventScoreStr.length == 0 || event.homeTeam.toLowerCase().includes(self.searchEventScoreStr.toLowerCase()) || event.awayTeam.toLowerCase().includes(self.searchEventScoreStr.toLowerCase())){
                self.liveEventScoreList[item.sportID].leagues[self.liveEventScoreList[item.sportID].leagues.length-1].events =
                  [].concat(self.liveEventScoreList[item.sportID].leagues[self.liveEventScoreList[item.sportID].leagues.length-1].events, event)
              }

              // console.log(self.liveEventScoreList[item.sportID].leagues[self.liveEventScoreList[item.sportID].leagues.length-1].events)
            }
          })
          if(this.liveEventScoreList[item.sportID].leagues[this.liveEventScoreList[item.sportID].leagues.length - 1].events.length == 0){
            this.liveEventScoreList[item.sportID].leagues.splice(this.liveEventScoreList[item.sportID].leagues.length - 1, 1)
            if(this.liveEventScoreList[item.sportID].leagues.length == 0)
              delete this.liveEventScoreList[item.sportID]
          }
        }
        else{
          if(this.searchEventScoreStr.length > 0){
            item.events.forEach(function(event,eventIndex, Obj){
              if(event.homeTeam.toLowerCase().includes(self.searchEventScoreStr.toLowerCase()) || event.awayTeam.toLowerCase().includes(self.searchEventScoreStr.toLowerCase())){
                self.liveEventScoreList[item.sportID].leagues[self.liveEventScoreList[item.sportID].leagues.length-1].events =
                  [].concat(self.liveEventScoreList[item.sportID].leagues[self.liveEventScoreList[item.sportID].leagues.length-1].events, event)
              }
            })
            if(this.liveEventScoreList[item.sportID].leagues[this.liveEventScoreList[item.sportID].leagues.length - 1].events.length == 0){
              this.liveEventScoreList[item.sportID].leagues.splice(this.liveEventScoreList[item.sportID].leagues.length - 1, 1)
              if(this.liveEventScoreList[item.sportID].leagues.length == 0)
                delete this.liveEventScoreList[item.sportID]
            }
          }
          else{
            this.liveEventScoreList[item.sportID].leagues[this.liveEventScoreList[item.sportID].leagues.length-1].events = [].concat(item.events)
          }
        }
      })
      // console.log(this.favouriteScoreList)
      // console.log(Object.values(this.liveEventScoreList))
      if(refresh){
        if(Object.values(this.liveEventScoreList)[0] != undefined && Object.values(this.liveEventScoreList)[0].leagues != undefined){
          // this.expandEventViewPanel = [...Array(Object.values(this.liveEventScoreList)[0].leagues.length + 2).keys()].map(_ => true)
          this.expandEventViewPanel = [...Array(10).keys()].map(_ => true)
        }
        else
          this.expandEventViewPanel = [...Array(2).keys()].map(_ => true)
      }
    },
    setLiveTime(){
      var self = this
      var date = ''
      var minute = ''
      var second = ''
      if(this.overViewList != undefined && Object.keys(this.overViewList).length > 0){
        Object.keys(this.overViewList).forEach(leagueID => {
          if(self.overViewList[leagueID].data != undefined && self.overViewList[leagueID].data.dataList != undefined && Object.keys(self.overViewList[leagueID].data.dataList).length > 0){
            Object.keys(self.overViewList[leagueID].data.dataList).forEach(eventID => {
              if(self.overViewList[leagueID].data.dataList[eventID].liveGamePeriod != undefined && self.overViewList[leagueID].data.dataList[eventID].liveGamePeriod == "HT"){
                self.overViewList[leagueID].data.dataList[eventID].liveMinute = self.overViewList[leagueID].data.dataList[eventID].liveGamePeriod
              }
              else if(self.overViewList[leagueID].data.sportAlias == 'soccer'){
                if(self.overViewList[leagueID].data.dataList[eventID].liveTime == undefined){
                  var parseTime = self.overViewList[leagueID].data.dataList[eventID].liveMinute.split(':'); // split it at the colons
                  if(parseTime != null && parseTime.length != 0){
                    // minutes are worth 60 seconds. Hours are worth 60 minutes.
                    var seconds = (+parseTime[0]) *60 + (+parseTime[1]); 
                    self.overViewList[leagueID].data.dataList[eventID].liveTime = seconds
                  }
                }
                else{
                  self.overViewList[leagueID].data.dataList[eventID].liveTime = self.overViewList[leagueID].data.dataList[eventID].liveTime + 1
                }
                minute = ('0' + Math.trunc(self.overViewList[leagueID].data.dataList[eventID].liveTime/60)).substr(-2)
                second = ('0' + self.overViewList[leagueID].data.dataList[eventID].liveTime%60).substr(-2)
                self.overViewList[leagueID].data.dataList[eventID].liveMinute = minute + ':' + second
              }
              else if(self.overViewList[leagueID].data.dataList[eventID].liveClockTimestamp != undefined && self.overViewList[leagueID].data.dataList[eventID].liveMinute != undefined
              && self.overViewList[leagueID].data.dataList[eventID].liveClockStartSeconds != undefined && self.overViewList[leagueID].data.dataList[eventID].liveClockIsStopped == false){    //run count
                if(self.overViewList[leagueID].data.dataList[eventID].liveClockIsCountDown == true){    //count down
                  if(self.overViewList[leagueID].data.dataList[eventID].countTime == undefined){
                    self.overViewList[leagueID].data.dataList[eventID].countTime = Math.round(new Date().getTime()/1000) - self.overViewList[leagueID].data.dataList[eventID].liveClockTimestamp + self.overViewList[leagueID].data.dataList[eventID].liveClockStartSeconds
                  }
                  else{
                    self.overViewList[leagueID].data.dataList[eventID].countTime = self.overViewList[leagueID].data.dataList[eventID].countTime - 1
                  }
                  minute = ('0' + Math.trunc(self.overViewList[leagueID].data.dataList[eventID].countTime/60)).substr(-2)
                  second = ('0' + self.overViewList[leagueID].data.dataList[eventID].countTime%60).substr(-2)
                  self.overViewList[leagueID].data.dataList[eventID].liveMinute = minute + ':' + second
                }
                else if(self.overViewList[leagueID].data.dataList[eventID].liveClockIsCountDown == false){  //count up
                  if(self.overViewList[leagueID].data.dataList[eventID].countTime == undefined){
                    self.overViewList[leagueID].data.dataList[eventID].countTime = Math.round(new Date().getTime()/1000) - self.overViewList[leagueID].data.dataList[eventID].liveClockTimestamp + self.overViewList[leagueID].data.dataList[eventID].liveClockStartSeconds
                  }
                  else{
                    self.overViewList[leagueID].data.dataList[eventID].countTime = self.overViewList[leagueID].data.dataList[eventID].countTime + 1
                  }
                  minute = ('0' + Math.trunc(self.overViewList[leagueID].data.dataList[eventID].countTime/60)).substr(-2)
                  second = ('0' + self.overViewList[leagueID].data.dataList[eventID].countTime%60).substr(-2)
                  self.overViewList[leagueID].data.dataList[eventID].liveMinute = minute + ':' + second
                }
              }
              else if(self.overViewList[leagueID].data.dataList[eventID].liveClockIsStopped == true && self.overViewList[leagueID].data.dataList[eventID].liveGamePeriod != undefined){
                self.overViewList[leagueID].data.dataList[eventID].liveMinute = self.overViewList[leagueID].data.dataList[eventID].liveGamePeriod
              }
            })
          }
        })
      }

      if(this.eventViewList != undefined && this.eventViewList.liveGamePeriod != undefined && this.eventViewList.liveGamePeriod == "HT"){
        this.eventViewList.liveMinute = this.eventViewList.liveGamePeriod
      }
      else if(this.eventViewList != undefined && this.eventViewList.sportAlias == 'soccer'){
        if(this.eventViewList.liveTime == undefined){
          var parseTime = this.eventViewList.liveMinute.split(':'); // split it at the colons
          if(parseTime != null && parseTime.length != 0){
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            var seconds = (+parseTime[0]) *60 + (+parseTime[1]); 
            this.eventViewList.liveTime = seconds
          }
        }
        else{
          this.eventViewList.liveTime = this.eventViewList.liveTime + 1
        }
        minute = ('0' + Math.trunc(this.eventViewList.liveTime/60)).substr(-2)
        second = ('0' + this.eventViewList.liveTime%60).substr(-2)
        this.eventViewList.liveMinute = minute + ':' + second
      }
      else if(this.eventViewList != undefined && this.eventViewList.liveClockTimestamp != undefined && this.eventViewList.liveMinute != undefined
      && this.eventViewList.liveClockStartSeconds != undefined && this.eventViewList.liveClockIsStopped == false){
        if(this.eventViewList.liveClockIsCountDown == true){    //count down
          if(this.eventViewList.liveTime == undefined){
            this.eventViewList.liveTime = Math.round(new Date().getTime()/1000) - this.eventViewList.liveClockTimestamp + this.eventViewList.liveClockStartSeconds
          }
          else{
            this.eventViewList.liveTime = this.eventViewList.liveTime - 1
          }
          minute = ('0' + Math.trunc(this.eventViewList.liveTime/60)).substr(-2)
          second = ('0' + this.eventViewList.liveTime%60).substr(-2)
          this.eventViewList.liveMinute = minute + ':' + second
        }
        else if(this.eventViewList.liveClockIsCountDown == false){   //count up
          if(this.eventViewList.liveTime == undefined){
            this.eventViewList.liveTime = Math.round(new Date().getTime()/1000) - this.eventViewList.liveClockTimestamp + this.eventViewList.liveClockStartSeconds
          }
          else{
            this.eventViewList.liveTime = this.eventViewList.liveTime + 1
          }
          minute = ('0' + Math.trunc(this.eventViewList.liveTime/60)).substr(-2)
          second = ('0' + this.eventViewList.liveTime%60).substr(-2)
          this.eventViewList.liveMinute = minute + ':' + second
        }
      }
      else if(this.eventViewList.liveClockIsStopped == true && this.eventViewList.liveGamePeriod != undefined){
        this.eventViewList.liveMinute = this.eventViewList.liveGamePeriod
      }

      if(this.liveEventScoreList != undefined && Object.keys(this.liveEventScoreList).length > 0){
        Object.keys(this.liveEventScoreList).forEach(sportID => {
          if(self.liveEventScoreList[sportID].leagues != undefined && Object.keys(self.liveEventScoreList[sportID].leagues).length > 0){
            Object.keys(self.liveEventScoreList[sportID].leagues).forEach(leagueID => {
              if(self.liveEventScoreList[sportID].leagues[leagueID].events != undefined && self.liveEventScoreList[sportID].leagues[leagueID].events.length > 0){
                self.liveEventScoreList[sportID].leagues[leagueID].events.map(event => {
                  if(event.liveGamePeriod != undefined && event.liveGamePeriod == "HT"){
                    event.liveMinute = event.liveGamePeriod
                  }
                  else if(self.liveEventScoreList[sportID].sportAlias == 'soccer'){
                    if(event.liveTime == undefined){
                      event.liveTime = Math.round(new Date().getTime()/1000) - event.liveClockTimestamp + event.liveClockStartSeconds
                      var parseTime = event.liveMinute.split(':'); // split it at the colons
                      if(parseTime != null && parseTime.length != 0){
                        // minutes are worth 60 seconds. Hours are worth 60 minutes.
                        event.liveTime = (+parseTime[0]) *60 + (+parseTime[1]); 
                      }
                    }
                    else{
                      event.liveTime = event.liveTime + 1
                    }
                    minute = ('0' + Math.trunc(event.liveTime/60)).substr(-2)
                    second = ('0' + event.liveTime%60).substr(-2)
                    event.liveMinute = minute + ':' + second
                  }
                  else if(event.liveClockTimestamp != undefined && event.liveMinute != undefined && event.liveClockStartSeconds != undefined && event.liveClockIsStopped == false){
                    if(event.liveClockIsCountDown == true){   //count down
                      if(event.liveTime == undefined){
                        event.liveTime = Math.round(new Date().getTime()/1000) - event.liveClockTimestamp + event.liveClockStartSeconds
                      }
                      else{
                        event.liveTime = event.liveTime - 1
                      }
                      minute = ('0' + Math.trunc(event.liveTime/60)).substr(-2)
                      second = ('0' + event.liveTime%60).substr(-2)
                      event.liveMinute = minute + ':' + second
                    }
                    else{   //count up
                      if(event.liveTime == undefined){
                        event.liveTime = Math.round(new Date().getTime()/1000) - event.liveClockTimestamp + event.liveClockStartSeconds
                      }
                      else{
                        event.liveTime = event.liveTime + 1
                      }
                      minute = ('0' + Math.trunc(event.liveTime/60)).substr(-2)
                      second = ('0' + event.liveTime%60).substr(-2)
                      event.liveMinute = minute + ':' + second
                    }
                  }
                  else if(event.liveClockIsStopped == true && event.liveGamePeriod != undefined){
                    event.liveMinute = event.liveGamePeriod
                  }
                  return event;
                })
              }
            })
          }
        })
      }
      this.$forceUpdate()
    },
    selectMarketRow(row){
      this.marketRow = row
      this.changeOddGroup(this.oddGroupID)
    },
    isClosedTime(liveMinute, sportAlias){
      if(sportAlias != "soccer")
        return true
      if(liveMinute.toLowerCase().includes(':')){
        var res = liveMinute.split(":", 1)
        if(res <= this.closingMinuteBetting)
          return true
      }
      else if(liveMinute.toLowerCase().includes('1h')){
        var res = liveMinute.split(" ", 2)
        if(parseInt(res[1]) <= this.closingMinuteBetting)
          return true
      }
      else if(liveMinute.toLowerCase().includes('ht')){
        return true
      }
      else if(liveMinute.toLowerCase().includes('2h')){
        var res = liveMinute.split(" ", 2)
        if(parseInt(res[1] + 45) <= this.closingMinuteBetting)
          return true
      }
      else if(liveMinute.toLowerCase().includes('et1')){
        var res = liveMinute.split("et1", 2)
        if(parseInt(res[1] + 90) <= this.closingMinuteBetting)
          return true
      }
      else if(liveMinute.toLowerCase().includes('et2')){
        var res = liveMinute.split("et2", 2)
        if(parseInt(res[1] + 90 + 15) <= this.closingMinuteBetting)
          return true
      }
      return false
    },
    setOverviewOrderList(){
      return Object.values(this.overViewList).sort(function(a, b){return a.data.leagueOrder-b.data.leagueOrder})
    }
  },
  watch: {
    searchEventScoreStr: function(){
      this.getFilterScoreList(1)
    },
  },
  mounted() {
    var self= this
    if(localStorage.liveFavouriteAry != undefined && localStorage.liveFavouriteAry.length > 0){
      this.favouriteIDList= JSON.parse(localStorage.liveFavouriteAry)
    }
    this.$root.$on("UpdateLiveOddTypeRules", payload => {
      if(this.$route.path == "/live-bet"){
        this.updateLiveOddTypeRules()
      }
    })
    this.$root.$on('liveTime', function(){
      self.setLiveTime()
    })
    this.$root.$on("update-list", ()=>{
      // console.log("yes of course")
      this.$forceUpdate()
    })
    var system_info = JSON.parse(localStorage.system_conf);
    this.closingMinuteBetting = system_info.closingMinuteBetting
  },
  created(){
    window.addEventListener('scroll', this.onMainScrollPos);

  },
};
</script>
