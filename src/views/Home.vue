<template>
  <div class="home">
    <div class="left"></div>
    <div class="right"></div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
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
  .left{
    position: absolute;
    width: 200px;
    height: 100%;
    left: 0;
    top: 0;
    border-right: 1px solid #eee;
    box-shadow: 0 0 10px #ccc;
  }
}
</style>
