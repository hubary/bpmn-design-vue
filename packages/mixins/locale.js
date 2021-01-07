import { t } from 'bpmn-design-vue/packages/locale';

export default {
  methods: {
    $i18Han(...args) {
      return t.apply(this, args);
    },
  },
};
