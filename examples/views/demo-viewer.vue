<!--
* @Author: liuhan
* @Email:  liuhan@csftgroup.com/hubary@qq.com
* @Description: 描述
-->
<template>
  <div class="bpmn-viewer">
    <bpmn-viewer :xml="xml"></bpmn-viewer>
  </div>
</template>

<script>
import xml from './test.json';

export default {
  name: 'Hubary',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      xml: xml.data.xml,
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
