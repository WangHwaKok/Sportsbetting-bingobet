// https://vuex.vuejs.org/en/mutations.html

export default {
  //
  setTheme(state, theme) {
    state.theme = theme
  },
  setUsername(state, payload){
    state.username = payload
  },
  setUserId(state, payload){
    state.userId = payload
  },
  setEmail(state, payload){
    state.email = payload
  },
  setUserRole(state, payload){
    state.role = payload
  },
  setLanguage(state, payload){
    state.language = payload
  },
  setSports(state, payload){
    state.sports = payload
  },
  setLiveSports(state, payload){
    state.liveSports = payload
  },
  setSelectLiveEvent(state, payload){
    state.selectLiveEvent = payload
  },
  setOddTypeRuleslive(state, payload){
      state.odd_type_line_rules_live = payload.lineRules;
      state.odd_type_odd_names_live = payload.oddNames;
      state.odd_type_odd_rules_live = payload.oddRules;
  },
  setOddTypeRulesprematch(state, payload){
      state.odd_type_line_rules_prematch = payload.lineRules;
      state.odd_type_odd_names_prematch = payload.oddNames;
      state.odd_type_odd_rules_prematch = payload.oddRules;
  },
  setParameters(state, payload){
    state.parameters = payload;
  },
  clearStore(state){
    state.userId = ""
    state.username = ""
    state.email = ""
    state.role = ""
    state.language = ""
    state.sports = []
    state.liveSports = []
    state.odd_type_line_rules_live = {}
    state.odd_type_odd_names_live = {}
    state.odd_type_odd_rules_live = {}
    state.odd_type_line_rules_prematch = {}
    state.odd_type_odd_names_prematch = {}
    state.odd_type_odd_rules_prematch = {}
  },
  setDarkTheme(state, payload){
    state.darkTheme = payload
  }
}
