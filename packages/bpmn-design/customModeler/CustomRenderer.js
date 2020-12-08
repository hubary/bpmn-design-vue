import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'; // 引入默认的renderer
// import {
//   componentsToPath,
//   createLine
// } from 'diagram-js/lib/util/RenderUtil';
import {
  append as svgAppend,
  attr as svgAttr,
  // classes as svgClasses,
  create as svgCreate,
} from 'tiny-svg';

import { customElements, customConfig } from './style.js';
// 最高优先级
const HIGH_PRIORITY = 1500,
  TASK_BORDER_RADIUS = 5,
  COLOR = '#9f9f9f',
  FILL = '#ffffff',
  COLOR_PASS = '#d1f8b1',
  COLOR_WAIT = '#a5d7f4',
  COLOR_ERROR = '#FFDCD7',
  // FLOW_COLOR = '#389E0D',
  NODE_TYPE = ['start', 'endsucc', 'endfail'];
// CONNECTION_STYLE = styles.style([ 'no-fill' ], { strokeWidth: 5, stroke: 'fuchsia' });
// 继承BaseRenderer
export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }
  /**
   * @description: 所有元素渲染处理
   * @param {element} 过滤后只对flow渲染
   * @return {type}
   */
  canRender(element) {
    // ignore labels
    return !element.labelTarget;
  }
  // drawConnection(visuals, connection) {
  //   console.log("32424");
  //   const line = createLine(connection.waypoints, {stroke: "red"});
  //   svgAppend(visuals, line);

  //   return line;
  // }

  drawShape(parentNode, element) {
    // 获取到类型
    const type = element.businessObject.$attrs['activiti:nodeType'];
    const ntype = element.businessObject.$attrs['ns0:nodeType'];
    let dataResult = null;
    let customRect = null;
    // or customConfig[type]
    if (customElements.includes(type || ntype)) {
      const { url, attr, child } = customConfig[type || ntype];
      if (NodeType(type, ntype)) {
        element['width'] = attr.width;
        element['height'] = attr.height;
        if (element.businessObject.$attrs['data']) {
          dataResult = JSON.parse(element.businessObject.$attrs['data']);
          element.businessObject.$attrs['process'] = dataResult;
          let rcolor = dataResult.state === '0' ? COLOR_WAIT : COLOR_PASS;
          if (dataResult.errormsg) rcolor = COLOR_ERROR;
          customRect = drawRect(
            parentNode,
            attr.width,
            attr.height,
            TASK_BORDER_RADIUS,
            COLOR,
            rcolor
          );
        } else {
          customRect = drawRect(
            parentNode,
            attr.width,
            attr.height,
            TASK_BORDER_RADIUS,
            COLOR,
            FILL
          );
        }
      }
      const customIcon = svgCreate('image', {
        ...child,
        href: url,
      });
      svgAppend(parentNode, customIcon);
      if (customElements.includes(type || ntype) && element.businessObject.name) {
        if (NodeType(type, ntype)) {
          const text = svgCreate('text', {
            width: attr.width * 2,
            height: attr.height,
            textAnchor: 'middle',
            x: 84,
            y: attr.y + attr.height / 2 + 20,
            'font-size': '14',
            fill: '#000',
          });
          text.innerHTML = element.businessObject.name;
          svgAppend(parentNode, text);
        }
      }
      return customRect;
    }
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    return shape;
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape);
  }

  // getConnectionPath(connection) {
  //   return this.bpmnRenderer.getConnectionPath(connection)
  // }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

function drawRect(parentNode, width, height, borderRadius, color, fill) {
  const rect = svgCreate('rect');
  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 1,
    fill: fill,
  });
  svgAppend(parentNode, rect);
  return rect;
}
// function createLine(points, attrs) {
//   var line = svgCreate('polyline');
//   svgAttr(line, { points: toSVGPoints(points) });

//   if (attrs) {
//     svgAttr(line, attrs);
//   }

//   return line;
// }

function NodeType(type, actType) {
  return !NODE_TYPE.includes(type || actType);
}
