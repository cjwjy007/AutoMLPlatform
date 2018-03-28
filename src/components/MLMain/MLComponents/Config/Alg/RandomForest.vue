<template>
  <div>
    <Form :model="modelParam" label-position="left" :label-width="100">
      <FormItem label="预测列">
        <Row>
          <Select v-model="columnY" :not-found-text="'无数据源'" @on-change="configChanged" clearable filterable>
            <Option v-for="(column,index)  in columnNameList" :value="column.value" :key="index">
              {{ column.label }}
            </Option>
          </Select>
        </Row>
      </FormItem>
      <FormItem label="n_estimators">
        <Input v-model="modelParam.n_estimators" @on-blur="configChanged"></Input>
      </FormItem>
      <FormItem label="max_features">
        <Input v-model="modelParam.max_features" @on-blur="configChanged"></Input>
      </FormItem>
      <FormItem label="criterion">
        <Input v-model="modelParam.criterion" @on-blur="configChanged"></Input>
      </FormItem>
    </Form>
    <Spin fix v-if="!loading.loadingConfigFinished || !loading.loadingColumnFinished">
      <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import {getColumns,setConfig, getConfig} from "@/apis/Graph/config.js"

  export default {
    mounted() {
      this.getColumnNames();
      this.getParametersAndColumnY();
    },
    data: function () {
      return {
        columnNameList: [],
        columnY: '',
        modelParam: {
          n_estimators: '10',
          max_features: 'auto',
          criterion: 'gini'
        },
        loading: {
          loadingColumnFinished: false,
          loadingConfigFinished: false
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
      configChanged() {
        let conf = {
          y: this.columnY,
          param: this.modelParam
        };
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
          config: conf
        };
        setConfig(data);
      },
      getParametersAndColumnY() {
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
        };
        getConfig(data).then(res => {
            if (res.data) {
              this.columnY = res.data.y;
              this.modelParam = res.data.param;
            }
            this.loading.loadingConfigFinished = true;
          }, err => {
            console.log(err);
          }
        )
      }
    },
  }
</script>

<style>
  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
