<template>
  <div>
    <Modal
      v-model="dialogShow"
      title="obj转gltf/glb"
      width="400"
      :mask-closable="false"
      :closable="false"
      :footer-hide="true">
      <Form class="my-form" :model="options" :label-width="90">
        <FormItem label="输入模型">
          <Input :value="options.inputs.join(';')" search size="small" enter-button="浏览" @on-search="openInputPathDlg"/>
        </FormItem>
        <FormItem label="压缩(glb)">
          <Switch v-model="options.binary" size="small"/>
        </FormItem>
        <FormItem label="压缩(draco)">
          <Switch v-model="options.draco" size="small"/>
        </FormItem>
        <FormItem label="压缩比" v-if="options.draco">
          <InputNumber :max="10" :min="1" size="small" v-model="options.compress_level"></InputNumber>
        </FormItem>
        <FormItem label="输出位置">
          <Input :value="options.outputPath" search size="small" enter-button="浏览" placeholder="默认与输入相同" @on-search="openOutputPathDlg"/>
        </FormItem>
        <div class="progress-box">
          转换进度：<Progress :percent="percent" style="width: 285px;"/>
        </div>
      </Form>
      <div class="footer">
        <div class="action">
          <Button class="btn" @click="cancel" size="small" :disabled="converting" style="width: 80px;margin-right: 20px;">取消</Button>
          <Button class="btn" type="primary" size="small" @click="ok" :disabled="converting" style="width: 80px;">开始</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import _ from 'lodash'
export default {
  methods: {
    openInputPathDlg() {
      ipcRenderer.send("obj_gltf_input")
    },
    openOutputPathDlg() {
      ipcRenderer.send("obj_gltf_output")
    },
    ok() {
      if (!this.options.inputs.length) {
        return
      }
      this.percent = 0
      ipcRenderer.send("obj_gltf_start", _.cloneDeep(this.options))
      this.converting = true
    },
    cancel() {
      this.converting = false
      this.dialogShow = false
      this.options = {
        inputs: [],
        binary: true,
        draco: false,
        compress_level: 7,
        outputPath: ''
      }
    }
  },
  mounted() {
    ipcRenderer.on("obj_gltf_dlg", () => {
      this.dialogShow = true
      this.percent = 0
    })
    ipcRenderer.on('input_path_success', (e, paths) => {
      this.options.inputs = paths
    })
    ipcRenderer.on('output_path_success', (e, path) => {
      this.options.outputPath = path
    })
    ipcRenderer.on('obj_gltf_progress', (e, percent) => {
      this.percent = Number(percent)
      if(this.percent >= 100) {
        this.converting = false
      }
    })
  },
  data() {
    return {
      dialogShow: false,
      converting: false,
      options: {
        inputs: [],
        binary: true,
        compress_level: 7,
        outputPath: ''
      },
      percent: 0
    }
  }
}
</script>

<style lang="less" scoped>
.action{
  margin-top: 20px;
  text-align: right;
}
.progress-box{
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 5px 0 5px 10px;
}
</style>