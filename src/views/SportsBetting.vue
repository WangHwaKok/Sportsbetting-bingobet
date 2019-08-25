<template>
  <v-app dark style="min-width:1280px;background: url('/img/bg_login.jpg'); background-size: 100% 100%;">
    <!-- <core-filter /> -->
    <v-content class="main-content">
      <core-header/>
      <core-socket/>
      <core-inactivity/>
      <div id="core-view" style="background:black;">
        <v-fade-transition mode="out-in">
          <v-layout class="sports-betting-view pb-4" fill-height style="background: url('/img/bg_sports_betting.jpg'); background-size: 100% 100%;">
            <v-flex xs2 class="pl-1 mt-2 scroll-y" style="min-width:300px;">
              <v-expansion-panel v-model="panel" expand>
                <v-expansion-panel-content expand-icon="mdi-menu-down" class="top-leagues">
                  <template v-slot:header>
                    <div class="subheading font-weight-bold">{{$t('Betting.top_leagues')}}</div>
                  </template>
                  <v-list>
                    <v-list-tile v-for="(item, index) in topLeagues" :key="index" @click="topLeagueSelected(item.sportID, item.categoryID, item.leagueID)" style="cursor:pointer;">
                      <img :src="item.icon" style="width: 20px; height: 20px; margin-right: 10px;">

                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ item.name }}
                          <span style="float: right;">({{ item.count }})</span>
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-expansion-panel-content>
                <v-expansion-panel-content expand-icon="mdi-menu-down" class="tertiary">
                  <template v-slot:header>
                    <div class="d-flex align-center subheading font-weight-bold">
                      <div><v-icon color="yellow">mdi-star</v-icon></div>
                      <div style="width:100%;">{{$t('Betting.favourites')}}</div>
                    </div>
                  </template>
                  <template v-if="this.prematchFavourites.length == 0">
                    <v-card class="pa-2 tertiary">
                      <v-card-text class="league-text">
                        {{$t('Betting.to_select_favourites')}}
                      </v-card-text>
                    </v-card>
                  </template>
                  <template v-else>
                    <v-layout v-for="(favourite, idx) in prematchFavourites" :key="idx" align-center justify-start
                              class="tertiary1 pa-1 px-2 mx-2 mb-2" style="cursor:pointer;border-radius:2px;"
                              @click="selectPrematchFavourite(favourite, idx)">
                      <img class="sb-icon" :src="`/img/country_flag/${favourite.categoryAlias}.png`" style="margin-right:10px;"/>
                      <div class="caption" style="width:100%;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;">{{ favourite.leagueName }}</div>
                      <span class="body-2" style="margin-right:5px;">{{ favourite.total }}</span>
                      <div :class='"favourite-status "+ favourite.checked'></div>
                      <!-- <v-icon size="12" :class="`${favourite.checked=='on'?'rectangle-icon':''}`">mdi-checkbox-blank</v-icon> -->
                      <v-icon size="18" class="remove-icon" @click.stop="removeFavourite(favourite, idx)">mdi-close</v-icon>
                    </v-layout>
                    <!-- <div class="align-center justify-start" style="width:100%;display:flex;">
                      <img class="sb-icon" :src="`/img/country_flag/${favourite.categoryAlias}.png`" />
                      <div class="w-100">{{ favourite.leagueName }}</div>
                    </div> -->
                  </template>
                </v-expansion-panel-content>
                <v-expansion-panel-content expand-icon="mdi-menu-down" class="tertiary">
                  <template v-slot:header>
                    <div class="subheading font-weight-bold">{{$t('Betting.time_filters')}}</div>
                  </template>
                  <v-slider
                          v-model="times"
                          step="1"
                          :max="4"
                          tick-size="5"
                          class="pl-4 pr-4 mt-4"
                          thumb-color="primary"
                          thumb-label="always"
                          :tick-labels="ticksLabels"
                  >
                    <template v-slot:thumb-label="props">
                      <span>{{ ticksLabels[props.value] }}</span>
                    </template>
                  </v-slider>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-card color="tertiary" class="search-wrapper pa-2">
                <v-text-field append-icon="mdi-magnify" class="mt-2" :label='$t("Betting.league_search")' solo-inverted v-model="searchSportItem"></v-text-field>
              </v-card>
              <v-card color="tertiary" class="sports-tree">
                <v-card-title class="pb-1" style="padding-right:5px;">
                  <v-layout align-center justify-start>
                    <span class="subheading font-weight-bold">{{$t('Betting.sports')}}</span>
                    <v-spacer></v-spacer>
                    <v-icon style="cursor:pointer;" @click="clearSportItems">mdi-delete-forever</v-icon>
                  </v-layout>

                </v-card-title>
                <core-sports-betting-tree-list/>
              </v-card>
            </v-flex>

            <v-flex v-if="eventViewFlag == 1" xs8 class="mx-1 mt-2 scroll-y eventview">
              <template v-if="!is_waiting_page">
              <v-container fluid class="pa-0 ma-0 tertiary">
                <v-layout>
                  <v-flex style="display: flex; align-items: center;" class>
                    <v-btn class="ma-1 pa-0" icon outlined color="black"
                      @click="backToPremath()">
                      <v-icon>mdi-less-than</v-icon>
                    </v-btn>
                    <!-- <v-icon
                            style="height:100%;width:50px;cursor:pointer;"
                            @click="backToPremath()"
                    >mdi-less-than</v-icon> -->
                    <v-breadcrumbs :items="breadcrumbs" divider=">">
                      <v-breadcrumbs-item
                              slot="item"
                              slot-scope="{ item }"
                              :disabled="item.disabled"
                              exact
                              @click="selectBreadcrumb(item.sportID, item.categoryID, item.eventID)"
                      >{{ item.text }}</v-breadcrumbs-item>
                    </v-breadcrumbs>
                  </v-flex>
                  <v-spacer>
                  </v-spacer>
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
                <v-layout
                        style="background-image: url('/img/livebetbanner.png'); background-size: 100% auto; background-position: 0,-200px; height:200px; display: block;"
                >
                  <v-img :src="`/img/${eventViewData.sportAlias}board.png`" height="200">
                    <!-- <v-flex class="black" style="opacity: .4; height: 100%;"></v-flex> -->
                    <v-flex style="position: relative; left: 0px; font-size: 16px;">
                      <v-layout class="pa-3 pt-5">
                        <v-flex xs12 class="text-xs-center">
                          <img
                                  class="sb-icon"
                                  :src="`/img/country_flag/${eventViewData.categoryAlias}.png`"
                          >
                          {{eventViewData.categoryName}}, {{eventViewData.leagueName}}
                        </v-flex>
                      </v-layout>
                      <v-layout class="pa-2">
                        <v-flex xs12 class="text-xs-center">
                          <span
                                  class="headline font-weight-medium"
                          >{{eventViewData.homeTeam}} - {{eventViewData.awayTeam}}</span>
                        </v-flex>
                      </v-layout>
                      <v-layout class="pa-3">
                        <v-flex xs12 class="text-xs-center">
                          <span class="title font-weight-medium">{{eventViewData.eventDate}}</span>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-img>
                </v-layout>

                <v-layout>
                  <v-btn-toggle v-model="toggle_kinds" mandatory class="bet-type tertiary">
                    <v-btn flat style="width: 12.5%; opacity: 1;">{{$t('Betting.all')}}</v-btn>
                    <v-btn
                            v-for="btn in oddGroups"
                            :key="btn.oddGroupID"
                            flat
                            style="width: 12.5%; opacity: 1;"
                    >{{btn.name}}</v-btn>
                  </v-btn-toggle>
                </v-layout>
                <v-layout style="font-size: 16px;" class="mid-panel">
                  <v-flex v-for="count in marketRow" :key="count" :class="`pa-1 tertiary xs${12/marketRow}`">
                    <v-layout
                            xs12
                            column
                            v-for="(oddType,firstIndex) in oddTypeList"
                            :key="firstIndex"
                            v-if="(firstIndex >= (count-1)*rowOddCount) && (firstIndex < count*rowOddCount)"
                            class="mid-panel"
                    >
                      <v-flex>
                        <span class="subheading pa-1 odd-type-text">{{oddType.name}}</span>
                      </v-flex>
                      <v-flex
                              v-if="oddType.lines != null"
                              v-for="(line,index) in oddType.lines"
                              :key="index"
                      >
                        <v-layout xs12 row>
                          <v-flex
                                  v-for="(item, idx) in line"
                                  :key="idx"
                                  :class="`xs${12/line.length} pa-1 ma-1 event-detail-cell ${is_betslip_odd(eventViewData.eventID, oddType.oddTypeID, item.oddID)?'active':''}`"
                                  @click="update_betslip('prematch', eventViewData.eventID, eventViewData.homeTeam, eventViewData.awayTeam, oddType.oddTypeID, oddType.name,
                              item.oddID, item.value, item.name, item.special, item.isSuspended==undefined?0:item.isSuspended)"
                          >
                            <p class="body-2 font-weight-regular pa-1 ma-0 market-odd-name" v-if="item.special != undefined && item.special!= 0">{{item.name}}({{item.special}})</p>
                            <p class="body-2 font-weight-regular pa-1 ma-0 market-odd-name" v-else>{{item.name}}</p>
                            <span class="body-2 font-weight-regular pa-1 market-odd-score odd-price-text" v-if="item.isSuspended == 1"><v-icon color="grey">mdi-lock-outline</v-icon></span>
                            <span class="body-2 font-weight-regular pa-1 market-odd-score odd-price-text" v-else>{{item.value}}</span>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
              </template>
              <template v-else>
                <v-layout justify-center align-center>
                  <v-flex>
                    <ScaleLoader
                            class="scale-loader"
                            :loading="is_waiting_page"
                            color="lawngreen"
                            :height=100
                            :width=10
                            :radius=1
                            margin="2px"
                            sizeUnit="px"
                    />
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>

            <v-flex v-if="eventViewFlag == 0" xs8 class="mid-panel mx-1 mt-2 scroll-y" id="main-scroll" ref="matchTable">
              <v-layout v-if="!is_refresh_page" column class="pa-0" v-scroll:#main-scroll="onMainScrollPos" >
                <v-card color="primary" height="100" class="overflow-hidden">
                  <v-img src="/img/prematch_banner/vector.png" height="100%">
                    <v-subheader class="display-1 ma-2">{{$t('Betting.football')}}</v-subheader>
                  </v-img>
                  <v-img
                          src="/img/prematch_banner/football.png"
                          height="120"
                          width="120"
                          class="prematch-game-img"
                  ></v-img>
                  <v-img
                          src="/img/prematch_banner/crowds.png"
                          style="margin-top: -85px;"
                          min-height="280"
                  />
                </v-card>

                <v-toolbar :dense="true">
                  <v-toolbar-items class="align-center" style="height:40px">
                    <v-btn
                            v-for="(sport, sportIdx) in topMenuSportList"
                            :key="sportIdx"
                            flat
                            :class="sportID == sport.sportID ? 'tertiary2' : ''"
                            @click="topMenuSelected(sport.sportID)"
                    >
                      <div class="mr-1" :class="`sport-title-icon ds-sport-icon ds-icon-${sport.sportID}`"></div>&nbsp;{{sport.name}}
                    </v-btn>
                    <v-text-field
                            append-icon="mdi-magnify"
                            :label='$t("Betting.event_search")'
                            solo-inverted
                            height="40"
                            class="mr-4 mt-0 mb-0"
                            style="margin-left:30px;width:250px;"
                            v-model="searchPrematchStr"
                            v-on:keyup.enter="searchPrematchList"
                    ></v-text-field>
                  </v-toolbar-items>
                </v-toolbar>
                <v-expansion-panel v-model="mainPanel" expand>
                  <v-expansion-panel-content v-if="!menuSelected" expand-icon="mdi-menu-down" class="prematchMainPanel">
                    <template v-slot:header>
                      <div>{{$t('Betting.live')}}</div>
                    </template>
                    <template v-if="liveListTable[0] != undefined && liveListTable[0].data != undefined && Object.keys(liveListTable[0].data).length > 0">
                      <v-data-table
                              v-for="(table, index) in liveListTable"
                              :id="`livetable_${index}`"
                              :key="index"
                              :headers="table.headers"
                              :items="Object.values(table.data)"
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
                                    v-if="header.order == undefined || (header.order != undefined && (hasSize==0 || (hasSize== 1 && header.order <= 1) || (hasSize== 2 && header.order == 0)))"
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
                              <v-layout align-center v-if="header.sportID || header.countryFlag">
                                <v-flex d-flex v-if="header.sportID"
                                        :class="`justify-center sport-title-icon ds-sport-icon ds-icon-${header.sportID}`">
                                </v-flex>
                                <div v-if="header.countryFlag">
                                  <v-img
                                          :src="header.countryFlag"
                                          class="sb-icon"
                                  />
                                </div>
                              </v-layout>
                            </th>
                          </tr>
                        </template>
                        <template v-slot:items="props">
                          <template v-for="event in Object.values(props.item.dataList)" v-if="props.item.dataList != undefined && Object.keys(props.item.dataList).length > 0">
                            <tr>
                              <td
                                      class="text-xs-center"
                              >{{ event.liveMinute}}</td>

                              <td class="text-xs-left">{{event.homeTeam+' - '+event.awayTeam}}</td>
                              <td class="text-xs-center"><span class="green--text subheading font-weight-bold">{{ event.liveScoreHome+" - "+event.liveScoreAway }}</span></td>
                              <td
                                      class="text-xs-center"
                                      v-for="(oddType, oddTypeIdx) in liveOddTypeRules.oddRules[props.item.sportAlias].oddTypes"
                                      v-if="hasSize==0 || (hasSize== 1 && oddTypeIdx <= 1) || (hasSize== 2 && oddTypeIdx == 0)"
                              >
                                <v-layout row style="height:80%;">
                                  <v-flex d-flex
                                          v-if="liveOddTypeRules.oddRules[props.item.sportAlias].hasSpecial[oddTypeIdx]"
                                          :class="`ma-1 align-center xs${12/(liveOddTypeRules.lineRules[oddType].length+1)}`"
                                  >
                                    <div class="yellow--text text--darken-4" v-if="event.oddTypes[oddType] != undefined && event.oddTypes[oddType].lines[0][0].special > 0">
                                      {{event.oddTypes[oddType].lines[0][0].special}}
                                    </div>
                                    <div v-else>
                                      <!-- <v-icon> mdi-lock-outline</v-icon> -->
                                    </div>
                                  </v-flex>
                                  <template v-for="(oddCell, oddCellIdx) in liveOddTypeRules.lineRules[oddType]">
                                    <v-flex d-flex
                                            v-if="event.oddTypes != undefined && event.oddTypes[oddType] != undefined && event.oddTypes[oddType].lines[0][oddCellIdx] != undefined &&
                                        event.oddTypes[oddType].lines[0][oddCellIdx].value > 0 && event.oddTypes[oddType].lines[0][oddCellIdx].isSuspended == 0 && isClosedTime(event.liveMinute, event.sportAlias)"
                                            :class="`ma-1 align-center tableCell xs${12/(liveOddTypeRules.lineRules[oddType].length +
                                        (liveOddTypeRules.oddRules[props.item.sportAlias].hasSpecial[oddTypeIdx] ? 1 : 0))} ${event.oddTypes[oddType].lines[0][oddCellIdx].changes != undefined ? event.oddTypes[oddType].lines[0][oddCellIdx].changes : ''} ${is_betslip_odd(event.eventID, event.oddTypes[oddType].oddTypeID, event.oddTypes[oddType].lines[0][oddCellIdx].oddID)?'active':''}`"
                                            @click="update_betslip('live', event.eventID, event.homeTeam, event.awayTeam, event.oddTypes[oddType].oddTypeID, event.oddTypes[oddType].name,
                                    event.oddTypes[oddType].lines[0][oddCellIdx].oddID, event.oddTypes[oddType].lines[0][oddCellIdx].value, event.oddTypes[oddType].lines[0][oddCellIdx].name, event.oddTypes[oddType].lines[0][oddCellIdx].special, event.oddTypes[oddType].lines[0][oddCellIdx].isSuspended==undefined?0:event.oddTypes[oddType].lines[0][oddCellIdx].isSuspended)"
                                    >
                                      <span class="caption">{{event.oddTypes[oddType].lines[0][oddCellIdx].value}}</span>
                                    </v-flex>

                                    <v-flex d-flex
                                            v-else
                                            :class="`ma-1 align-center xs${12/(liveOddTypeRules.lineRules[oddType].length +
                                        (liveOddTypeRules.oddRules[props.item.sportAlias].hasSpecial[oddTypeIdx] ? 1 : 0))}`"
                                    >
                                      <div>
                                        <v-icon color="grey">mdi-lock-outline</v-icon>
                                      </div>
                                      <!-- <div v-if="event.oddTypes != undefined && event.oddTypes[oddType] != undefined && event.oddTypes[oddType].lines[0][oddCellIdx] != undefined">
                                        {{event.oddTypes[oddType].lines[0][oddCellIdx].value}}
                                        {{event.oddTypes[oddType].lines[0][oddCellIdx].isSuspended}}
                                      </div> -->
                                    </v-flex>
                                  </template>
                                </v-layout>
                              </td>

                              <td class="text-xs-center">
                                <div
                                        class="align-center marketCell"
                                        @click="gotoEventView(1, event.eventID)"
                                >+{{ event.marketCount }}</div>
                              </td>
                              <td class="text-xs-center">
                                <v-icon>mdi-chart-bar-stacked</v-icon>
                              </td>
                            </tr>
                          </template>
                        </template>
                      </v-data-table>
                    </template>
                    <!-- <template v-else>
                      <v-flex d-flex xs12 justify-center align-center style="height:60px;">
                        <span class="title pa-2" style="text-align:center">{{$t('Betting.no_data_available')}}</span>
                      </v-flex>
                    </template> -->
                  </v-expansion-panel-content>
                  <v-expansion-panel-content expand-icon="mdi-menu-down" class="prematchMainPanel">
                    <template v-slot:header>
                      <div>{{$t('Betting.upcoming')}}</div>
                    </template>
                    <template v-if="prematchListTable[0] != undefined && prematchListTable[0].data != undefined && Object.keys(prematchListTable[0].data).length > 0">
                      <v-data-table
                        v-for="(table, index) in prematchListTable"
                        :id="`table_${index}`"
                        :key="index"
                        :headers="table.headers"
                        :items="table.data"
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
                                  class="text-xs-center"
                          >{{ props.item.eventDate | moment("DD/MM HH:mm")}}</td>

                          <td class="text-xs-left">{{props.item.homeTeam+' - '+props.item.awayTeam}}</td>
                          <td class="text-xs-center">{{ props.item.mbs }}</td>
                          <!-- <td class="text-xs-right">{{ props.item.side1 }}</td> -->
                          <td
                                  class="text-xs-center"
                                  v-for="(oddType, oddTypeIdx) in prematchOddTypeRules.oddRules[props.item.sportAlias].oddTypes"
                                  :key="oddTypeIdx"
                          >
                            <v-layout row style="height:80%;">
                              <v-flex d-flex
                                      v-if="prematchOddTypeRules.oddRules[props.item.sportAlias].hasSpecial[oddTypeIdx]"
                                      :class="`ma-1 align-center xs${12/(prematchOddTypeRules.lineRules[oddType].length+1)}`"
                              >
                                <div class="yellow--text text--darken-4" v-if="props.item.oddTypes[oddType] != undefined && props.item.oddTypes[oddType].lines[0][0].special > 0">
                                  {{props.item.oddTypes[oddType].lines[0][0].special}}
                                </div>
                                <div v-else>
                                  <!-- <v-icon> mdi-lock-outline</v-icon> -->
                                </div>
                              </v-flex>
                              <template v-for="(oddCell, oddCellIdx) in prematchOddTypeRules.lineRules[oddType]">
                                <v-flex d-flex
                                        v-if="props.item.oddTypes[oddType] != undefined && props.item.oddTypes[oddType].lines[0][oddCellIdx] != undefined &&
                                    props.item.oddTypes[oddType].lines[0][oddCellIdx].value > 0 && props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended == 0"
                                        :class="`ma-1 align-center tableCell xs${12/(prematchOddTypeRules.lineRules[oddType].length +
                                    (prematchOddTypeRules.oddRules[props.item.sportAlias].hasSpecial[oddTypeIdx] ? 1 : 0))} ${is_betslip_odd(props.item.eventID, props.item.oddTypes[oddType].oddTypeID, props.item.oddTypes[oddType].lines[0][oddCellIdx].oddID)?'active':''}`"
                                        @click="update_betslip('prematch', props.item.eventID, props.item.homeTeam, props.item.awayTeam, props.item.oddTypes[oddType].oddTypeID, props.item.oddTypes[oddType].name,
                                    props.item.oddTypes[oddType].lines[0][oddCellIdx].oddID, props.item.oddTypes[oddType].lines[0][oddCellIdx].value, props.item.oddTypes[oddType].lines[0][oddCellIdx].name, props.item.oddTypes[oddType].lines[0][oddCellIdx].special, props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended==undefined?0:props.item.oddTypes[oddType].lines[0][oddCellIdx].isSuspended)"
                                >
                                  <div>{{props.item.oddTypes[oddType].lines[0][oddCellIdx].value}}</div>
                                </v-flex>

                                <v-flex d-flex
                                        v-else
                                        :class="`ma-1 align-center xs${12/(prematchOddTypeRules.lineRules[oddType].length +
                                    (prematchOddTypeRules.oddRules[props.item.sportAlias].hasSpecial[oddTypeIdx] ? 1 : 0))}`"
                                >
                                  <div>
                                    <v-icon color="grey"> mdi-lock-outline</v-icon>
                                  </div>
                                </v-flex>
                              </template>
                            </v-layout>
                          </td>

                          <td class="text-xs-center">
                            <div
                                    class="align-center marketCell"
                                    @click="gotoEventView(0, props.item.eventID)"
                            >+{{ props.item.marketCount }}</div>
                          </td>
                          <td class="text-xs-center">
                            <v-icon>mdi-chart-bar-stacked</v-icon>
                          </td>
                        </template>
                      </v-data-table>
                    </template>
                    <!-- <template v-else>
                      <v-flex d-flex xs12 justify-center align-center style="height:60px;">
                        <span class="title pa-2" style="text-align:center">{{$t('Betting.no_data_available')}}</span>
                      </v-flex>
                    </template> -->
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-layout>
              <!-- <v-layout align-center justify-center>
                <v-progress-circular
                  v-if="is_updating_page == true"
                  :size="70"
                  :width="7"
                  color="green"
                  indeterminate
                ></v-progress-circular>
              </v-layout> -->
              <v-layout v-if="is_updating_page || is_refresh_page" justify-center align-center>
                <v-flex>
                  <ScaleLoader
                          class="scale-loader"
                          :loading="is_updating_page || is_refresh_page"
                          color="lawngreen"
                          :height=100
                          :width=10
                          :radius=1
                          margin="2px"
                          sizeUnit="px"
                  />
                </v-flex>
              </v-layout>
              <!-- <v-layout v-if="is_refresh_page" justify-center align-center fill-height>
                <v-flex>
                  <ScaleLoader
                    class="scale-loader"
                    :loading="is_refresh_page"
                    color="lawngreen"
                    :height=100
                    :width=10
                    :radius=1
                    margin="2px"
                    sizeUnit="px"
                  />
                </v-flex>
              </v-layout> -->
            </v-flex>

            <v-flex xs2 class="mr-1 mt-2 scroll-y" style="overflow-x:hidden;min-width:250px;">
              <core-bet-slip/>
            </v-flex>
          </v-layout>
        </v-fade-transition>
        <core-footer/>
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import { constants } from 'crypto';
import { parse } from 'path';
  export default {
    data() {
      return {
        topLeagues: [],
        panel: [true, true, true],
        prematchListTable: [],
        topMenuSportList: [],
        prematchData: [],
        liveListTable: [],
        pagination: {
          rowsPerPage: -1
        },
        mainPanel: [true, true],
        pageNumber: 1,
        sportID: "",
        leagueID: "",
        categoryID: "",
        timeFilter: "",
        searchPrematchStr: "",
        times: 0,
        ticksLabels: ["All", "6h", "12h", "24h", "48h"],
        eventViewFlag: 0,
        eventViewLayoutCount: 2,
        eventViewData: [],
        toggle_kinds: 0,
        oddGroups: [],
        oddTypeList: [],
        rowOddCount: 0,
        breadcrumbs: [],
        socketOverviewLan: '',
        prematchOddTypeRules: {
          lineRules:{},
          oddNames:{},
          oddRules:{},
        },
        liveOddTypeRules: {
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

        if(this.prematchOddTypeRules.oddRules.length == 0)
          return
        this.is_updating_page = true
        this.axios
                .post("zt_prematch_list", {
                          sportID: this.sportID,
                          timeFilter: this.timeFilter,
                          userID: this.$store.getters.getUserId,
                          // categoryID: this.categoryID,
                          // leagueID: this.leagueID,
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
                    var apiData = response.data.success.data;
                    if(apiData.leagues.length == 0){
                      this.is_last_page = true
                      this.is_updating_page = false
                      this.prematchListTable = [{headers:[], data:[]}]
                      return;
                    }

                    if(!pagination){
                      this.prematchListTable = [{headers:[], data:[]}];
                      var headers = [
                        {
                          sportID: apiData.leagues[0].sportID,
                          width: "10%",
                          align: "center"
                        },
                        {
                          text: apiData.leagues[0].sportName,
                          align: "left",
                          width: "*"
                        },
                        { text: "MBS", align: "center", width: "5%" }
                      ];

                      if(this.prematchOddTypeRules.oddRules[apiData.leagues[0].sportAlias] != undefined){
                        var self = this
                        this.prematchOddTypeRules.oddRules[apiData.leagues[0].sportAlias].oddTypes.forEach(function(oddType, oddIndex, Object){
                          var partHeader = {}
                          partHeader.text = self.prematchOddTypeRules.oddNames[oddType]
                          partHeader.align = "center"
                          var specialCell = self.prematchOddTypeRules.oddRules[apiData.leagues[0].sportAlias].hasSpecial[oddIndex] ? 1 : 0
                          partHeader.specialCell = specialCell
                          partHeader.cellCount = self.prematchOddTypeRules.lineRules[oddType].length + specialCell
                          partHeader.width = (partHeader.cellCount)*5 + "%"
                          partHeader.cell = self.prematchOddTypeRules.lineRules[oddType]
                          headers.push(partHeader)
                        });
                      }

                      headers.push({
                        text: "+",
                        align: "center",
                        width: "5%"
                      });
                      headers.push({
                        text: "",
                        align: "center",
                        width: "5%"
                      });

                      this.prematchListTable[0].headers = headers
                    }

                    var data = []
                    apiData.leagues.forEach(league => {

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
                    })
                    this.prematchListTable[0].data = this.prematchListTable[0].data.concat(data)
                    // console.log(this.prematchListTable[0].data.length)
                    // this.prematchListTable[0].data = data

                    // console.log(this.prematchListTable)
                    this.is_updating_page = false
                  }

                })
                .catch(e => {
                  console.log(e);
                });
      },
      setLiveTime(){
        if(this.liveListTable[0] != undefined && this.liveListTable[0].data != undefined && Object.keys(this.liveListTable[0].data).length > 0){
          var self = this
          var date = ''
          var minute = ''
          var second = ''
          Object.keys(this.liveListTable[0].data).forEach(leagueID => {
            if(self.liveListTable[0].data[leagueID].dataList != undefined && Object.keys(self.liveListTable[0].data[leagueID].dataList).length > 0){
              Object.keys(self.liveListTable[0].data[leagueID].dataList).forEach(eventID => {
                if(self.liveListTable[0].data[leagueID].dataList[eventID].liveGamePeriod != undefined && self.liveListTable[0].data[leagueID].dataList[eventID].liveGamePeriod == "HT"){
                  self.liveListTable[0].data[leagueID].dataList[eventID].liveMinute = self.liveListTable[0].data[leagueID].dataList[eventID].liveGamePeriod
                }
                else if(self.liveListTable[0].data[leagueID].sportAlias == 'soccer'){
                  if(self.liveListTable[0].data[leagueID].dataList[eventID].liveTime == undefined){
                    var parseTime = self.liveListTable[0].data[leagueID].dataList[eventID].liveMinute.split(':'); // split it at the colons
                    if(parseTime == null && parseTime.length == 0)
                      return
                    // minutes are worth 60 seconds. Hours are worth 60 minutes.
                    var seconds = (+parseTime[0]) *60 + (+parseTime[1]); 
                    self.liveListTable[0].data[leagueID].dataList[eventID].liveTime = seconds
                  }
                  else{
                    self.liveListTable[0].data[leagueID].dataList[eventID].liveTime = self.liveListTable[0].data[leagueID].dataList[eventID].liveTime + 1
                  }
                  minute = ('0' + Math.trunc(self.liveListTable[0].data[leagueID].dataList[eventID].liveTime/60)).substr(-2)
                  second = ('0' + self.liveListTable[0].data[leagueID].dataList[eventID].liveTime%60).substr(-2)
                  self.liveListTable[0].data[leagueID].dataList[eventID].liveMinute = minute + ':' + second
                }
                else if(self.liveListTable[0].data[leagueID].dataList[eventID].liveClockTimestamp != undefined && self.liveListTable[0].data[leagueID].dataList[eventID].liveMinute != undefined
                        && self.liveListTable[0].data[leagueID].dataList[eventID].liveClockStartSeconds != undefined && self.liveListTable[0].data[leagueID].dataList[eventID].liveClockIsStopped == false){    //run count
                  if(self.liveListTable[0].data[leagueID].dataList[eventID].liveTime == undefined){
                    self.liveListTable[0].data[leagueID].dataList[eventID].liveTime = Math.round(new Date().getTime()/1000) - self.liveListTable[0].data[leagueID].dataList[eventID].liveClockTimestamp + self.liveListTable[0].data[leagueID].dataList[eventID].liveClockStartSeconds
                  }
                  else{
                    if(self.liveListTable[0].data[leagueID].dataList[eventID].liveClockIsCountDown == true){    //count down
                      self.liveListTable[0].data[leagueID].dataList[eventID].liveTime = self.liveListTable[0].data[leagueID].dataList[eventID].liveTime - 1
                    }
                    else if(self.liveListTable[0].data[leagueID].dataList[eventID].liveClockIsCountDown == false){  //count up
                      self.liveListTable[0].data[leagueID].dataList[eventID].liveTime = self.liveListTable[0].data[leagueID].dataList[eventID].liveTime + 1
                    }
                  }
                  minute = ('0' + Math.trunc(self.liveListTable[0].data[leagueID].dataList[eventID].liveTime/60)).substr(-2)
                  second = ('0' + self.liveListTable[0].data[leagueID].dataList[eventID].liveTime%60).substr(-2)
                  self.liveListTable[0].data[leagueID].dataList[eventID].liveMinute = minute + ':' + second
                }
                else if(self.liveListTable[0].data[leagueID].dataList[eventID].liveClockIsStopped == true && self.liveListTable[0].data[leagueID].dataList[eventID].liveGamePeriod != undefined){
                  self.liveListTable[0].data[leagueID].dataList[eventID].liveMinute = self.liveListTable[0].data[leagueID].dataList[eventID].liveGamePeriod
                }
              })
            }
          })
        }

      },
      setLiveList(apiData="", updateOddsData="", insertOddTypeData="", removeOddTypeData="", updateEventData="", removeEventData="", insertEventData="") {
        if(this.liveOddTypeRules.oddRules.length == 0)
          return
        if(apiData != ""){
          this.liveListTable = [{headers:[], data:[]}]
          if(apiData.leagues.length == 0)
            return
          var headers = [
            {
              sportID: apiData.leagues[0].sportID,
              width: "10%",
              align: "center"
            },
            {
              text: apiData.leagues[0].sportName,
              align: "left",
              width: "*"
            },
            { text: "", align: "center", width: "8%" }
          ];

          if(this.liveOddTypeRules.oddRules[apiData.leagues[0].sportAlias] != undefined){
            var self = this
            this.liveOddTypeRules.oddRules[apiData.leagues[0].sportAlias].oddTypes.forEach(function(oddType, oddIndex, Object){
              var partHeader = {}
              partHeader.text = self.liveOddTypeRules.oddNames[oddType]
              partHeader.align = "center"
              var specialCell = self.liveOddTypeRules.oddRules[apiData.leagues[0].sportAlias].hasSpecial[oddIndex] ? 1 : 0
              partHeader.specialCell = specialCell
              partHeader.cellCount = self.liveOddTypeRules.lineRules[oddType].length + specialCell
              partHeader.width = (partHeader.cellCount)*5 + "%"
              partHeader.cell = self.liveOddTypeRules.lineRules[oddType]
              partHeader.order = oddIndex
              headers.push(partHeader)
            });
          }

          headers.push({
            text: "+",
            align: "center",
            width: "5%"
          });
          headers.push({
            text: "",
            align: "center",
            width: "5%"
          });

          this.liveListTable[0].headers = headers

          var data = []
          var count = 0
          apiData.leagues.forEach(league => {

            var leaguePartTable = {
              leagueID: league.leagueID,
              sportID: league.sportID,
              sportAlias: league.sportAlias,
              categoryAlias: league.categoryAlias,
              categoryName: league.categoryName,
              leagueName: league.leagueName,
              dataList: {}
            };
            if(league.events != undefined && league.events.length > 0){
              for(var i = 0; i < league.events.length; i ++){
                // if(count == 10){
                //   break
                // }
                var event = league.events[i]
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
                event.oddTypes.forEach(oddType => {
                  dataItem.oddTypes[oddType.alias] = oddType
                })
                leaguePartTable.dataList[event.eventID] = dataItem
                // data.push(dataItem)
                // count ++;
              }
            }
            this.liveListTable[0].data[league.leagueID] = leaguePartTable
          })
          this.liveListTable[0].data = this.liveListTable[0].data.concat(data)
          // console.log('apiData',this.liveListTable[0])
        }
        else if (updateOddsData != "" && updateOddsData.odds != undefined && updateOddsData.odds.length > 0){
          var index = -1;
          if(this.liveListTable[0].data[updateOddsData.leagueID] != undefined && this.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID] != undefined
                  && this.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes != undefined
                  && this.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias] != undefined){

            var self = this;
            this.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0].forEach(function(line, line_index){
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

                  var orgVal = self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].value;

                  // self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[index].lines[0][line_index].changes = "";

                  // var changes = "";

                  if( orgVal > updateOddsData.odds[upt_line_index].value)
                  {
                    if(self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == undefined)
                      self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'decrease1'
                    else if(self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == 'decrease1'){
                      self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'decrease2'
                    }
                    else if(self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == 'decrease2'){
                      self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'decrease1'
                    }
                  }
                  else if(orgVal < updateOddsData.odds[upt_line_index].value){
                    if(self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == undefined)
                      self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'increase1'
                    else if(self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == 'increase1'){
                      self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'increase2'
                    }
                    else if(self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes == 'increase2'){
                      self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = 'increase1'
                    }
                  }

                  // self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].changes = changes;

                  self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].value = updateOddsData.odds[upt_line_index].value;
                }

                if(updateOddsData.odds[upt_line_index].isSuspended != undefined)
                  self.liveListTable[0].data[updateOddsData.leagueID].dataList[updateOddsData.eventID].oddTypes[updateOddsData.oddTypeAlias].lines[0][line_index].isSuspended = updateOddsData.odds[upt_line_index].isSuspended;
              }
            })
          }
          // this.$forceUpdate()
          // console.log('updateOdds',this.liveListTable[0])
        }
        else if(insertOddTypeData != "" && insertOddTypeData.leagueID != undefined && insertOddTypeData.eventID != undefined && insertOddTypeData.alias != undefined){
          if(insertOddTypeData.lines != undefined && insertOddTypeData.lines[0] != undefined && insertOddTypeData.lines[0].length > 0 && this.liveListTable[0].data[insertOddTypeData.leagueID] != undefined
                  && this.liveListTable[0].data[insertOddTypeData.leagueID]['dataList'][insertOddTypeData.eventID] != undefined){

            if(this.liveListTable[0].data[insertOddTypeData.leagueID]['dataList'][insertOddTypeData.eventID].oddTypes != undefined
                    && this.liveListTable[0].data[insertOddTypeData.leagueID]['dataList'][insertOddTypeData.eventID].oddTypes[insertOddTypeData.alias] != undefined)  //update
            {
              this.liveListTable[0]['data'][insertOddTypeData.leagueID]['dataList'][insertOddTypeData.eventID]['oddTypes'][insertOddTypeData.alias] = insertOddTypeData;
            }
            else{   //insert
              if(this.liveListTable[0]['data'][insertOddTypeData.leagueID]['dataList'][insertOddTypeData.eventID].oddTypes == undefined)
                this.liveListTable[0]['data'][insertOddTypeData.leagueID]['dataList'][insertOddTypeData.eventID].oddTypes = {}
              this.liveListTable[0]['data'][insertOddTypeData.leagueID]['dataList'][insertOddTypeData.eventID]['oddTypes'][insertOddTypeData.alias] = insertOddTypeData;
            }

            // this.$forceUpdate()
            // console.log('insertOddType',this.liveListTable[0])
          }
        }
        else if(removeOddTypeData != "" && removeOddTypeData.leagueID != undefined && removeOddTypeData.eventID != undefined && removeOddTypeData.oddTypeAlias != undefined){
          if(this.liveListTable[0].data[removeOddTypeData.leagueID] != undefined && this.liveListTable[0].data[removeOddTypeData.leagueID]['dataList'][removeOddTypeData.eventID] != undefined
                  && this.liveListTable[0].data[removeOddTypeData.leagueID]['dataList'][removeOddTypeData.eventID].oddTypes != undefined
                  && this.liveListTable[0].data[removeOddTypeData.leagueID]['dataList'][removeOddTypeData.eventID].oddTypes[removeOddTypeData.oddTypeAlias] != undefined){

            delete this.liveListTable[0].data[removeOddTypeData.leagueID]['dataList'][removeOddTypeData.eventID].oddTypes[removeOddTypeData.oddTypeAlias]
            // this.liveListTable[0].data[removeOddTypeData.leagueID]['dataList'][removeOddTypeData.eventID].oddTypes.splice(rmv_oddtype_index, 1);
            // this.$forceUpdate()
            // console.log('removeOddType',this.liveListTable[0])
          }
        }
        else if(updateEventData != "" && updateEventData.eventID != undefined && updateEventData.leagueID != undefined){
          if(this.liveListTable[0].data[updateEventData.leagueID] != undefined && this.liveListTable[0].data[updateEventData.leagueID]['dataList'][updateEventData.eventID] != undefined){
            var self = this
            Object.keys(updateEventData).forEach(key => {
              if(key != "method" && key != "eventID" && key != "leagueID" && key != "oddTypes")
                self.liveListTable[0].data[updateEventData.leagueID]['dataList'][updateEventData.eventID][key] = updateEventData[key]
            })
            // this.$forceUpdate()
            // console.log('updateEvent',this.liveListTable[0])
          }
        }
        else if(removeEventData != "" && removeEventData.eventID != undefined && removeEventData.leagueID != undefined){
          if(this.liveListTable[0].data[removeEventData.leagueID] != undefined && this.liveListTable[0].data[removeEventData.leagueID]['dataList'][removeEventData.eventID] != undefined){
            delete this.liveListTable[0].data[removeEventData.leagueID]['dataList'][removeEventData.eventID]
            // this.$forceUpdate()
            // console.log('removeEvent',this.liveListTable[0])
          }
        }
        else if(insertEventData != "" && insertEventData.eventID != undefined && insertEventData.leagueID != undefined){

          if(this.liveListTable[0].data[insertEventData.leagueID] == undefined){
            this.liveListTable[0].data[insertEventData.leagueID] = {
              leagueID: insertEventData.leagueID,
              sportID: insertEventData.sportID,
              sportAlias: insertEventData.sportAlias,
              categoryAlias: insertEventData.categoryAlias,
              categoryName: insertEventData.categoryName,
              leagueName: insertEventData.leagueName,
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
            oddTypes: {}
          }
          if(insertEventData.oddTypes != undefined && insertEventData.oddTypes.length > 0){
            insertEventData.oddTypes.forEach(oddType => {
              dataItem.oddTypes[oddType.alias] = oddType
            })
          }
          this.liveListTable[0].data[insertEventData.leagueID]['dataList'][insertEventData.eventID] = dataItem
          // this.$forceUpdate()
          // console.log('insertEvent',this.liveListTable[0])
        }
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
        if(this.menuSelected)
          this.leftMenuSelected()
        else{
          this.getLiveList()
          this.getUpcomingResult()
        }
      },
      gotoEventView(type, eventID) {
        if(type == 0){      //prematch
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
                      this.eventViewData.oddGroups.forEach(oddGroup => {
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
                      if (this.oddTypeList != null && this.oddTypeList.length > 0)
                        this.rowOddCount = Math.round(this.oddTypeList.length / this.marketRow);
                      // console.log(this.oddTypeList)
                    }
                    this.breadcrumbs = []
                    // console.log(this.eventViewData.sportName)
                    this.breadcrumbs.push({text:this.eventViewData.sportName, disabled:false, sportID:this.eventViewData.sportID, categoryID:'', eventID:''})
                    this.breadcrumbs.push({text:this.eventViewData.categoryName, disabled:false, sportID:this.eventViewData.sportID, categoryID:this.eventViewData.categoryID, eventID:''})
                    this.breadcrumbs.push({text:this.eventViewData.leagueName, disabled:false, sportID:this.eventViewData.sportID, categoryID:this.eventViewData.categoryID, eventID:this.eventViewData.leagueID})
                    this.breadcrumbs.push({text:this.eventViewData.homeTeam+' - '+this.eventViewData.awayTeam, disabled:true, action:this.eventViewData.eventID})

                    this.is_waiting_page = false
                  })
                  .catch(e => {
                    console.log(e);
                  });

          this.eventViewFlag = 1;

        }
        else{     //live
          this.$store.commit('setSelectLiveEvent', eventID)
          this.$router.push('/live-bet')
        }

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
        this.backToPremath()
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
                        {
                          sportID: league.sportID,
                          countryFlag: "/img/country_flag/" + league.categoryAlias + ".png",
                          width: "10%",
                          align: "center"
                        },
                        {
                          text: league.categoryName + " , " + league.leagueName,
                          align: "left",
                          width: "*"
                        },
                        { text: "MBS", align: "center", width: "5%" }
                      ];

                      if(this.prematchOddTypeRules.oddRules[league.sportAlias] != undefined){
                        var self = this
                        this.prematchOddTypeRules.oddRules[league.sportAlias].oddTypes.forEach(function(oddType, oddIndex, Object){
                          var partHeader = {}
                          partHeader.text = self.prematchOddTypeRules.oddNames[oddType]
                          partHeader.align = "center"
                          var specialCell = self.prematchOddTypeRules.oddRules[league.sportAlias].hasSpecial[oddIndex] ? 1 : 0
                          partHeader.specialCell = specialCell
                          partHeader.cellCount = self.prematchOddTypeRules.lineRules[oddType].length + specialCell
                          partHeader.width = (partHeader.cellCount)*5 + "%"
                          partHeader.cell = self.prematchOddTypeRules.lineRules[oddType]
                          headers.push(partHeader)
                        });
                      }

                      headers.push({
                        text: "+",
                        align: "center",
                        width: "5%"
                      });
                      headers.push({
                        text: "",
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
                    this.is_updating_page = false
                  }
                })
                .catch(e => {
                  console.log(e);
                });
      },
      selectBreadcrumb(sportID, categoryID, eventID) {
        this.topLeagueSelected(sportID, categoryID, eventID)
      },
      backToPremath() {
        this.eventViewFlag = 0;
        this.toggle_kinds = 0
        this.mainPanel = [true, true]
      },
      topMenuSelected(sportID) {
        this.closeOverviewSocket();
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
      connectOverviewSocket() {
        // console.log(this.sportID)
        var lan = this.$store.getters.getLanguage ? this.$store.getters.getLanguage : 'en'
        localStorage.socketChannelOverview = "live.sport." + this.sportID + "."+lan
        window.Echo.private(localStorage.socketChannelOverview).listen(
                "LiveSportDetailSent",
                e => {
                  // console.log("LiveSportDetailSent");
                  // console.log(e.message.method, e);
                  if(this.liveListTable[0] != undefined && this.liveListTable[0].data != undefined){
                    switch (e.message.method) {
                      case "insertOddType": {
                        this.setLiveList("", "", e.message.data)
                        break;
                      }
                      case "updateOdds": {
                        this.setLiveList("", e.message)
                        break;
                      }
                      case "removeOddType": {
                        this.setLiveList("", "", "", e.message)
                        break;
                      }
                      case "updateEvent": {
                        this.setLiveList("", "", "", "", e.message)
                        break;
                      }
                      case "removeEvent": {
                        this.setLiveList("", "", "", "", "", e.message)
                        break;
                      }
                      case "insertEvent": {
                        this.setLiveList("", "", "", "", "", "", e.message)
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
        if (localStorage.socketChannelOverview == undefined || localStorage.socketChannelOverview == '')
          return;
        // console.log("closeOverviewSocket", localStorage.socketChannelOverview)
        window.Echo.leave(localStorage.socketChannelOverview)
        localStorage.socketChannelOverview = "";
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
      },
      updatePrematchOddTypeRules(){

        this.prematchOddTypeRules.lineRules = this.$store.getters.getOddTypeLineRulesprematch
        this.prematchOddTypeRules.oddRules = this.$store.getters.getOddTypeOddRulesprematch
        this.prematchOddTypeRules.oddNames = this.$store.getters.getOddTypeOddNamesprematch

        this.pageNumber = 1
        this.is_updating_page = false
        this.is_last_page = false
        // if (this.$store.getters.getSports != undefined && this.$store.getters.getSports.length > 0) {
        //   if(this.sportID == ""){
        //     this.sportID = this.$store.getters.getSports[0].sportID;
        //   }
        //   if(this.topMenuSportList.length == 0){
        //     this.topMenuSportList[0] = this.$store.getters.getSports[0]
        //     this.topMenuSportList[1] = this.$store.getters.getSports[1]
        //     this.topMenuSportList[2] = this.$store.getters.getSports[2]
        //     this.topMenuSportList[3] = this.$store.getters.getSports[3]
        //   }
        //   this.getUpcomingResult()
        // }
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
          if(this.topMenuSportList.length == 0){
            for ( var i = 0; i < this.$store.getters.getLiveSports.length; i++) {
              this.topMenuSportList[i] = this.$store.getters.getLiveSports[i];
              if (i==3) {
                break;
              }
            }
          }
          this.is_refresh_page = false
          this.getUpcomingResult()
          this.getLiveList()
          this.connectOverviewSocket()
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
      this.$root.$on("UpdateLiveOddTypeRules", payload => {
        if(this.$route.path == "/sports-betting"){
          this.updateLiveOddTypeRules()
        }
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
      this.$root.$on('liveTime', function(){
        self.setLiveTime()
      })
      this.$root.$on('resizeEvent', payload=>{
        this.hasSize = payload.hasSize
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