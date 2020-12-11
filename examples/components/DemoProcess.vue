<template>
  <div class="hello">
    <BpmnDesign :xml="xml" :show.sync="dialogTableVisible" :viewer="false">
      <template v-slot:mappingSlot="{ setMappingData }">
        <el-dialog
          title="标题"
          :visible.sync="dialogTableVisible"
          :top="'15vh'"
          :width="width"
          ref="elDialog"
          :lock-scroll="true"
        >
          <el-table :data="mockData">
            <el-table-column property="nodeId" label="节点标识" width="150"></el-table-column>
            <el-table-column property="nodeName" label="节点名称" width="200"></el-table-column>
            <el-table-column property="nodeType" label="节点分类"></el-table-column>
            <el-table-column property="createTime" label="创建时间"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm(setMappingData)">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </BpmnDesign>
    <!-- {{ $t('haha') }} -->
  </div>
</template>

<script>
import xml from './mockxml.json';
import mockData from './mock.js';
export default {
  name: 'DemoProcess',
  props: {},
  data() {
    return {
      xml: xml.data.data,
      // xml:'',
      dialogTableVisible: false,
      data: null,
      mockData,
      size: 'medium',
    };
  },
  computed: {},
  mounted() {
    let num = '850px';
    if (this.$refs.elDialog) {
      this.$refs.elDialog.$el.firstChild.style.height = '70%';
    }
    if (document.querySelector('.el-dialog__body')) {
      document.querySelector('.el-dialog__body').style.maxHeight = 'calc(100% - 112px)';
      document.querySelector('.el-dialog__body').style.overflowY = 'auto';
    }
    this.width = num;
  },
  methods: {
    confirm(callback) {
      this.data = this.mockData[0];
      this.dialogTableVisible = false;
      callback(this.data);
    },
  },
};
</script>

<style scoped lang="scss">
.hello {
  position: relative;
  height: 100%;
  width: 100%;
}
.el-dialog__wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .el-dialog {
    max-height: 70%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el-dialog__header {
      .el-dialog__title {
        font-size: 16px;
        color: #333;
      }

      .el-dialog__headerbtn {
        top: 40px;
        right: 40px;
      }

      padding: 0 0 18px 0;
      margin: 36px 40px 0 40px;
      border-bottom: 1px solid #e8e8e8;
    }

    .el-dialog__body {
      flex: 1;
      overflow: auto;
      padding: 20px 40px 30px 40px;
    }

    .el-dialog__footer {
      padding: 10px 40px 40px 40px;
    }
  }
}
</style>
