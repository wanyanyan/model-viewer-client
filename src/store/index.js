import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modelOption: null,
    environment: {
      color: '#ffffff',
      intensity: 1
    },
    lights: []
  },
  mutations: {
    path_model_option(state, value) {
      state.modelOption = value;
    },
    patch_lights(state, value) {
      state.lights = value
    },
    patch_environment(state, value) {
      state.environment = value
    }
  },
  actions: {},
  modules: {}
});
