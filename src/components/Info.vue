<template>
  <div class="info-box">
    <div class="row">
      <div class="key inline">部件数：</div>
      <div class="value inline">{{info.components}}个</div>
    </div>
    <div class="row">
      <div class="key inline">三角面数：</div>
      <div class="value inline">{{info.index}}个</div>
    </div>
    <div class="row">
      <div class="key inline">加载耗时：</div>
      <div class="value inline">{{info.time}}毫秒</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info']
}
</script>

<style lang="less" scoped>
.info-box{
  width: 100%;
}
.inline{
  display: inline-block;
  vertical-align: middle;
}
.row{
  width: 100%;
  .key{
    width: 100px;
  }
}
</style>