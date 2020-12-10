import { t } from 'bpmn-design-vue/packages/locale';

export default {
  methods: {
    $lang(...args) {
      return t.apply(this, args);
    },
  },
};
