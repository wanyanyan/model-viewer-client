<template>
  <div class="container">
    <div class="three-view"></div>
    <div class="toolbar">
       <Button class="btn" type="warning" size="small" shape="circle" icon="md-information"></Button>
       <Button class="btn" type="warning" size="small" shape="circle" icon="md-help" @click=toggleHelper></Button>
       <Button class="btn" type="warning" size="small" shape="circle" icon="md-expand" @click=fitBounds></Button>
    </div>
  </div>
</template>

<script>
import ModelViewer from '../libs/model-viewer'
import {mapState} from 'vuex'
import _ from 'lodash'
export default {
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
      window.viewer = this.viewer
    },
    addModel() {
      this.viewer.removeAll()
      if (this.modelOption) {
        let {filename, filetype} = this.modelOption
        let type = filetype
        if (filetype === 'glb') {
          type = 'gltf'
        }
        if (filetype === 'json') {
          type = 'modelset'
        }
        this.viewer.loadModels(type, `http://127.0.0.1:10024/${filename}.${filetype}`)
      } else {
        this.viewer.loadModels('gltf', './example.glb')
      }
      this.viewer.on('loaded', () => {
        let bbox = this.viewer.getBoundingBox()
        this.$store.commit('patch_boundingbox', _.cloneDeep(bbox))
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
    }
  },
  mounted() {
    this.initView()
    this.addModel()
  },
  data() {
    return {
      showHelper: false
    }
  },
  computed: {
    ...mapState({
      modelOption: state => state.modelOption,
      environment: state => state.environment,
      lights: state => state.lights
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
  bottom: 10px;
  right: 10px;
}
.btn{
  margin-top: 10px;
}
</style>