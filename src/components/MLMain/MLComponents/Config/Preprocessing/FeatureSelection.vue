<template>
  <div>
    <Form label-position="top">
      <FormItem label="特征提取策略">
        <Select v-model="fsStrategy" @on-change="configChanged">
          <Option value="model">模型选取</Option>
          <Option value="auc_roc">AUC_ROC曲线选取</Option>
        </Select>
      </FormItem>
      <FormItem label="预测列">
        <Select v-model="fsColumn" @on-change="configChanged" :not-found-text="'无数据源'">
          <Option v-for="(column,index)  in columnNameList" :value="column.value" :key="index">
            {{ column.label }}
          </Option>
        </Select>
      </FormItem>
    </Form>
    <Spin fix v-if="!loading.loadingConfigFinished">
      <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import {getColumns,setConfig, getConfig} from "@/apis/Graph/config.js"
  import * as utils from '../../../../../utils/utils'

  export default {
    mounted() {
      this.getColumnNames();
      this.getInputStrategy();
    },
    data: function () {
      return {
        fsStrategy: 'model',
        columnNameList:[],
        fsColumn:'',
        loading: {
          loadingColumnFinished: false,
          loadingConfigFinished: false,
        }
      }
    },
    methods: {
      getColumnNames() {
        let nodeInfo = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id
        };
        getColumns(nodeInfo).then(res => {
          for (let col of res.data) {
            let item = {
              value: col,
              label: col
            };
            this.columnNameList.push(item);
          }
          this.loading.loadingColumnFinished = true;
        }, err => {
          console.log(err);
        })
      },
      getInputStrategy(){
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
        };
        getConfig(data).then(res => {
            this.fsStrategy = res.data ? res.data['strategy'] : 'model';
            this.fsColumn = res.data ? res.data['column'] ? res.data['column'] : '' : '';
            this.loading.loadingConfigFinished = true;
          }, err => {
            console.log(err);
          }
        )
      },
      configChanged(){
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
          config: {
            strategy:this.fsStrategy,
            column:this.fsColumn
          }
        };
        setConfig(data);
      }
    },
  }
</script>

<style>

</style>
