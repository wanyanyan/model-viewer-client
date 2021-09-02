<template>
  <div class="three-view">

  </div>
</template>

<script>
import ModelViewer from '../libs/model-viewer'
import {mapState} from 'vuex'
export default {
  methods: {
    initView() {
      this.viewer = new ModelViewer({
        container: this.$el,
        axisHelper: false,
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
    }
  },
  mounted() {
    this.initView()
    this.addModel()
  },
  computed: {
    ...mapState({
      modelOption: state => state.modelOption,
      environment: state => state.environment
    })
  },
  watch: {
    modelOption() {
      this.addModel()
    },
    environment() {
      let {color, intensity} = this.environment
      let light = this.viewer.scene.getObjectByProperty('fid', 'light-environment')
      light.color.setHex(color)
      light.intensity = intensity
    }
  }
}
</script>

<style lang="less" scoped>
.three-view{
  width: 100%;
  height: 100%;
}
</style>