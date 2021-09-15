<template>
  <div class="container">
    <div class="three-view"></div>
    <div class="toolbar">
       <Button class="btn" type="warning" size="small" shape="circle" icon="md-information" title="显示详情" @click="showDetails"></Button>
       <Button class="btn" type="warning" size="small" shape="circle" icon="md-help" title="显示坐标轴" @click=toggleHelper></Button>
       <Button class="btn" type="warning" size="small" shape="circle" icon="md-expand" title="回到初始视角" @click=fitBounds></Button>
    </div>
    <div class="meta" v-if="boundingBox">包围盒：min({{boundingBox.min.x}}, {{boundingBox.min.y}}, {{boundingBox.min.z}})，max({{boundingBox.max.x}}, {{boundingBox.max.y}}, {{boundingBox.max.z}})</div>
    <Modal
      v-model="dialogShow"
      title="统计信息"
      width="340"
      :mask-closable="false"
      :closable="false">
      <Info :info="staInfo" v-if="dialogShow"/>
    </Modal>
  </div>
</template>

<script>
import ModelViewer from '../libs/model-viewer'
import {mapState} from 'vuex'
import _ from 'lodash'
import Info from './Info.vue'
import * as THREE from "three"
export default {
  components: {
    Info
  },
  methods: {
    initView() {
      this.viewer = new ModelViewer({
        container: this.$el.querySelector('.three-view'),
        axisHelper: this.showHelper,
        stats: {
          show: true,
          position: 'top-right'
        }
      });
      this.viewer.on('click', this.sceneClick)
      window.viewer = this.viewer
      const box = new THREE.Box3();
      box.setFromCenterAndSize( new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 2, 1, 3 ) );

      this.boxHelper = new THREE.Box3Helper( box, 0xffff00 );
      this.boxHelper.visible = false
      this.viewer.scene.add( this.boxHelper );
    },
    addModel() {
      this.boxHelper.visible = false
      if (this.modelOption) {
        let {mode, paths} = this.modelOption
        if (mode === 'open') {
          this.viewer.removeAll()
        }
        paths.forEach(path => {
          let arr = path.split("\\");
          let file = arr.pop().split(".");
          let filename = file[0]
          let filetype = file[1]
          let type = filetype.toLowerCase()
          if (filetype === 'glb') {
            type = 'gltf'
          }
          if (filetype === 'json') {
            type = 'modelset'
          }
          this.viewer.loadModels(type, `http://127.0.0.1:10024/${filename}.${filetype}`)
        })
        this.$store.commit('patch_loading', true)
      } else {
        this.viewer.loadModels('gltf', './example.glb')
      }
      this.viewer.on('loaded', () => {
        let bbox = this.viewer.getBoundingBox()
        let bboxSimplify = {
          min: {
            x: Number(bbox.min.x.toFixed(2)),
            y: Number(bbox.min.y.toFixed(2)),
            z: Number(bbox.min.z.toFixed(2))
          },
          max: {
            x: Number(bbox.max.x.toFixed(2)),
            y: Number(bbox.max.y.toFixed(2)),
            z: Number(bbox.max.z.toFixed(2))
          }
        }
        this.$store.commit('patch_boundingbox', bboxSimplify)
        this.$store.commit('patch_loading', false)
      })
    },
    fitBounds() {
      this.viewer.fitBounds()
    },
    toggleHelper() {
      this.showHelper = !this.showHelper
      if (this.showHelper) {
        this.viewer.addAxisHelper()
      } else {
        this.viewer.removeAxisHelper()
      }
    },
    showDetails() {
      let info = this.viewer.getStatistics()
      this.staInfo = info
      this.dialogShow = true
    },
    sceneClick(e) {
      let objects = this.viewer.queryObjects(e.point)
      this.selectedObject = objects[0] || null
      if (this.selectedObject) {
        let box3 = new THREE.Box3()
        box3.expandByObject(this.selectedObject)
        this.boxHelper.box = box3
        this.boxHelper.visible = true
        let properties = Object.assign({
          id: this.selectedObject.fid,
          name: this.selectedObject.name
        }, this.selectedObject.userData)
        this.$store.commit('patch_properties', properties)
      } else {
        this.boxHelper.visible = false
        this.$store.commit('patch_properties', null)
      }
    }
  },
  mounted() {
    this.initView()
    this.addModel()
  },
  data() {
    return {
      showHelper: false,
      dialogShow: false,
      staInfo: null
    }
  },
  computed: {
    ...mapState({
      modelOption: state => state.modelOption,
      environment: state => state.environment,
      lights: state => state.lights,
      boundingBox: state => state.boundingBox
    })
  },
  watch: {
    modelOption() {
      this.addModel()
    },
    environment() { // 环境光参数变化，调用接口更新视图
      let {color, intensity} = this.environment
      this.viewer.updateLight({
        id: 'light-environment',
        color,
        intensity
      })
    },
    lights(newLights, oldLights) {
      for(let i = 0;i < newLights.length;i++) {
        let oldItem = oldLights.find(l => l.id === newLights[i].id)
        if (!oldItem) { // 添加光源
          this.viewer.addLight(newLights[i])
        } else if (!_.isEqual(newLights[i], oldItem)) { // 更新光源
          this.viewer.updateLight(newLights[i])
        } else { // 未做修改
          continue 
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container, .three-view{
  width: 100%;
  height: 100%;
  position: relative;
}
.toolbar{
  width: 30px;
  position: absolute;
  bottom: 40px;
  right: 10px;
}
.btn{
  margin-top: 10px;
}
.meta{
  position: absolute;
  width: 100%;
  text-align: left;
  padding-left: 10px;
  line-height: 25px;
  background-color: #ffffff;
  bottom: 0;
}
</style>