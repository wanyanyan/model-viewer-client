<template>
  <div class="property-box">
    <div class="value"><span>类型：</span>{{info.type}}</div>
    <div class="value"><span>uuid：</span>{{info.uuid}}</div>
    <div class="value"><span>顶点数量：</span>{{info.position.count}}</div>
    <div class="value"><span>法线数量：</span>{{info.normal.count}}</div>
    <div class="value"><span>uv数量：</span>{{info.uv.count}}</div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState({
      info: state => state.selectedObjectInfo.geometries
    })
  }
}
</script>

<style lang="less" scoped>
.property-box{
  width: 250px;
  text-align: left;
  .value{
    width: calc(100% - 20px);
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 30px;
    span{
      font-weight: bold;
    }
  }
}

</style>