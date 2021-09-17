<template>
  <div class="treebox">
    <Tree :data="objectTree" select-node @on-select-change="selectNode"></Tree>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  methods: {
    selectNode(node) {
      this.$eventHub.$emit('on-tree-select', node)
    }
  },
  computed: {
    ...mapState({
      objectTree: state => state.objectTree
    })
  }
}
</script>

<style lang="less" scoped>
.treebox{
  width: 100%;
  max-height: 300px;
  overflow: auto;
}
</style>
