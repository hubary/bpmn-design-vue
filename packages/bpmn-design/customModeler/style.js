const customElements = [
  'start',
  'endsucc',
  'endfail',
  'task',
  'sign',
  'auto',
  'subproc',
  'approve',
];
const hasLabelElements = [
  'start',
  'endsucc',
  'endfail',
  'task',
  'sign',
  'auto',
  'subproc',
  'approve',
];
// 一开始就有label标签的元素类型

const customConfig = {
  // 自定义元素的配置(后面会用到)
  start: {
    attr: { x: 0, y: 0, width: 40, height: 44 },
    child: { x: 0, y: 0, width: 40, height: 44 },
    url: require('@packages/assets/images/startbig.png'),
  },
  endsucc: {
    attr: { x: 0, y: 0, width: 40, height: 44 },
    child: { x: 0, y: 0, width: 40, height: 44 },
    url: require('@packages/assets/images/endsuccbig.png'),
  },
  endfail: {
    attr: { x: 0, y: 0, width: 40, height: 44 },
    child: { x: 0, y: 0, width: 40, height: 44 },
    url: require('@packages/assets/images/endfailbig.png'),
  },
  task: {
    attr: { x: 0, y: 0, width: 168, height: 94.3 },
    child: { x: 5, y: 5, width: 28 },
    url: require('@packages/assets/images/business.png'),
  },
  sign: {
    attr: { x: 0, y: 0, width: 168, height: 94.3 },
    child: { x: 5, y: 5, width: 30 },
    url: require('@packages/assets/images/sign.png'),
  },
  subproc: {
    attr: { x: 0, y: 0, width: 168, height: 94.3 },
    child: { x: 5, y: 5, width: 30 },
    url: require('@packages/assets/images/subproc.png'),
  },
  auto: {
    attr: { x: 0, y: 0, width: 168, height: 94.3 },
    child: { x: 5, y: 5, width: 30 },
    url: require('@packages/assets/images/auto.png'),
  },
  approve: {
    attr: { x: 0, y: 0, width: 168, height: 94.3 },
    child: { x: 5, y: 5, width: 26 },
    url: require('@packages/assets/images/approve.png'),
  },
};
export { customElements, customConfig, hasLabelElements };
