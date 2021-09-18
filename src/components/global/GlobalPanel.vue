<template>
  <div class="global-panel">
    <Collapse v-model="activePanel">
      <Panel name="scene">
        对象树
        <ObjectTree slot="content"/>
      </Panel>
      <Panel name="camera" v-if="!selectedObjectInfo">
        相机
        <Camera slot="content"/>
      </Panel>
      <Panel name="light" v-if="!selectedObjectInfo">
        光照
        <Light slot="content"/>
      </Panel>
      <Panel name="info" v-if="!selectedObjectInfo">
        统计信息
        <Info slot="content"/>
      </Panel>
      <Panel name="object" v-if="selectedObjectInfo">
        对象
        <PropertyPanel slot="content"/>
      </Panel>
      <Panel name="geometry" v-if="selectedObjectInfo && selectedObjectInfo.geometries">
        几何信息
        <Geometry slot="content"/>
      </Panel>
      <Panel name="material" v-if="selectedObjectInfo && selectedObjectInfo.materials">
        材质信息
        <Material slot="content"/>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Light from './Light.vue'
import Info from './Info.vue'
import PropertyPanel from '../setting/PropertyPanel.vue'
import Geometry from '../setting/Geometry.vue'
import Material from '../setting/Material.vue'
import ObjectTree from '../global/ObjectTree.vue'
import Camera from './Camera.vue'
export default {
  components: {
    Light,
    Info,
    PropertyPanel,
    Geometry,
    Material,
    ObjectTree,
    Camera
  },
  mounted() {
  },
  data() {
    return {
      activePanel: 'scene'
    }
  },
  computed: {
    ...mapState({
      selectedObjectInfo: state => state.selectedObjectInfo
    })
  }
}
</script>

<style scoped lang="less">
.global-panel{
  text-align: left;
}
</style>
