<template>
  <div id="app">
    <router-view/>
    <LoadingBar :show="showLoading"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import LoadingBar from './components/LoadingBar.vue'
export default {
  components: {
    LoadingBar
  },
  computed: {
    ...mapState({
      showLoading: state => state.showLoading
    })
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
