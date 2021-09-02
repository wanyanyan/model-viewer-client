<template>
  <div class="upload">
    <Button class="btn" type="warning" @click="openfile" style="margin: 10px;width: 100px;">打开模型</Button>
    <div class="title">光照</div>
    <div class="card">
      <div class="name">环境光</div>
      <Form :model="light" :label-width="80">
        <FormItem label="颜色">
          <ColorPicker v-model="light.color" @on-change="lightChange"/>
        </FormItem>
        <FormItem label="强度">
          <Slider v-model="light.intensity" :min="1" :max="3" :step="0.1" @on-change="lightChange"></Slider>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import Constants from '@/libs/constants'
export default {
  name: 'Upload',
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
      
    }
  },
  data() {
    return {
      light: {
        color: '#fffff',
        intensity: 1
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.btn{
  margin: 10px;
}
</style>
