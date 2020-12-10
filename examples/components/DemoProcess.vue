<template>
  <div class="hello">
    <BpmnDesign :xml="xml" />
    <!-- {{ $t('haha') }} -->
  </div>
</template>

<script>
import xml from './mockxml.json';
export default {
  name: 'DemoProcess',
  props: {},
  data() {
    return {
      // xml: xml.data.data,
      xml:'',
    };
  },
};
</script>

<style scoped lang="scss">
.hello {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
