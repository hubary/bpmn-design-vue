<template>
  <div id="app">
    <el-container class="">
      <el-header>
        <router-link to="/">demo design</router-link>
        <router-link to="/demo-viewer">demo viewer</router-link>
      </el-header>
      <el-container>
        <el-aside width="200px" class="hubary-aside">Aside</el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
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
  display: flex;
  justify-content:space-evenly;
  align-items: center;
}
.el-container {
  height: 100%;
}
</style>
