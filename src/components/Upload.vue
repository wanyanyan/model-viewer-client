<template>
  <div class="upload">
    <Button class="btn" type="warning" @click="openfile" style="margin: 10px;width: 100px;">打开模型</Button>
    <div class="title">光照</div>
    <div class="card">
      <div class="name">环境光</div>
      <Form class="my-form" :model="light" :label-width="50">
        <FormItem label="颜色">
          <ColorPicker v-model="light.color" size="small" format="hex" transfer @on-change="lightChange"/>
        </FormItem>
        <FormItem label="强度">
          <Slider v-model="light.intensity" :min="0" :max="3" :step="0.1" @on-change="lightChange"></Slider>
        </FormItem>
      </Form>
    </div>
    <div class="card editable" v-for="item in localLights" :key="item.id">
      <div class="name">{{item.name}}</div>
      <Form class="my-form" :model="item" :label-width="50">
        <FormItem label="颜色">
          <ColorPicker v-model="item.color" size="small" format="hex" transfer @on-change="localLightChange"/>
        </FormItem>
        <FormItem label="强度">
          <Slider v-model="item.intensity" :min="0" :max="10" :step="0.1" @on-change="localLightChange"></Slider>
        </FormItem>
      </Form>
    </div>
    <Button type="primary" ghost size="small" @click="addLightDlg">添加光照</Button>
    <Modal
      v-model="dialogShow"
      title="添加光照"
      width="340"
      :mask-closable="false"
      :closable="false"
      @on-ok="ok"
      @on-cancel="cancel">
      <LightForm ref="lightForm" v-if="dialogShow"/>
      <!-- <div class="meta" v-if="boundingBox">模型包围盒：[{{boundingBox.min.x}}, {{boundingBox.min.y}}, {{boundingBox.min.z}}] - [{{boundingBox.max.x}}, {{boundingBox.max.y}}, {{boundingBox.max.z}}]</div> -->
    </Modal>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import Constants from '@/libs/constants'
import LightForm from './LightForm.vue'
import {mapState} from 'vuex'
import _ from 'lodash'
export default {
  name: 'Upload',
  components: {
    LightForm
  },
  methods: {
    openfile() {
      ipcRenderer.send("openDialog")
      ipcRenderer.on("selectedItem", (event, fileInfo)=>{
        if (Constants.formats.indexOf(fileInfo.filetype) === -1) {
          this.$Modal.error({
            title: '不支持的格式',
            content: ''
          });
        }
        this.$store.commit('path_model_option', fileInfo)
      })
    },
    lightChange() {
      this.$store.commit('patch_environment', {
        color: parseInt(this.light.color.replace('#', '0x')),
        intensity: this.light.intensity
      })
    },
    localLightChange() {
      let lights = _.cloneDeep(this.localLights)
      this.commitLights(lights)
    },
    addLightDlg() {
      this.dialogShow = true
    },
    commitLights(lights) {
      lights.map(item => item.color = parseInt(item.color.replace('#', '0x')))
      this.$store.commit('patch_lights', lights)
    },
    ok() {
      let option = this.$refs.lightForm.option
      let lights = _.cloneDeep(this.localLights)
      lights.push(option)
      this.commitLights(lights)
    },
    cancel() {

    }
  },
  mounted() {

  },
  data() {
    return {
      light: {
        color: '#ffffff',
        intensity: 1
      },
      localLights: [],
      dialogShow: false
    }
  },
  computed: {
    ...mapState({
      lights: state => state.lights,
      boundingBox: state => state.boundingBox
    })
  },
  watch: {
    lights() {
      let localLights = _.cloneDeep(this.lights)
      localLights.map(item => item.color ='#' + item.color.toString(16))
      this.localLights = localLights
    }
  }
}
</script>

<style scoped lang="less">
.btn{
  margin: 10px;
}
.title{
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  line-height: 30px;
}
.card{
  text-align: left;
  background-color: #fff;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  .name{
    font-weight: bold;
    border-bottom: 1px solid #eee;
    margin-bottom: 5px;
  }
}
</style>

<style lang="less">
.my-form .ivu-form-item{
  margin-bottom: 0px;
}
</style>
