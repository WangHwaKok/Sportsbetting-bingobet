// https://vuex.vuejs.org/en/getters.html

export default {
  //
  getTheme: state => {
    return state.theme
  },
  getUsername: state => {
    return state.username
  },
  getUserId: state => {
    return state.userId
  },
  getEmail: state => {
    return state.email
  },
  getRole: state => {
    return state.role
  },
  getLanguage: state => {
    return state.language
  },
  getSports: state => {
    return state.sports
  },
  getLiveSports: state => {
    return state.liveSports
  },
  getSelectLiveEvent: state => {
    return state.selectLiveEvent
  },
  getOddTypeLineRulesprematch: state=>{
    return state.odd_type_line_rules_prematch;
  },
  getOddTypeOddNamesprematch: state=>{
      return state.odd_type_odd_names_prematch;
  },
  getOddTypeOddRulesprematch: state=>{
      return state.odd_type_odd_rules_prematch;
  },
  getOddTypeLineRuleslive: state=>{
      return state.odd_type_line_rules_live;
  },
  getOddTypeOddNameslive: state=>{
      return state.odd_type_odd_names_live;
  },
  getOddTypeOddRuleslive: state=>{
      return state.odd_type_odd_rules_live;
  },
  getParameters: state=>{
    return state.parameters;
  },
  getDarkTheme: state=>{
    return state.darkTheme;
  },
}
