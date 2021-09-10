<template>
  <div>
    <Modal
      v-model="dialogShow"
      title="生成配置文件"
      width="400"
      :mask-closable="false"
      :closable="false"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form class="my-form" :model="options" :label-width="90">
        <FormItem label="输入模型">
          <Input :value="options.inputs.join(';')" search size="small" enter-button="浏览" @on-search="openInputPathDlg"/>
        </FormItem>
        <FormItem label="压缩">
          <Switch v-model="options.binary" size="small"/>
        </FormItem>
        <FormItem label="输出位置">
          <Input :value="options.outputPath" search size="small" enter-button="浏览" placeholder="默认与输入相同" @on-search="openOutputPathDlg"/>
        </FormItem>
        <Progress :percent="percent" />
      </Form>
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
      ipcRenderer.send("obj_gltf_start", _.cloneDeep(this.options))
      this.options = {
        inputs: [],
        binary: true,
        outputPath: ''
      }
    },
    cancel() {
      this.dialogShow = false
      this.options = {
        inputs: [],
        binary: true,
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
    })
  },
  data() {
    return {
      dialogShow: false,
      options: {
        inputs: [],
        binary: true,
        outputPath: ''
      },
      percent: 0
    }
  }
}
</script>