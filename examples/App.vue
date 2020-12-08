<template>
  <div id="app">
    <el-container class="">
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px" class="hubary-aside">Aside</el-aside>
        <el-main><DemoProcess msg="Welcome to Your Vue.js App" /></el-main>
      </el-container>
    </el-container>
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
.hubary-aside {
  background: #f99;
  height: 100%;
}
.el-header {
  background: #9f9;
}
.el-container {
  height: 100%;
}
</style>
