import Vue from 'vue'
import App from './App.vue'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'




Vue.use(Vuex)



Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);


Vue.use(VueApollo)


const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'http://localhost:4000/graphql'
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})



Vue.config.productionTip = false

new Vue({
  apolloProvider,
  vuetify,
  render: h => h(App)
}).$mount('#app')
