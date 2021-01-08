<template>
  <div
    :class="['bpmn-containers', { 'bpmn-scenes': !bpmnScenes }]"
    ref="content"
    v-loading="bpmnLoading"
  >
    <div id="bpmn-content" class="canvas" ref="canvas"></div>
    <!-- 还不知道啥作用 -->
    <process-card v-show="eshow" :postion="cardPostion" :card="card" @subproc="checkSubproc" />
    <!-- 右侧属性面板 -->
    <properties-panel
      v-if="bpmnScenes && bpmnModeler"
      :modeler="bpmnModeler"
      :show.sync="mappingShow"
    >
      <template v-slot:panelSlot="{ setMappingData }">
        <slot name="mappingSlot" :setMappingData="setMappingData"></slot>
      </template>
    </properties-panel>
    <!-- 按钮组 -->
    <el-button-group class="bpmn-button-group">
      <template v-if="bpmnScenes">
        <!-- 保存 -->
        <el-button type="primary" @click="bpmnSave" icon="el-icon-document" :size="size">{{
          $i18Han('fop.save')
        }}</el-button>
        <!-- 撤销 -->
        <el-button type="primary" @click="changeBpmnStepBack()" icon="el-icon-back" :size="size">{{
          $i18Han('fop.revoke')
        }}</el-button>
        <!-- 恢复 -->
        <el-button type="primary" @click="changeBpmnStep()" :size="size">
          {{ $i18Han('fop.restore') }}
          <i class="el-icon-right"></i>
        </el-button>
      </template>
      <!-- 放大 -->
      <el-button
        type="primary"
        @click="canvasZoom('enlarge')"
        icon="el-icon-zoom-in"
        :size="size"
        >{{ $i18Han('fop.enlarge') }}</el-button
      >
      <!-- 缩小 -->
      <el-button
        type="primary"
        @click="canvasZoom('shrink')"
        icon="el-icon-zoom-out"
        :size="size"
        >{{ $i18Han('fop.shrink') }}</el-button
      >
    </el-button-group>

    <el-dialog
      v-if="!bpmnScenes"
      :title="$i18Han('bpmn.viewSubprocess')"
      :visible.sync="isPopupShow"
      :close-on-click-modal="false"
      width="80%">
      <process-pup :pupData="pupData" />
    </el-dialog>
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customModule from './customModeler';
import customTranslate from './bpmn-zh/customTranslate';
import ProcessCard from './bpmn-components/process-card';
import PropertiesPanel from './bpmn-components/properties-panel';
// import ProcessPup from "./bpmn-components/process-pup";
// import {
//   // getStartFlowDesign,
//   getFlowDesign,
//   flowDesignSave,
// } from "@/api/fop/business-search";
import { isType, isInclude } from '../utils';
import Locale from 'bpmn-design-vue/packages/mixins/locale';
const customElements = ['start', 'endsucc', 'endfail', 'approve'];
export default {
  name: 'BpmnDesign',
  mixins: [Locale],
  components: {
    ProcessCard,
    PropertiesPanel,
    // ProcessPup
  },
  props: {
    size: {
      type: String,
      default: 'mini',
    },
    xml: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
    // 查看器传入的内容
    viewer: {
      type: Boolean,
      default: false,
    },
    topButtons: {
      type: Array,
      default: () => ['save', 'revoke', 'restore', 'enlarge', 'shrink'],
      required: false,
    },
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      element: null,
      bpmnLoading: false,
      bpmnStartData: {
        file: '',
        key: '',
        ver: '0',
      },
      bpmnEditData: {
        userMap: {
          userId: '',
          orderBankNo: '',
          userName: '',
          userRole: '',
        },
        processCode: '',
        processId: '',
        processVersion: '',
      },
      fromPath: '',
      bpmnXml: '',
      bpmnScenes: true,
      unfold: true,
      Scale: 1,
      cardPostion: {
        left: 0,
        top: 0,
      },
      eshow: false,
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
      isPopupShow: false,
      pupData: {
        processCode: '',
        processId: '',
        processVersion: '',
      },
    };
  },
  computed: {
    mappingShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
    },
  },
  created() {
    console.log('customModule', customModule);
  },
  mounted() {
    // 根据路由path区分 设计/展示 流程图
    // if (isInclude(this.$route.query, "from")) {
    //   this.fromPath = decodeURIComponent(this.$route.query.from);
    //   if (
    //     this.fromPath.includes("/businessSearch/flowInstanceSearch") ||
    //     this.fromPath.includes("/businessSearch/historyInstanceSearch") ||
    //     this.fromPath === "process-model-popup" ||
    //     this.fromPath === "abnormal-handle"
    //   ) {
    //     this.bpmnScenes = false;
    //     Object.assign(
    //       this.bpmnEditData,
    //       this.decodeURIData(
    //         {
    //           processCode: "",
    //           processId: "",
    //           processVersion: "",
    //         },
    //         this.$route.query
    //       )
    //     );
    //     this.checkFlowDesign();
    //   } else if (this.fromPath === "/process/process-model") {
    //     this.bpmnScenes = true;
    //     const queryData = this.decodeURIData(this.$route.query);
    //     this.getFlowStartDesign(queryData);
    //   }
    // } else if (isInclude(this.$route.query, "processXml")) {
    // 查看器
    //   this.bpmnScenes = false;
    //   this.init(decodeURIComponent(this.$route.query.processXml));
    // }
    if (this.xml) {
      if (this.viewer) {
        // 查看器
        this.bpmnScenes = false;
        this.init(this.xml);
      } else {
        // 设计器
        this.bpmnScenes = true;
        this.bpmnStartData.key = this.key; // RUM0005
        this.init(this.xml);
      }
    }
  },
  methods: {
    /**
     * @description: 对this.$route.query 进行 decodeURIComponent
     * @param: data只有传一个参数，对此对象所有数据进行 decodeURIComponent
     * 若有两个数据，第一个数据是return对象，属性值是对第二个数据内的第一个数据的所有key的value进行 decodeURIComponent
     * @return: 进行 decodeURIComponent 后的对象数据
     */
    decodeURIData(...data) {
      const targetObj = {};
      if (data.length && isType.isObject(data[0])) {
        Object.keys(data[0]).forEach((item) => {
          targetObj[item] = decodeURIComponent(data[data.length - 1][item]);
        });
      } else {
        console.error('至少接受一个参数并且必须为Object类型');
      }
      return targetObj;
    },
    /**
     * @description: 从流程模型进入对流程图设计获取xml
     * @param: processCode(流程编码)，flowVersion(流程版本)
     */
    // getFlowStartDesign({ processCode, flowVersion }) {
    //   if (String(processCode) !== 'undefined' && String(flowVersion) !== 'undefined') {
    //     getStartFlowDesign({processCode, flowVersion}).then(({ Header, data }) => {
    //       if (!Header || !data) {
    //         this.resStatus("流程图获取失败", "", "F", true);
    //         return;
    //       }
    //       this.resStatus(Header.RetMsg, "流程图已获取", Header.RetStatus, true);
    //       this.bpmnStartData.key = processCode; // RUM0005
    //       this.init(data);
    //     });
    //   }
    // },
    // 查看流程图，获取xml
    checkFlowDesign() {
      // getFlowDesign(this.bpmnEditData).then(({ Header, xml }) => {
      //   this.resStatus(Header.RetMsg, '流程图已获取', Header.RetStatus, true);
      //   this.init(xml);
      // });
    },
    /**
     * @description: 创建bpmn实例对象
     * @param: xml字符串
     */
    init(xml) {
      if (!xml) {
        return;
      }
      const canvas = this.$refs.canvas;
      const customTranslateModule = {
        translate: ['value', customTranslate],
      };
      const checkProvider = {};
      // 查看流程图限制功能
      if (!this.bpmnScenes) {
        checkProvider.labelEditingProvider = ['value', ''];
        checkProvider.contextPadProvider = ['value', ''];
        checkProvider.bendpoints = ['value', {}];
      }
      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        additionalModules: [customTranslateModule, customModule, checkProvider],
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
      this.bpmnLoading = true;
      try {
        await this.bpmnModeler.importXML(xmlData);

        if (this.bpmnScenes) {
          this.$nextTick(() => {
            this.customModuleStyle();
          });
        } else {
          this.checkProcessView();
        }
      } catch (err) {
        this.resStatus('流程图转换发生错误', '', 'F');
        console.error(err.message, err.warnings);
      } finally {
        this.bpmnLoading = false;
      }
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
    addEventBusListener() {
      // 绑定监听事件
      const eventBus = this.bpmnModeler.get('eventBus');
      const eventTypes = Object.keys(eventBus._listeners); // 获取所有的可用事件
      // console.log(eventTypes); // 打印出来有242种事件
      eventTypes.forEach((event) => {
        if (event.indexOf('shape') !== -1 || event.indexOf('connection') !== -1) {
          this.bpmnModeler.on(event, (e) => {
            return false;
          });
        }
      });
    },
    // success() {
    //   this.bpmnLoading = false;
    //   this.bpmnModeler.on('commandStack.changed', async function() {
    //     try {
    //       const result = await this.bpmnModeler.saveXML({ format: true });
    //       console.log(result);
    //     } catch(err) {
    //       console.log(err.message, err.warnings);
    //     }
    //   })
    // },
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
        Object.assign(this.cardPostion, {
          left: `${offsetX}px`,
          top: `${offsetY}px`,
        });
      });
    },
    /**
     * @description: 设置流程颜色
     * @param: color, element
     */
    colorChange(color, element) {
      const modeling = this.bpmnModeler.get('modeling');
      modeling.setColor(element, {
        fill: null,
        stroke: color,
      });
      modeling.updateProperties(element, { color: color });
    },

    // 为panel添加 收起/展开 按钮
    customModuleStyle() {
      const btn = document.createElement('button');
      btn.className = 'unfold';
      btn.innerText = this.$i18Han('fop.receive');
      const palette = this.$refs.canvas.getElementsByClassName('djs-palette two-column open')[0];
      palette.insertBefore(btn, palette.childNodes[0]);
      const group = palette.getElementsByClassName('group')[8];

      function unfold(event, target) {
        this.unfold = !this.unfold;
        if (this.unfold) {
          event.innerText = this.$i18Han('fop.receive');
          target.className = 'group';
        } else {
          event.innerText = this.$i18Han('fop.unfold');
          target.className += ' group-unfold';
        }
      }
      btn.onclick = unfold.bind(this, btn, group);
    },
    /**
     * @description: 接口返回状态返回显示
     * @param: msg 消息，status 返回接口状态
     * @return {type}
     */
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
    // ==开始==  按钮操作  ========================0==
    /**
     * @description 保存xml { format: true } 表示传给后端的xml带 \n 换行
     * @emit { onSave }
     */
    async bpmnSave() {
      // this.bpmnLoading = true;
      try {
        const result = await this.bpmnModeler.saveXML({ format: true });
        if (result.xml !== '') {
          console.log('bpmnSave', result);
          this.bpmnStartData.file = result.xml;
          // 对外发送'onBpmnSave'数据
          this.$emit('onBpmnSave', this.bpmnStartData);
          // flowDesignSave(this.bpmnStartData).then(({ Header }) => {
          // this.bpmnLoading = false;
          //   this.resStatus(Header.RetMsg, "流程图已保存", Header.RetStatus, true);
          // });
        }
      } catch (err) {
        this.resStatus('流程图本地数据导出失败', '', 'F');
        console.log(err.message, err.warnings);
      }
    },
    canvasZoom(type) {
      if (type === 'enlarge' && this.Scale <= 3) {
        // 放大
        this.Scale += 0.3;
      } else if (type === 'shrink' && this.Scale > 1) {
        // 缩小
        this.Scale -= 0.3;
      }
      this.bpmnModeler.get('canvas').zoom(this.Scale);
    },

    // 恢复
    changeBpmnStep() {
      if (this.bpmnModeler.get('commandStack').canRedo()) {
        this.bpmnModeler.get('commandStack').redo();
      }
    },
    // 撤销
    changeBpmnStepBack() {
      if (this.bpmnModeler.get('commandStack').canUndo()) {
        this.bpmnModeler.get('commandStack').undo();
      }
    },
    // ==结束==  按钮操作  ========================1==

    checkSubproc(data) {
      this.eshow = false;
      Object.assign(this.pupData, data);
      this.isPopupShow = true;
      console.log('checkSubproc', data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@packages/styles/common.scss';
@import '@packages/styles/element-variables.scss';
$--color-primary: #409eff;

.bpmn-containers {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  .djs-palette {
    position: absolute;
  }
  .djs-palette.two-column.open {
    width: 56px;
    left: 0;
    top: 40px;
    .group[data-group='model'] {
      overflow: hidden;
      height: 368px;
      transition: all 0.5s ease-in;
    }
    .group[data-group='model'].group-unfold {
      height: 0;
      opacity: 0;
    }
  }

  .canvas {
    width: 100%;
    height: 100%;
  }
  .bjs-container {
    // position: fixed !important;
    position: relative;
    border-right: 0.8px solid #f1f1f1;
    border-bottom: 0.8px solid #f1f1f1;
    width: inherit;
    svg {
      width: 100%;
      height: 100%;
      background: #fff;
      background-image: linear-gradient(#f1f1f1 0.8px, transparent 0),
        linear-gradient(90deg, #f1f1f1 0.8px, transparent 0),
        linear-gradient(#f1f1f1 0.8px, transparent 0),
        linear-gradient(90deg, #f1f1f1 0.8px, transparent 0);
      background-size: 25px 25px;
    }
  }

  // .djs-palette,
  // .djs-palette .entry,
  // .djs-palette .djs-palette-toggle {
  //   width: 56px;
  // }

  .bpmn-icon-lasso-tool,
  .bpmn-icon-space-tool,
  .bpmn-icon-intermediate-event-none,
  .bpmn-icon-gateway-none,
  .bpmn-icon-text-annotation,
  .bpmn-icon-subprocess-expanded,
  .bpmn-icon-data-object,
  .bpmn-icon-data-store,
  .bpmn-icon-participant,
  .bpmn-icon-group,
  .bpmn-icon-start-event-none,
  .bpmn-icon-end-event-none,
  .bpmn-icon-task,
  .bpmn-icon-screw-wrench {
    display: none;
  }

  .icon-custom {
    &:hover {
      cursor: pointer;
    }
  }

  .icon-custom.start-box {
    background: url(~@packages/assets/images/start.png) no-repeat center center;
    background-size: 30px 30px;
  }

  .icon-custom.flow-box {
    background: url(~@packages/assets/images/flow.png) no-repeat center center;
    background-size: 20px 30px;
  }

  .icon-custom.endsucc-box {
    background: url(~@packages/assets/images/endsucc.png) no-repeat center center;
    background-size: 30px 30px;
  }

  .icon-custom.endfail-box {
    background: url(~@packages/assets/images/endfail.png) no-repeat center center;
    background-size: 30px 30px;
  }

  .icon-custom.task-box {
    background: url(~@packages/assets/images/business.png) no-repeat center center;
    background-size: 30px auto;
  }

  .icon-custom.auto-box {
    background: url(~@packages/assets/images/auto.png) no-repeat center center;
    background-size: 30px 30px;
  }

  .icon-custom.approve-box {
    background: url(~@packages/assets/images/approve.png) no-repeat center center;
    background-size: 30px auto;
  }

  .icon-custom.sign-box {
    background: url(~@packages/assets/images/sign.png) no-repeat center center;
    background-size: 30px auto;
  }

  .icon-custom.subproc-box {
    background: url(~@packages/assets/images/subproc.png) no-repeat center center;
    background-size: 30px 30px;
  }

  .bpmn-button-group {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .bjs-powered-by {
    display: none;
  }

  .unfold {
    width: 100%;
    background: $--color-primary;
    color: #ffffff;
    font-size: 12px;
    text-align: center;
    padding: 6px 0;
    &:hover {
      cursor: pointer;
    }
  }
}

.bpmn-scenes {
  .djs-palette.two-column.open,
  #js-properties-panel {
    display: none;
  }
}
</style>
