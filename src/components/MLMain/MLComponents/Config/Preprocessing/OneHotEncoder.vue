<template>
  <div>
    <Form label-position="top">
      <FormItem label="OneHot编码策略">
        <Select v-model="onehotStrategy" @on-change="configChanged">
          <Option value="columns">选择特定列</Option>
          <Option value="auto">自动处理</Option>
        </Select>
      </FormItem>
      <FormItem v-if="onehotStrategy === 'columns'">
        <Select v-model="onehotColumns" multiple filterable @on-change="configChanged" :not-found-text="'无数据源'">
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
  export default {
    mounted() {
      this.getColumnNames();
      this.getInputStrategy();
    },
    data: function () {
      return {
        onehotStrategy: 'columns',
        columnNameList:[],
        onehotColumns:[],
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
            this.onehotStrategy = res.data ? res.data['strategy'] : 'columns';
            this.onehotColumns = res.data ? res.data['columns'] : [];
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
            strategy:this.onehotStrategy,
            columns:this.onehotColumns
          }
        };
        setConfig(data);
      }
    },
  }
</script>

<style>

</style>
