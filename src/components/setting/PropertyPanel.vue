<template>
  <div class="property-box">
    <div class="row" v-for="(value, key) in info" :key="key" v-if="value">
      <div class="value" :title="value"><span>{{key}}：</span>{{value}}</div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState({
      info: state => state.selectedObjectInfo.object
    })
  }
}
</script>

<style lang="less" scoped>
.property-box{
  width: 250px;
  text-align: left;
  .inline{
    display: inline-block;
    vertical-align: middle;
  }
  .row{
    width: 100%;
    .value{
      width: calc(100% - 20px);
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      span{
        font-weight: bold;
      }
    }
  }
}

</style>