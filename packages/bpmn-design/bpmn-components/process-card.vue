<template>
  <el-card class="box-card p14" :style="postion" :body-style="style">
    <p class="card-title">{{ card.title }}</p>
    <div class="card-body">
      <div>
        <div class="content-button" v-if="card.subproc">
          <el-button icon="el-icon-connection" type="primary" @click="checkChildFlow">
            {{ $lang('bpmn.viewSubprocess') }}</el-button
          >
        </div>
        <div v-if="card.state == '1'">
          <span class="card-label">{{ $lang('bpmn.serialNumber') }}: </span>
          <span>{{ card.mainflow }}{{ card.subflow }}</span>
        </div>
        <div v-else-if="card.state == '0' && card.douser">
          <span class="card-label">{{ $lang('bpmn.handleablePerson') }}: </span>
          <span>{{ card.douser }}</span>
        </div>
        <div v-if="card.doresult && card.doresult.length">
          <div class="card-item" v-for="(v, index) in card.doresult" :key="index">
            <div v-if="v.username">
              <span class="card-label">{{ $lang('bpmn.handler') }}: </span>
              <span>{{ v.username }}</span>
            </div>
            <div v-if="v.dotime">
              <span class="card-label">{{ $lang('bpmn.processingTime') }}: </span>
              <span>{{ v.dotime }}</span>
            </div>
            <div v-if="v.result">
              <span class="card-label">{{ $lang('bpmn.processResult') }}: </span>
              <span>{{ v.result }}</span>
            </div>
            <div v-if="v.remark">
              <span class="card-label">{{ $lang('bpmn.handlingOpinions') }}: </span>
              <span>{{ v.remark }}</span>
            </div>
          </div>
        </div>
        <div v-if="card.errormsg">
          <span class="error-point"></span>
          <span class="card-label label-error error">{{ $lang('bpmn.errorMessage') }}: </span>
          <span class="error">{{ card.errormsg }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { isType, isInclude } from '../../utils';
export default {
  name: 'process-card',
  components: {},
  props: {
    postion: {
      type: Object,
    },
    card: {
      type: Object,
    },
  },
  data() {
    return {
      style: {
        width: 'auto',
        padding: '0',
      },
    };
  },
  computed: {},
  methods: {
    checkChildFlow() {
      if (isInclude(this.card, 'subproc') && this.card.subproc) {
        const odata = this.card.subproc.split(';');
        this.$emit('subproc', {
          processCode: odata[0],
          processVersion: odata[1],
          processId: odata[2],
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  position: absolute;
  width: auto;
  height: 240px;
  padding: 20px 0 20px 16px;
  overflow: hidden;
  .card-title {
    text-align: center;
    font-weight: 500;
    color: #262626;
    margin-bottom: 15px;
  }
  .card-body {
    width: 240px;
    height: 175px;
    overflow-y: auto;
    line-height: 21px;
    .content-button {
      width: 100%;
      text-align: center;
    }
    .card-label {
      // padding-left: 7px;
      display: inline-block;
      width: 74px;
      margin-right: 10px;
      text-align: right;
      color: #595959;
    }
    .card-item {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .label-error {
      width: 68px;
    }
    .error {
      color: #ff4949;
    }
    .error-point {
      display: inline-block;
      position: relative;
      background: #ff4949;
      top: -1px;
      left: 4px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      &:after {
        color: #ff4949;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid #ff4949;
        border-radius: 50%;
        animation: antStatusProcessing 1.2s ease-in-out infinite;
        content: '';
      }
    }
    @keyframes antStatusProcessing {
      0% {
        transform: scale(0.8);
        opacity: 0.5;
      }
      to {
        transform: scale(2.4);
        opacity: 0;
      }
    }
  }
}
</style>