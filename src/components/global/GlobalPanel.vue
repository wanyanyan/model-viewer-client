<template>
  <div class="global-panel">
    <Collapse v-model="activePanel">
      <Panel name="scene">
        对象树
        <ObjectTree slot="content"/>
      </Panel>
      <Panel name="camera" v-if="!selectedObjectInfo">
        相机
        <p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
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
export default {
  components: {
    Light,
    Info,
    PropertyPanel,
    Geometry,
    Material,
    ObjectTree
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
