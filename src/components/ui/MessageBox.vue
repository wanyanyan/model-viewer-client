<template>
  <div>
    <Modal class="confirm-modal" v-model="messageBox" :closable="false" :mask-closable="false" width="400">
      <div class="confirm-header">
        <div class="head-icon">
          <Icon type="ios-information-circle" size="28" color="#2d8cf0" v-if="error.type==='info'"/>
          <Icon type="ios-checkmark-circle" size="28" color="#19be6b" v-else-if="error.type==='success'"/>
          <Icon type="ios-alert" size="28" color="#f90" v-else-if="error.type==='warning'"/>
          <Icon type="ios-close-circle" size="28" color="#ed4014" v-else-if="error.type==='error'"/>
        </div>
        <div class="head-title">{{error.title || '未知错误'}}</div>
      </div>
      <div class="confirm-body">
        {{error.message}}
      </div>
      <div class="confirm-footer">
        <Button type="primary" @click="messageBox=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      messageBox: false
    }
  },
  computed: {
    ...mapState({
      error: state => state.error
    })
  },
  watch: {
    error() {
      this.messageBox = true
    }
  }
}
</script>

<style lang="less" scoped>
.confirm-header{
  padding: 0 12px 0 0;
  .head-icon{
    display: inline-block;
    font-size: 28px;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
  .head-title{
    display: inline-block;
    vertical-align: middle;
    margin-left: 12px;
    font-size: 16px;
    color: #17233d;
    font-weight: 700;
  }
}
.confirm-body{
  word-break: break-all;
  padding-left: 42px;
  font-size: 14px;
  color: #515a6e;
  position: relative;
}  
.confirm-footer{
  margin-top: 20px;
  text-align: right;
}
</style>