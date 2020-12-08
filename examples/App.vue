<template>
  <div id="app">
    <el-button>ashdasd</el-button>
    <DemoProcess msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import DemoProcess from './components/DemoProcess.vue';

export default {
  name: 'App',
  components: {
    DemoProcess,
  },
};
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}
</style>
