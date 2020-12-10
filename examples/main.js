import Vue from 'vue';
import App from './App.vue';
import BpmnDesignVue from '@packages/bpmn-design';
import VueI18n from 'vue-i18n';
import ElementUI from 'element-ui';
import '@examples/styles/common.scss';
import 'element-ui/lib/theme-chalk/index.css';
// 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'; // 右边工具栏样式
const messages = {
  'zh-CN': {
    haha: '哈哈',
  },
};
export function getLcaleMessages() {
  return messages;
}

export function getLanguage() {
  // const chooseLanguage = Cookies.get('language');
  // if (chooseLanguage) return chooseLanguage;

  // // if has not choose language
  // const language = (navigator.language || navigator.browserLanguage).toLowerCase();
  // const locales = Object.keys(messages);
  // for (const locale of locales) {
  //   if (language.indexOf(locale) > -1) {
  //     return locale;
  //   }
  // }
  return 'zh-CN';
}

Vue.use(VueI18n);
Vue.use(ElementUI, { size: 'small' });
Vue.use(BpmnDesignVue);
Vue.config.productionTip = false;
const i18n = new VueI18n({
  locale: getLanguage(),
  messages: getLcaleMessages(),
  silentTranslationWarn: false,
});

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount('#app');
