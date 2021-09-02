<template>
  <div class="home">
    <div class="left">
      <Upload />
    </div>
    <div class="right">
      <Model />
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import Model from '@/components/Model'
export default {
  name: 'Home',
  components: {
    Upload,
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
  .left{
    padding: 0 10px;
    position: absolute;
    width: 200px;
    height: 100%;
    left: 0;
    top: 0;
    border-right: 1px solid #eee;
    box-shadow: 0 0 10px #ccc;
  }
  .right{
    width: calc(100% - 200px);
    height: 100%;
    right: 0;
    top: 0;
    position: absolute;
    background-color: #fff;
  }
}
</style>
