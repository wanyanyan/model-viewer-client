<template>
  <div class="property-box">
    <div class="row" v-for="(value, key) in info" :key="key">
      <div class="key inline" :title="key">{{key}}：</div>
      <div class="value inline" :title="value">{{value}}</div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState({
      info: state => state.properties
    })
  }
}
</script>

<style lang="less" scoped>
.property-box{
  width: 250px;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  position: absolute;
  top: 70px;
  right: 5px;
  text-align: left;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  .inline{
    display: inline-block;
    vertical-align: middle;
  }
  .row{
    width: 100%;
    .key{
      font-weight: bold;
      width: 80px;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .value{
      width: calc(100% - 80px);
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

</style>