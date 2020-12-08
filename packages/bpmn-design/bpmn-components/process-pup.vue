<template>
  <div v-loading="bpmnLoading" class="popup-bpmn">
    <el-button-group class="bpmn-button-group">
      <el-button
        type="primary"
        @click="canvasZoom('enlarge')"
        icon="el-icon-zoom-in"
        :size="size"
        >{{ $lang('fop.enlarge') }}</el-button
      >
      <el-button
        type="primary"
        @click="canvasZoom('shrink')"
        icon="el-icon-zoom-out"
        :size="size"
        >{{ $lang('fop.shrink') }}</el-button
      >
    </el-button-group>
    <div class="canvas" ref="processCanvas"></div>
    <process-card v-show="eshow" :postion="cardPostion" :card="card" />
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customModule from '../customModeler';
import ProcessCard from './process-card';
// import { getFlowDesign } from "@/api/fop/business-search";
import { isType, isInclude } from '../../utils';
import Locale from 'vue-bpmn-design/packages/mixins/locale';

export default {
  name: 'process-pup',
  mixins: [Locale],
  components: {
    ProcessCard,
  },
  props: {
    pupData: {
      type: Object,
    },
  },
  data() {
    return {
      bpmnModeler: null,
      element: null,
      bpmnLoading: true,
      bpmnEditData: {
        userMap: {
          userId: '100002',
          orderBankNo: '800000',
          userName: '800000',
          userRole: 'ZHZ',
        },
        processCode: '',
        processId: '',
        processVersion: '',
      },
      Scale: 1,
      eshow: false,
      cardPostion: {
        left: 0,
        top: 0,
      },
      card: {
        title: '',
        state: '',
        mainflow: '',
        subflow: '',
        doresult: [
          {
            dotime: '',
            name: '',
            result: '',
            remark: '',
          },
        ],
      },
    };
  },
  watch: {
    pupData: {
      immediate: true,
      deep: true,
      handler() {
        Object.assign(this.bpmnEditData, this.pupData);
        this.checkFlowDesign();
      },
    },
  },
  computed: {
    size() {
      return 'mini';
    },
  },
  methods: {
    // 查看流程图，获取xml
    checkFlowDesign() {
      // getFlowDesign(this.bpmnEditData).then(({ Header, xml }) => {
      //   this.resStatus(Header.RetMsg, "流程图已获取", Header.RetStatus, true);
      //   this.init(xml);
      // });
      // this.init(xml);
    },
    /**
     * @description: 创建bpmn实例对象
     * @param: xml字符串
     */
    init(xml) {
      if (!xml) {
        this.bpmnLoading = false;
        return;
      }
      const canvas = this.$refs.processCanvas;
      const checkProvider = {};
      // 查看流程图限制功能
      if (!this.bpmnScenes) {
        checkProvider.labelEditingProvider = ['value', ''];
        checkProvider.contextPadProvider = ['value', ''];
        checkProvider.bendpoints = ['value', {}];
      }
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        additionalModules: [customModule, checkProvider],
      });
      if (!this.bpmnScenes) {
        this.addEventBusListener();
        this.customFlowStyle();
      }
      this.createNewDiagram(xml);
    },
    /**
     * @description: 渲染xml，展示流程图
     * @param: xmlData字符串
     */
    async createNewDiagram(xmlData) {
      // console.log(xmlData)
      // 将字符串转换成图显示出来
      try {
        await this.bpmnModeler.importXML(xmlData);
        this.checkProcessView();
        this.bpmnLoading = false;
      } catch (err) {
        this.resStatus('流程图获取失败', '', 'F');
        console.error(err.message, err.warnings);
      }
    },
    addEventBusListener() {
      const eventBus = this.bpmnModeler.get('eventBus');
      const eventTypes = Object.keys(eventBus._listeners);
      eventTypes.forEach((event) => {
        if (event.indexOf('shape') !== -1 || event.indexOf('connection') !== -1) {
          this.bpmnModeler.on(event, (e) => {
            return false;
          });
        }
      });
    },
    customFlowStyle() {
      this.bpmnModeler.on('bpmnElement.added', ({ element }) => {
        if (element.type === 'bpmn:SequenceFlow') {
          if (
            isInclude(element.source.businessObject.$attrs, 'process') &&
            isInclude(element.target.businessObject.$attrs, 'process')
          ) {
            this.colorChange('#389E0D', element);
          } else if (element.source.type === 'bpmn:StartEvent') {
            this.colorChange('#389E0D', element);
          } else {
            this.colorChange('#999999', element);
          }
        }
      });
    },
    colorChange(color, element) {
      const modeling = this.bpmnModeler.get('modeling');
      modeling.setColor(element, {
        fill: null,
        stroke: color,
      });
      modeling.updateProperties(element, { color: color });
    },
    checkProcessView() {
      this.bpmnModeler.on('selection.changed', (e) => {
        this.card = {
          title: '',
          state: '',
          mainflow: '',
          subflow: '',
          doresult: [],
        };
        setTimeout(() => {
          this.eshow = false;
          this.element = e.newSelection[0];
          if (
            this.element &&
            this.element.type === 'bpmn:UserTask' &&
            isInclude(this.element.businessObject.$attrs, 'process')
          ) {
            Object.assign(this.card, {
              title: this.element.businessObject.name,
              ...this.element.businessObject.$attrs.process,
            });
            this.eshow = true;
          }
        });
      });
      this.bpmnModeler.on('canvas.viewbox.changing', (e) => {
        this.eshow = false;
      });
      this.bpmnModeler.on('element.click', (e) => {
        const { offsetX, offsetY } = e.originalEvent;
        Object.assign(this.cardPostion, { left: `${offsetX}px`, top: `${offsetY}px` });
      });
    },
    resStatus(msg, sucmsg, status, special) {
      let rstatus = '';
      if (special && status === 'S') {
        rstatus = 'success';
      } else if (status === 'F') {
        rstatus = 'error';
      }
      if (rstatus) {
        this.$message({
          message: status === 'F' ? msg : sucmsg,
          type: rstatus,
        });
      }
    },
    canvasZoom(type) {
      if (type === 'enlarge' && this.Scale <= 3) {
        this.Scale += 0.3;
      } else if (type === 'shrink' && this.Scale > 1) {
        this.Scale -= 0.3;
      }
      this.bpmnModeler.get('canvas').zoom(this.Scale);
    },
  },
};
</script>
<style lang="scss">
.popup-bpmn {
  position: relative;
  height: 65vh;
}
.bpmn-button-group {
  z-index: 88;
}
</style>
