import { t } from 'vue-bpmn-design/packages/locale';

export default {
  methods: {
    $lang(...args) {
      return t.apply(this, args);
    },
  },
};
