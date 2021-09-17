<template>
  <div class="property-box">
    <div class="value"><span>类型：</span>{{localInfo.type}}</div>
    <div class="value"><span>uuid：</span>{{localInfo.uuid}}</div>
    <div class="value"><span>名称：</span>{{localInfo.name}}</div>
    <div class="value">
      <span>颜色：</span>
      <ColorPicker size="small" transfer v-model="localInfo.color" @on-change="propertyChange('color')" v-if="localInfo.color"/>
    </div>
    <div class="value">
      <span>自发光：</span>
      <ColorPicker size="small" transfer v-model="localInfo.emissive" @on-change="propertyChange('emissive')" v-if="localInfo.emissive"/>
    </div>
    <div class="value">
      <span>粗糙度：</span>
      <Slider class="inline" :min="0" :max="1" :step="0.01" v-model="localInfo.roughness" @on-change="propertyChange('roughness')" style="width: 150px;"></Slider>
    </div>
    <div class="value">
      <span>金属度：</span>
      <Slider class="inline" :min="0" :max="1" :step="0.01" v-model="localInfo.metalness" @on-change="propertyChange('metalness')" style="width: 150px;"></Slider>
    </div>
    <div class="value">
      <span>使用顶点颜色：</span>
      <Switch size="small" v-model="localInfo.vertexColors" @on-change="propertyChange('vertexColors')" />
    </div>
    <div class="value">
      <span>渲染方式：</span>
      <Select v-model="localInfo.side" size="small" style="width:140px" @on-change="propertyChange('side')">
        <Option :value="0">正面</Option>
        <Option :value="1">背面</Option>
        <Option :value="2">双面</Option>
      </Select>
    </div>
    <div class="value">
      <span>平面阴影：</span>
      <Switch size="small" v-model="localInfo.flatShading" @on-change="propertyChange('flatShading')" />
    </div>
    <div class="value">
      <span>混淆模式：</span>
      <Select v-model="localInfo.blending" size="small" style="width:140px" @on-change="propertyChange('blending')">
        <Option :value="item.value" v-for="item in blendOptions" :key="item.name">{{item.name}}</Option>
      </Select>
    </div>
    <div class="value">
      <span>透明度：</span>
      <Slider class="inline" :min="0" :max="1" :step="0.01" v-model="localInfo.opacity" @on-change="propertyChange('opacity')" style="width: 150px;"></Slider>
    </div>
    <div class="value">
      <span>半透明：</span>
      <Switch size="small" v-model="localInfo.transparent" @on-change="propertyChange('transparent')" />
    </div>
    <div class="value">
      <span>线框图：</span>
      <Switch size="small" v-model="localInfo.wireframe" @on-change="propertyChange('wireframe')"/>
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
      let info = _.cloneDeep(this.selectedObjectInfo.materials)
      info.color = util.threeColor2hex(info.color)
      info.emissive = util.threeColor2hex(info.emissive)
      this.localInfo = info
    },
    propertyChange(property) {
      let info = _.cloneDeep(this.localInfo)
      info.color = util.hex2ThreeColor(info.color)
      info.emissive = util.hex2ThreeColor(info.emissive)
      let selectedObjectInfo = _.cloneDeep(this.selectedObjectInfo)
      selectedObjectInfo.materials = info
      this.$store.commit('patch_selected_object', selectedObjectInfo)
      this.$store.commit('trigger_material_update', {
        property,
        value: info[property]
      })
    }
  },
  mounted() {
    if (this.selectedObjectInfo) {
      this.getData()
    }
  },
  data() {
    return {
      localInfo: {},
      blendOptions: [
        {
          name: '无',
          value: 0
        },
        {
          name: '加法',
          value: 1
        },
        {
          name: '减法',
          value: 2
        },
        {
          name: '乘法',
          value: 3
        },
        {
          name: '自定义',
          value: 4
        }
      ]
    }
  },
  computed: {
    ...mapState({
      selectedObjectInfo: state => state.selectedObjectInfo
    })
  },
  watch: {
    selectedObjectInfo() {
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