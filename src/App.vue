<template>
  <div id="app">
    <router-view/>
    <ImportModel />
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
import ImportModel from './components/ui/ImportModel.vue'
import LoadingBar from './components/ui/LoadingBar.vue'
import GeneratePreference from './components/transform/GeneratePreference.vue'
import Obj2Gltf from './components/transform/Obj2Gltf.vue'
import Obj2Drc from './components/transform/Obj2Drc.vue'
import PropertiesPanel from './components/setting/PropertyPanel.vue'
import MessageBox from './components/ui/MessageBox.vue'
import Fbx2Gltf from './components/transform/Fbx2Gltf.vue'
export default {
  components: {
    LoadingBar,
    GeneratePreference,
    Obj2Gltf,
    Obj2Drc,
    PropertiesPanel,
    MessageBox,
    Fbx2Gltf,
    ImportModel
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
