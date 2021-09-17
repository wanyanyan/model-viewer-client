<template>
  <div class="upload">
    <!-- <Button class="btn" type="warning" @click="openfileDlg" style="margin: 10px;width: 100px;">打开模型</Button> -->
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
export default {
  methods: {
    openfileDlg() {
      ipcRenderer.send("open_local_model")
    },
    openfile(event, fileInfo) {
      this.$store.commit('path_model_option', fileInfo)
    }
  },
  mounted() {
    ipcRenderer.on("selected_local_models", this.openfile)
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="less">
.btn{
  margin: 10px;
}
</style>
