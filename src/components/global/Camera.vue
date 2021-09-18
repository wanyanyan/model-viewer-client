<template>
  <div class="property-box">
    <div class="value"><span>类型：</span>{{localInfo.type}}</div>
    <div class="value"><span>uuid：</span>{{localInfo.uuid}}</div>
    <div class="value" v-if="localInfo.position">
      <span>位置：</span>
      <InputNumber size="small" v-model="localInfo.position.x" @on-change="propertyChange('position')" style="width: 70px;margin-right: 5px;"></InputNumber>
      <InputNumber size="small" v-model="localInfo.position.y" @on-change="propertyChange('position')" style="width: 70px;margin-right: 5px;"></InputNumber>
      <InputNumber size="small" v-model="localInfo.position.z" @on-change="propertyChange('position')" style="width: 70px;"></InputNumber>
    </div>
    <div class="value" v-if="localInfo.rotation">
      <span>旋转：</span>
      <InputNumber size="small" v-model="localInfo.rotation.x" @on-change="propertyChange('rotation')" style="width: 70px;margin-right: 5px;"></InputNumber>
      <InputNumber size="small" v-model="localInfo.rotation.y" @on-change="propertyChange('rotation')" style="width: 70px;margin-right: 5px;"></InputNumber>
      <InputNumber size="small" v-model="localInfo.rotation.z" @on-change="propertyChange('rotation')" style="width: 70px;"></InputNumber>
    </div>
    <div class="value" v-if="localInfo.scale">
      <span>缩放：</span>
      <InputNumber size="small" :step="0.1" v-model="localInfo.scale.x" @on-change="propertyChange('scale')" style="width: 70px;margin-right: 5px;"></InputNumber>
      <InputNumber size="small" :step="0.1" v-model="localInfo.scale.y" @on-change="propertyChange('scale')" style="width: 70px;margin-right: 5px;"></InputNumber>
      <InputNumber size="small" :step="0.1" v-model="localInfo.scale.z" @on-change="propertyChange('scale')" style="width: 70px;"></InputNumber>
    </div>
    <div class="value">
      <span>视场角：</span>
      <Slider class="inline" :min="30" :max="120" :step="5" v-model="localInfo.fov" @on-change="propertyChange('fov')" style="width: 150px;"></Slider>
    </div>
    <div class="value">
      <span>近裁剪面：</span>
      <InputNumber size="small" :min="0" :step="1" v-model="localInfo.near" @on-change="propertyChange('near')"></InputNumber>
    </div>
    <div class="value">
      <span>远裁剪面：</span>
      <InputNumber size="small" :min="0" :step="1" v-model="localInfo.far" @on-change="propertyChange('far')"></InputNumber>
    </div>
    <div class="value">
      <span>显示辅助线：</span>
      <Switch size="small" v-model="localInfo.helper" @on-change="propertyChange('helper')" />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import _ from 'lodash'
import util from '../../libs/util'
export default {
  methods: {
    getData() {
      let info = _.cloneDeep(this.cameraInfo)
      this.localInfo = info
    },
    propertyChange(property) {
      let info = _.cloneDeep(this.localInfo)
      this.$store.commit('patch_camera', info)
      let value = info[property]
      if (property === 'rotation') {
        value = {
          x: util.degree2radian(info.rotation.x),
          y: util.degree2radian(info.rotation.y),
          z: util.degree2radian(info.rotation.z)
        }
      }
      this.$eventHub.$emit('on-camera-change', {
        property,
        value
      })
    }
  },
  mounted() {
    if (this.cameraInfo) {
      this.getData()
    }
  },
  data() {
    return {
      localInfo: {}
    }
  },
  computed: {
    ...mapState({
      cameraInfo: state => state.cameraInfo
    })
  },
  watch: {
    cameraInfo() {
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.property-box{
  width: 250px;
  text-align: left;
  .value{
    width: calc(100% - 20px);
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 30px;
    span{
      font-weight: bold;
    }
  }
}

</style>