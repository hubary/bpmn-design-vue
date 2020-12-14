import BpmnDesign from './bpmn-design';
import BpmnViewer from './bpmn-viewer';
import locale from './locale';

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
