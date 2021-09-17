<template>
  <div class="home">
    <div class="left">
      <Model />
    </div>
    <div class="right">
      <GlobalPanel />
    </div>
  </div>
</template>

<script>
import GlobalPanel from '@/components/global/GlobalPanel'
import Model from '@/components/ui/Model'
export default {
  name: 'Home',
  components: {
    GlobalPanel,
    Model
  }
}
</script>

<style lang="less" scoped>
.home{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #eee;
  .right{
    position: absolute;
    width: 300px;
    height: 100%;
    right: 0;
    top: 0;
    border-right: 1px solid #eee;
    box-shadow: 0 0 10px #888;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .left{
    width: calc(100% - 300px);
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    background-color: #fff;
    overflow: hidden;
  }
}
</style>
