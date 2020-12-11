<!--
* @Author: liuhan
* @Email:  hubary@qq.com
* @Description: 描述
-->
<template>
  <BpmnDesign xml="xml" :viewer="true" />
</template>

<script>
import BpmnDesign from '@packages/bpmn-design/BpmnDesign.vue';
export default {
  name: 'BpmnViewer',
  components: {
    BpmnDesign,
  },
  mixins: [],
  props: {
    xml: {
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
