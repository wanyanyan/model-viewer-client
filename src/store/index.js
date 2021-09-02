import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modelOption: null
  },
  mutations: {
    path_model_option(state, value) {
      state.modelOption = value;
    }
  },
  actions: {},
  modules: {}
});
