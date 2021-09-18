import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modelOption: null,
    environment: {
      color: "#ffffff",
      intensity: 1
    },
    lights: [],
    boundingBox: null,
    showLoading: false,
    selectedObjectInfo: null,
    error: {},
    statisticInfo: {},
    objectTree: [],
    materialUpdate: {},
    cameraInfo: {}
  },
  mutations: {
    path_model_option(state, value) {
      state.modelOption = value;
    },
    patch_lights(state, value) {
      state.lights = value;
    },
    patch_environment(state, value) {
      state.environment = value;
    },
    patch_boundingbox(state, value) {
      state.boundingBox = value;
    },
    patch_loading(state, loading) {
      state.showLoading = loading;
    },
    patch_selected_object(state, value) {
      state.selectedObjectInfo = value;
    },
    ui_show_error(state, error) {
      state.error = error;
    },
    patch_statistic(state, value) {
      state.statisticInfo = value;
    },
    patch_object_tree(state, value) {
      state.objectTree = value;
    },
    trigger_material_update(state, value) {
      state.materialUpdate = value;
    },
    patch_camera(state, value) {
      state.cameraInfo = value
    }
  },
  actions: {},
  modules: {}
});
