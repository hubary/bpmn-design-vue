import BpmnDesign from './bpmn-design';
import BpmnViewer from './bpmn-viewer';
import locale from './locale';
import 'vue-bpmn-design/packages/icons';
// 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'; // 右边工具栏样式
const components = [BpmnDesign, BpmnViewer];

const install = function(Vue, opts = {}) {
  if (install.installed) return;
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.map((component) => Vue.component(component.name, component));
};
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default {
  version: '0.0.1',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  BpmnDesign,
  BpmnViewer,
};
