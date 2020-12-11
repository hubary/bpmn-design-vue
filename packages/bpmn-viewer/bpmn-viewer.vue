<!--
* @Author: liuhan
* @Email:  hubary@qq.com
* @Description: 描述
-->
<template>
  <div class="bpmn-viewer">
    <BpmnDesign :xml="xml" :viewer="true" />
  </div>
</template>

<script>
import BpmnDesign from '@packages/bpmn-design/bpmn-design.vue';
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
