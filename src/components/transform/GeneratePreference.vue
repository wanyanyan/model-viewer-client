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
        <FormItem label="模型位置">
          <Input v-model="options.modelsPath" search size="small" enter-button="浏览" @on-search="openModelPathDlg"/>
        </FormItem>
        <FormItem label="实例化列表">
          <Input v-model="options.xlsxPath" search size="small" enter-button="浏览" placeholder="可选" @on-search="openXlsxPathDlg"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import _ from 'lodash'
export default {
  methods: {
    openModelPathDlg() {
      ipcRenderer.send("open_model_path")
    },
    openXlsxPathDlg() {
      ipcRenderer.send("open_xlsx_path")
    },
    ok() {
      if (!this.options.modelsPath) {
        return
      }
      ipcRenderer.send("generate_preference_start", _.cloneDeep(this.options))
      this.$store.commit('patch_loading', true)
      this.options = {
        modelsPath: '',
        xlsxPath: ''
      }
    },
    cancel() {
      this.dialogShow = false
      this.options = {
        modelsPath: '',
        xlsxPath: ''
      }
    }
  },
  mounted() {
    ipcRenderer.on("generate_preference_dlg", () => {
      this.dialogShow = true
    })
    ipcRenderer.on('model_path_success', (e, path) => {
      this.options.modelsPath = path
    })
    ipcRenderer.on('xlsx_path_success', (e, path) => {
      this.options.xlsxPath = path
    })
    ipcRenderer.on('generate_reference_success', (e, path) => {
      this.$store.commit('patch_loading', false)
      this.$Notice.success({
        title: '成功生成配置文件',
        desc: `已成功生成配置文件，位于：${path}`
      });
    })
  },
  data() {
    return {
      dialogShow: false,
      options: {
        modelsPath: '',
        xlsxPath: ''
      }
    }
  }
}
</script>