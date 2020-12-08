export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    // getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createStart(name, type) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:StartEvent', {
          name: name,
          'activiti:nodeType': type,
        });
        const shape = elementFactory.createShape({
          type: 'bpmn:StartEvent',
          businessObject,
        });
        // console.log(elementFactory.createShape) // 只在拖动或者点击时触发
        create.start(event, shape);
      };
    }
    // function createFlow(name) {
    //   return function(event) {
    //     const businessObject = bpmnFactory.create('bpmn:SequenceFlow', {
    //       name: name,
    //     });
    //     const shape = elementFactory.createShape({
    //       type: 'bpmn:SequenceFlow',
    //       businessObject,
    //     });
    //     create.start(event, shape);
    //   };
    // }

    function createEnd(name, type) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:EndEvent', {
          name: name,
          'activiti:nodeType': type,
        });
        const shape = elementFactory.createShape({
          type: 'bpmn:EndEvent',
          businessObject,
        });
        create.start(event, shape);
      };
    }

    function createTask(name, type) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:UserTask', {
          name: name,
          'activiti:nodeType': type,
          'activiti:forEnd': false,
          'activiti:forNum': '0',
        });
        const shape = elementFactory.createShape({
          type: 'bpmn:UserTask',
          businessObject,
        });
        create.start(event, shape);
      };
    }

    function createSpecalTask(name, obj, type) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:UserTask', {
          name: name,
          'activiti:nodeType': type,
          'activiti:forEnd': false,
          'activiti:forNum': '0',
        });
        for (let i in obj) {
          businessObject.$attrs[i] = obj[i];
        }
        const shape = elementFactory.createShape({
          type: 'bpmn:UserTask',
          businessObject,
        });
        create.start(event, shape);
      };
    }

    return {
      'create.start': {
        group: 'model',
        className: 'icon-custom start-box',
        title: translate('开始'),
        action: {
          dragstart: createStart('开始', 'start'),
          click: createStart('开始', 'start'),
        },
      },
      // 'create.flow': {
      //   group: 'model',
      //   className: 'icon-custom flow-box',
      //   title: translate(''),
      //   action: {
      //     dragstart: createFlow("1"),
      //     click: createFlow("1")
      //   }
      // },
      'create.endsucc': {
        group: 'model',
        className: 'icon-custom endsucc-box',
        title: translate('正常结束'),
        action: {
          dragstart: createEnd('正常结束', 'endsucc'),
          click: createEnd('正常结束', 'endsucc'),
        },
      },
      'create.endfail': {
        group: 'model',
        className: 'icon-custom endfail-box',
        title: translate('异常结束'),
        action: {
          dragstart: createEnd('异常结束', 'endfail'),
          click: createEnd('异常结束', 'endfail'),
        },
      },
      'create.task-task': {
        group: 'model',
        className: 'icon-custom task-box',
        title: translate('业务节点'),
        action: {
          dragstart: createTask('业务节点', 'task'),
          click: createTask('业务节点', 'task'),
        },
      },
      'create.auto-task': {
        group: 'model',
        className: 'icon-custom auto-box',
        title: translate('自动节点'),
        action: {
          dragstart: createSpecalTask(
            '自动节点',
            {
              'activiti:waitType': '0',
            },
            'auto'
          ),
          click: createSpecalTask(
            '自动节点',
            {
              'activiti:waitType': '0',
            },
            'auto'
          ),
        },
      },
      'create.approve-task': {
        group: 'model',
        className: 'icon-custom approve-box',
        title: translate('审批节点'),
        action: {
          dragstart: createTask('审批节点', 'approve'),
          click: createTask('审批节点', 'approve'),
        },
      },
      'create.sign-task': {
        group: 'model',
        className: 'icon-custom sign-box',
        title: translate('会签节点'),
        action: {
          dragstart: createTask('会签节点', 'sign'),
          click: createTask('会签节点', 'sign'),
        },
      },
      'create.subproc-task': {
        group: 'model',
        className: 'icon-custom subproc-box',
        title: translate('子流程节点'),
        action: {
          dragstart: createSpecalTask(
            '子流程节点',
            {
              'activiti:startPerson': '0',
              'activiti:waitType': '1',
            },
            'subproc'
          ),
          click: createSpecalTask(
            '子流程节点',
            {
              'activiti:startPerson': '0',
              'activiti:waitType': '1',
            },
            'subproc'
          ),
        },
      },
    };
  }
}

CustomPalette.$inject = ['bpmnFactory', 'create', 'elementFactory', 'palette', 'translate'];
