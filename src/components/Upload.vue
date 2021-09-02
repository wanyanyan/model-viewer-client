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
      this.$store.commit('patch_environment', {
        color: parseInt(this.light.color.replace('#', '0x')),
        intensity: this.light.intensity
      })
    }
  },
  data() {
    return {
      light: {
        color: '#ffffff',
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
