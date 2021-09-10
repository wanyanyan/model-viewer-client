<template>
  <div id="app">
    <router-view/>
    <LoadingBar :show="showLoading"/>
    <GeneratePreference />
    <Obj2Gltf />
    <Obj2Drc />
    <PropertiesPanel v-if="info"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import LoadingBar from './components/LoadingBar.vue'
import GeneratePreference from './components/GeneratePreference.vue'
import Obj2Gltf from './components/Obj2Gltf.vue'
import Obj2Drc from './components/Obj2Drc.vue'
import PropertiesPanel from './components/PropertyPanel.vue'
export default {
  components: {
    LoadingBar,
    GeneratePreference,
    Obj2Gltf,
    Obj2Drc,
    PropertiesPanel
  },
  computed: {
    ...mapState({
      showLoading: state => state.showLoading,
      info: state => state.properties
    })
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
