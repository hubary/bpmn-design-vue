# bpmn-design-vue

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# 使用

基于vue/element-ui/bpmn
在项目工程的入口文件(例如main.js)引入
```bash
import BpmnDesignVue from 'bpmn-design-vue'

// 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'; // 右边工具栏样式
import "bpmn-design-vue/dest/bpmn-design-vue.css";

Vue.use(BpmnDesignVue)

```


```bash
<template>
  <div class="bpmn-viewer">
    <bpmn-viewer :xml="xml"></bpmn-viewer>
  </div>
</template>

<script>
import xml from './mockxml.json';

export default {
  name: 'Hubary',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      xml: xml.data.data,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.bpmn-viewer {
  height: 100%;
  width: 100%;
}
</style>
```

