<template>
  <div class="loading" v-show="show">
    <LoadingCircle :fixed="true" width="40" height="40" />
  </div>
</template>
<script>
import LoadingCircle from './LoadingCircle'
export default {
  components: {
    LoadingCircle
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>
.loading{
  z-index: 9999 !important;
  background-color: rgb(232, 232, 232, 0)  !important;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
