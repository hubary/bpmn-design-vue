<template>
  <div class="hello">
    <BpmnDesign :xml="xml" :show.sync="dialogTableVisible" :mappingData="data">
      <template v-slot:mappingSlot="{ title }">
        <el-dialog :title="title" :visible.sync="dialogTableVisible">
          <el-table :data="gridData">
            <el-table-column property="date" label="日期" width="150"></el-table-column>
            <el-table-column property="name" label="姓名" width="200"></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </BpmnDesign>
    <!-- {{ $t('haha') }} -->
  </div>
</template>

<script>
import xml from './mockxml.json';
export default {
  name: 'DemoProcess',
  props: {},
  data() {
    return {
      xml: xml.data.data,
      // xml:'',
      dialogTableVisible: false,
      gridData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      data: null,
    };
  },
  methods: {
    confirm() {
      this.data = this.gridData[0];
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
</style>
