<template>
  <div id="app">
    <router-view/>
    <LoadingBar :show="showLoading"/>
    <GeneratePreference />
    <Obj2Gltf />
    <Obj2Drc />
    <PropertiesPanel v-if="info"/>
    <MessageBox />
    <Fbx2Gltf />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import LoadingBar from './components/LoadingBar.vue'
import GeneratePreference from './components/GeneratePreference.vue'
import Obj2Gltf from './components/Obj2Gltf.vue'
import Obj2Drc from './components/Obj2Drc.vue'
import PropertiesPanel from './components/PropertyPanel.vue'
import MessageBox from './components/MessageBox.vue'
import Fbx2Gltf from './components/Fbx2Gltf.vue'
export default {
  components: {
    LoadingBar,
    GeneratePreference,
    Obj2Gltf,
    Obj2Drc,
    PropertiesPanel,
    MessageBox,
    Fbx2Gltf
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
