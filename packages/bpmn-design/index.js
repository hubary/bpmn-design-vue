import BpmnDesign from './BpmnDesign.vue';

// 为组件提供 install 安装方法，供按需引入
BpmnDesign.install = function(Vue) {
  Vue.component(BpmnDesign.name, BpmnDesign);
};

// 默认导出组件
export default BpmnDesign;
