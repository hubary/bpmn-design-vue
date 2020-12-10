<template>
  <div :class="['custom-properties-panel', { 'custom-properties-panel-hide': !panelHide }]">
    <div v-if="selectedElements.length == 1">
      <fieldset class="bpmn-panel-item">
        <label>名称</label>
        <input :value="element.name" @change="(event) => changeField(event, 'name')" />
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="textDocShow">
        <label>表达式</label>
        <input :value="textDoc" @change="(event) => flowText(event)" />
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="isTask">
        <label>建模节点映射</label>
        <el-input
          placeholder="请输入内容"
          v-model="modelingInput"
          class="input-with-select"
          disabled
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="modelingChoice(element)"
          ></el-button>
        </el-input>
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="branchTypeShow">
        <label>分支方式</label>
        <select class="bpmn-panel-select" @change="changeBranchType" :value="branchType">
          <option v-for="option in branchTypes" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="waitTypeShow">
        <label>自动节点等待模式</label>
        <select class="bpmn-panel-select" @change="changeWaitType" :value="waitType">
          <option v-for="option in waitTypes" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="subprocWaitTypeShow">
        <label>子流程节点等待模式</label>
        <select class="bpmn-panel-select" @change="changeSubprocWaitType" :value="subprocWaitType">
          <option v-for="option in subprocWaitTypes" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="startPersonShow">
        <label>子流程发起人类型</label>
        <select class="bpmn-panel-select" @change="changeStartPerson" :value="startPerson">
          <option v-for="option in startPersons" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="isTask">
        <label>循环支持次数</label>
        <input
          :value="element['activiti:forNum']"
          @change="(event) => changeField(event, 'activiti:forNum', 'activiti:forEnd')"
          onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
          onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
        />
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="branchTypeShow">
        <label>超时自动通过</label>
        <select class="bpmn-panel-select" @change="changeTimeOutPass" :value="timeOutPass">
          <option
            v-for="option in timeOutList"
            :key="option.index"
            :value="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
        </select>
      </fieldset>
      <fieldset class="bpmn-panel-item" v-if="branchTypeShow">
        <label>超时自动否决</label>
        <select class="bpmn-panel-select" @change="changeTimeOutVeto" :value="timeOutVeto">
          <option
            v-for="option in timeOutList"
            :key="option.index"
            :value="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
        </select>
      </fieldset>
    </div>
    <slot name="mappingSlot" :data="{ isPopupShow, node }"></slot>
    <!-- <popup
      :title="'建模节点映射选择'"
      :isShow="isPopupShow"
      :size="'medium'"
      :footerList="popFooterList"
      v-on:senddialogVisible="getdialogVisible"
    >
      <template slot="content">
        <formView
          class="flow-form"
          :isBlock="formData.isBlock"
          :searchData="formData.searchData"
          :isInline="formData.isInline"
          ref="form"
          :formRef="formData.formRef"
          :searchForm="formData.searchForm"
          :searchHandle="formData.searchHandle"
        />
        <tableView
          class="min-table-height"
          :isPage="popupTable.isPage"
          :tableHeaderData="popupTable.paramTableHeader"
          :tableData="popupTable.tableData"
          :total="popupTable.totalRows"
          :currentPage="popupTable.curPage"
          :isRidio="popupTable.isRidio"
          @getRadioSelected="getRadioSelected"
          @getPage="tablePageSearch"
          @getPageSize="tablePageSizeSearch"
        />
      </template>
    </popup> -->
  </div>
</template>

<script>
import { START_EVENT } from 'bpmn-js/lib/features/replace/ReplaceOptions.js';
// import { listSysNode, listNodeDef } from "@/api/fop/business-search";
import { isType, isInclude } from 'bpmn-design-vue/packages/utils';
import Locale from 'bpmn-design-vue/packages/mixins/locale';

export default {
  name: 'properties-panel',
  mixins: [Locale],
  props: {
    modeler: {
      type: Object,
      default: () => ({}),
    },
    show: {
      type: Boolean,
      default: false,
    },
    mappingData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      node: '孙子node',
      selectedElements: [],
      element: null,
      form: {},
      branchType: '0',
      branchTypes: [
        { label: '审批结果标识', value: '0' },
        { label: '流转规则标识', value: '1' },
        { label: '线上表达式', value: '2' },
      ],
      modelingInput: '',
      formData: {
        isBlock: true,
        isInline: true,
        searchData: {
          nodeName: '',
          nodeId: '',
          pageRows: 10,
          curPage: 1,
          parentId: '51',
        },
        formRef: 'inlineForm',
        searchForm: [
          {
            type: 'Input',
            label: '节点标识',
            prop: 'nodeId',
            width: '220px',
            placeholder: '请输入节点标识',
          },
          {
            type: 'Input',
            label: '节点名称',
            prop: 'nodeName',
            width: '220px',
            placeholder: '请输入节点名称',
          },
        ],
        searchHandle: [
          {
            label: this.$lang('fop.search'),
            type: 'primary',
            icon: 'el-icon-search',
            handle: () => this.getListNodeDef(),
          },
          {
            label: this.$lang('fop.reset'),
            type: 'primary',
            icon: 'el-icon-refresh-left',
            handle: () => this.resetForm('form', this.formData.formRef),
          },
        ],
      },
      // isPopupShow: false,
      popFooterList: [
        { name: this.$lang('fop.cancel') },
        {
          type: 'primary',
          name: this.$lang('fop.confirm'),
          isSubmit: 'activiti:sysNodeId',
        },
      ],
      popupTable: {
        paramTableHeader: [
          {
            prop: 'nodeId',
            label: this.$lang('nodeModel.nodeId'),
          },
          {
            prop: 'nodeName',
            label: this.$lang('nodeModel.nodeName'),
          },
          {
            prop: 'nodeType',
            label: this.$lang('nodeModel.nodeType'),
          },
          {
            prop: 'createTime',
            label: this.$lang('nodeModel.creatTime'),
          },
        ],
        tableData: [],
        pageRows: 10,
        totalRows: 0,
        isRidio: true,
        isPage: true,
      },
      treeId: '',
      modelingData: '',
      modelingType: '',
      forEnd: '0',
      customTaskType: ['start', 'task', 'sign', 'auto', 'subproc', 'approve'],
      branchTypeShow: false,
      waitTypeShow: false,
      waitType: '0',
      waitTypes: [
        { label: '异步不等待回调', value: '0' },
        { label: '同步不等待回调', value: '1' },
        { label: '异步等待回调', value: '2' },
        { label: '同步等待回调', value: '3' },
      ],
      subprocWaitTypeShow: false,
      subprocWaitType: '1',
      subprocWaitTypes: [
        { label: '等待结束', value: '1' },
        { label: '不等待结束', value: '2' },
      ],
      startPersonShow: false,
      startPerson: '0',
      startPersons: [
        { label: '主流程发起人', value: '0' },
        { label: '上节点处理人', value: '1' },
      ],
      textDoc: '',
      textDocShow: false,
      panelHide: false,
      timeOutPass: null,
      timeOutVeto: null,
      timeOutList: [],
    };
  },
  computed: {
    isTask() {
      return this.verifyIsTask(this.element.type);
    },
    isPopupShow: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
    },
  },
  watch: {
    isPopupShow: {
      handler(val) {
        if (val) {
          this.getListNodeDef();
        }
      },
      immediate: false,
    },
    mappingData: {
      handler(newVal, oldVal) {
        console.log('mappingData properties-panel', newVal);
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化流程图
    init() {
      const { modeler } = this;
      console.log(START_EVENT);
      // 点击选择流程图元素触发，显示节点信息面板
      modeler.on('selection.changed', (e) => {
        this.selectedElements = e.newSelection;
        this.panelHide = this.selectedElements.length;
        if (!this.selectedElements.length) return;
        this.element = e.newSelection[0];
        if (this.element && this.element.type !== 'bpmn:SequenceFlow') {
          this.expandAttrs(this.element.businessObject);
        } else if (this.element && this.element.type === 'bpmn:SequenceFlow') {
          this.hiddenPanelItem();
          this.setSequenceFlow(this.element.businessObject);
        }
        // console.log("s.changed", this.element)
        this.setDefaultProperties();
      });
      // 当流程图界面改变（节点新增，移动，删除，改变等）时触发
      modeler.on('element.changed', (e) => {
        const { element } = e;
        const { element: currentElement } = this;
        if (!currentElement) {
          // if (element.type === "bpmn:SequenceFlow") {
          //   // 增加连接线判断是否给节点增加分支方式
          //   const eSourceBus = element.source.businessObject;
          //   if (element.source && (element.source.type === "bpmn:UserTask" || element.source.type === "bpmn:StartEvent") &&
          //   eSourceBus.outgoing.length >= 2 && !isInclude(eSourceBus.$attrs, "activiti:branchType")) {
          //     eSourceBus.$attrs["activiti:branchType"] = "0";
          //   }
          //   // console.log(element);
          //   // 新增连接线添加 documentation
          //   if (!isInclude(element.businessObject, "documentation")) {
          //     this.creatSequenceFlow(element.businessObject, "");
          //     return;
          //   }
          //   this.changeSequenceFlow();
          // }
          return;
        }
        if (element.id === currentElement.id) {
          this.element = element;
        }
      });
      modeler.on('shape.removed', (e) => {
        this.changeSequenceFlow();
      });
      modeler.on('connection.added', (e) => {
        this.turn = false;
        this.createdConnection(e);
      });
      modeler.on('connection.changed', (e) => {
        if (!this.turn) {
          this.turn = true;
          return;
        }
        this.changeSequenceFlow();
      });
      modeler.on('connection.removed', (e) => {
        this.changeSequenceFlow();
      });
    },
    createdConnection(e) {
      const { element } = e;
      const eSourceBus = element.source;
      if (
        eSourceBus &&
        (eSourceBus.type === 'bpmn:UserTask' || eSourceBus.type === 'bpmn:StartEvent') &&
        eSourceBus.outgoing.length >= 2 &&
        !isInclude(eSourceBus.businessObject.$attrs, 'activiti:branchType')
      ) {
        eSourceBus.businessObject.$attrs['activiti:branchType'] = '0';
      }
      if (!isInclude(element.businessObject, 'documentation')) {
        this.creatSequenceFlow(element.businessObject, '');
      }
    },
    // 连接线改变
    changeSequenceFlow() {
      this.textDoc = '';
      const flows = this.modeler._definitions.rootElements[0];
      if (flows && Array.isArray(flows.flowElements) && flows.flowElements.length > 0) {
        flows.flowElements.forEach((item) => {
          if (
            isInclude(item.$attrs, 'activiti:branchType') &&
            (!item.outgoing || item.outgoing.length < 2)
          ) {
            delete item.$attrs['activiti:branchType'];
          }
        });
      }
    },
    // 设置节点属性
    setDefaultProperties() {
      const { element } = this;
      if (element) {
        const { type, businessObject } = element;
        // console.log(element);
        const { name } = businessObject;
        if (this.verifyIsTask(type)) {
          this.taskType = type;
        } else if (this.verifyIsCustomTask(businessObject.$attrs)) {
          this.modelingType = businessObject['activiti:nodeType'];
        }
        element['name'] = name;
      }
    },
    /**
     * @description: 判断节点类型
     * @param {type: string}
     * @return {boolean}
     */
    verifyIsEvent(type) {
      return type.includes('Event');
    },
    verifyIsTask(type) {
      return type.includes('Task');
    },
    verifyIsCustomTask(obj) {
      return isInclude(obj, 'activiti:nodeType');
    },
    /**
     * 改变控件触发的事件
     * @param { Object } input的Event
     * @param { String } 要修改的属性的名称
     */
    changeField(event, type, attr) {
      const value = event.target.value;
      this.element[type] = value;
      let properties = {};
      properties[type] = value;
      if (attr === 'activiti:forEnd') {
        const aValue = event.target.value == 0 ? false : true;
        this.element[attr] = aValue;
        properties[attr] = aValue;
      }
      this.updateProperties(properties);
    },
    // 显示建模节点映射popup
    modelingChoice(element) {
      this.modelingType = element.businessObject.$attrs['activiti:nodeType'];
      this.isPopupShow = true;
    },
    // 建模节点映射popup按钮
    getdialogVisible(type) {
      if (type === 'activiti:sysNodeId') {
        const value = this.modelingData.nodeId;
        this.modelingInput = this.modelingData.nodeName;
        this.element[type] = value;
        let properties = {};
        properties[type] = value;
        properties['sysName'] = this.modelingInput;
        this.updateProperties(properties);
      }
      this.$refs['form'].$refs['inlineForm'].resetFields();
      this.isPopupShow = false;
    },
    // 设置分支方式
    changeBranchType(event) {
      this.branchType = event['target'] ? event.target.value : event.value;
      this.element['activiti:branchType'] = this.branchType;
      let properties = {};
      properties['activiti:branchType'] = this.branchType;
      this.updateProperties(properties);
    },
    // 设置自动节点等待
    changeWaitType(event) {
      this.waitType = event.target.value;
      this.element['activiti:waitType'] = this.waitType;
      let properties = {};
      properties['activiti:waitType'] = this.waitType;
      this.updateProperties(properties);
    },
    // 设置子流程节点等待模式
    changeSubprocWaitType(event) {
      this.waitType = event.target.value;
      this.element['activiti:waitType'] = this.waitType;
      let properties = {};
      properties['activiti:waitType'] = this.waitType;
      this.updateProperties(properties);
    },
    // 设置子流程发起人类型
    changeStartPerson(event) {
      this.startPerson = event.target.value;
      this.element['activiti:startPerson'] = this.startPerson;
      let properties = {};
      properties['activiti:startPerson'] = this.startPerson;
      this.updateProperties(properties);
    },
    /**
     * 更新元素属性
     * @param { Object } 要更新的属性, 例如 { name: "" }
     */
    updateProperties(properties) {
      const { modeler, element } = this;
      const modeling = modeler.get('modeling');
      // console.log(modeling);
      modeling.updateProperties(element, properties);
    },
    // 获取对应数据并且过滤有效数据
    getListNodeDef() {
      const params = Object.assign({}, this.formData.searchData, {
        curPage: this.popupTable.curPage,
        pageRows: this.popupTable.pageRows,
      });
      // 刘含修改于2020-11-3 ,nodeType参数传给后端去过滤
      params.nodeType = this.modelingType;
      // listNodeDef(params).then(({pageData}) => {
      //   this.popupTable.tableData =pageData.result;
      //   // this.popupTable.tableData = (pageData.result).filter((item) => item.nodeType === this.modelingType);
      //   this.popupTable.totalRows = pageData.totalRows;
      // });
    },
    getRadioSelected(data) {
      this.modelingData = data;
    },
    expandAttrs(busObj) {
      this.textDocShow = false;
      this.hiddenPanelItem();
      if (
        (busObj.$type === 'bpmn:UserTask' || busObj.$type === 'bpmn:StartEvent') &&
        this.customTaskType.includes(busObj.$attrs['activiti:nodeType'])
      ) {
        if (isInclude(busObj, 'outgoing') && busObj.outgoing.length >= 2) {
          this.setTimeOutList(busObj);
          this.branchTypeShow = true;
        }
        if (isInclude(busObj.$attrs, 'activiti:branchType')) {
          this.branchType = busObj.$attrs['activiti:branchType'];
        } else {
          this.branchType = '0';
        }
        if (isInclude(busObj.$attrs, 'activiti:sysNodeId')) {
          this.modelingInput = busObj.$attrs['sysName'];
        } else {
          this.modelingInput = '';
        }
        if (busObj.$attrs['activiti:nodeType'] === 'auto') {
          this.waitTypeShow = true;
          if (isInclude(busObj.$attrs, 'activiti:waitType')) {
            this.waitType = busObj.$attrs['activiti:waitType'];
          } else {
            this.waitType = '';
          }
        }
        if (busObj.$attrs['activiti:nodeType'] === 'subproc') {
          this.subprocWaitTypeShow = true;
          this.startPersonShow = true;
          if (isInclude(busObj.$attrs, 'activiti:waitType')) {
            this.subprocWaitType = busObj.$attrs['activiti:waitType'];
          } else {
            this.subprocWaitType = '';
          }
          if (isInclude(busObj.$attrs, 'activiti:startPerson')) {
            this.startPerson = busObj.$attrs['activiti:startPerson'];
          } else {
            this.startPerson = '';
          }
        }
      }
    },
    tablePageSearch(page) {
      this.popupTable.curPage = Number(page);
      this.getListNodeDef();
    },
    tablePageSizeSearch(pageSize) {
      this.popupTable.curPage = 1;
      this.popupTable.pageRows = Number(pageSize);
      this.getListNodeDef();
    },
    // 隐藏节点属性设置框
    hiddenPanelItem() {
      this.branchTypeShow = false;
      this.waitTypeShow = false;
      this.subprocWaitTypeShow = false;
      this.startPersonShow = false;
    },
    // 展示节点连接线数据
    setSequenceFlow(busObj) {
      if (
        isInclude(busObj, 'documentation') &&
        busObj.documentation[0] &&
        isInclude(busObj.documentation[0], 'text')
      ) {
        this.textDoc = busObj.documentation[0].text;
      } else {
        this.textDoc = '';
      }
      this.textDocShow = true;
    },
    // 创建节点连接线
    creatSequenceFlow(busObj, scenes) {
      if (String(scenes) !== 'undefined') {
        this.textDoc = '';
      }
      const doction = this.modeler.get('bpmnFactory').create('bpmn:Documentation', {
        text: this.textDoc,
      });
      busObj.documentation = [doction];
    },
    // 设置节点连接线表达式
    flowText(event) {
      this.textDoc = event.target.value;
      const { type, businessObject } = this.element;
      if (type === 'bpmn:SequenceFlow') {
        this.creatSequenceFlow(businessObject);
      }
    },
    resetForm(form, formName) {
      this.$refs[form].$refs[formName].resetFields();
      this.getListNodeDef();
    },
    setTimeOutList(busObj) {
      this.timeOutPass = null;
      this.timeOutVeto = null;
      const olist = busObj.outgoing.map((item, index) => {
        return {
          label: item.targetRef.name,
          value: item.targetRef.id,
          index: index + 1,
          disabled: false,
        };
      });
      olist.unshift({ index: 0, label: '--请选择--', value: '' });
      this.timeOutList = olist;
      if (isInclude(busObj.$attrs, 'activiti:timeFlowFlag')) {
        this.$nextTick(() => {
          this.getTimeOutValue(busObj);
        });
      }
    },
    getTimeOutValue(data) {
      const { ok, no } = JSON.parse(data.$attrs['activiti:timeFlowFlag']);
      this.timeOutPass = ok;
      this.timeOutVeto = no;
      this.selectDisabled();
    },
    changeTimeOutVeto(event) {
      this.timeOutVeto = event.target.value;
      this.selectDisabled();
    },
    changeTimeOutPass(event) {
      this.timeOutPass = event.target.value;
      this.selectDisabled();
    },
    selectDisabled() {
      const list = JSON.parse(JSON.stringify(this.timeOutList));
      list.forEach((item) => {
        if (item.index && (item.value === this.timeOutPass || item.value === this.timeOutVeto)) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
      this.timeOutList = list;
      const strObj = JSON.stringify({ ok: this.timeOutPass, no: this.timeOutVeto });
      this.element['activiti:timeFlowFlag'] = strObj;
      let properties = {};
      properties['activiti:timeFlowFlag'] = strObj;
      this.updateProperties(properties);
    },
  },
};
</script>

<style scoped lang="scss">
$--color-primary: #409eff;
// @import "@/styles/element-variables.scss";
.custom-properties-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  // border-color: rgba(0, 0, 0, 0.09);
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
  transition: all 0.5s;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2), 0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12);

  .el-main {
    padding: 0 10px;
  }

  ::v-deep .m-tree {
    max-height: 380px;
  }

  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #333;
  }

  .bpmn-panel-item {
    padding: 10px;
    margin-bottom: 10px;
    border: none;
    &:first-child {
      margin-top: 0;
    }
    ::v-deep .el-input-group__append {
      background: $--color-primary;
      color: #fff;
    }
  }

  .bpmn-panel-select {
    -webkit-appearance: menulist-button;
    width: 100%;
    height: 30px;
    background: #fff;
    font-size: 14px;
    option {
      font-size: 14px;
      background: #fff;
    }
  }

  input,
  textarea {
    width: 100%;
    padding: 4px 11px;
    color: rgba(51, 51, 51, 1);
    font-size: 14px;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all 0.3s;
    outline: none;
  }

  input:focus,
  textarea:focus,
  [contenteditable]:focus {
    border-color: rgba(67, 163, 251, 1);
    box-shadow: 0 0 2px 0 rgba(67, 163, 251, 0.68);
  }

  label {
    display: block;
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 15px;
    &:after {
      content: ': ';
    }
  }
  .min-table-height {
    height: 300px;
  }
}
.custom-properties-panel-hide {
  width: 0;
  opacity: 0;
}
</style>
