<template>
  <div>
    <Form label-position="top">
      <FormItem label="数据拼接策略">
        <Select v-model="combinationStrategy" @on-change="configChanged">
          <Option value="key">按照主键拼接</Option>
          <Option value="column">横向拼接（添加新列）</Option>
          <Option value="row">纵向拼接（添加新行）</Option>
        </Select>
      </FormItem>
      <FormItem v-if="combinationStrategy === 'key'">
        <span>拼接主表</span>
        <Select v-model="combinationMainTable" @on-change="configChanged" :not-found-text="'无数据源'">
          <Option v-for="(column,index)  in combinationMainTableList" :value="column.value" :key="index">
            {{ column.label }}
          </Option>
        </Select>
        <span>拼接键</span>
        <Input v-model="combinationKey" placeholder="请输入拼接主键" @on-blur="configChanged"></Input>
      </FormItem>
    </Form>
    <Spin fix v-if="!loading.loadingConfigFinished">
      <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import {getColumns, getConfig, getFatherDataNodeNames, setConfig} from "@/apis/Graph/config.js"

  export default {
    mounted() {
      this.getDataNames();
      this.getInputStrategy();
    },
    data: function () {
      return {
        combinationStrategy: 'key',
        combinationMainTable: '',
        combinationKey: '',
        combinationMainTableList: [],
        loading: {
          loadingColumnFinished: false,
          loadingConfigFinished: false,
        }
      }
    },
    methods: {
      getDataNames() {
        let nodeInfo = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id
        };
        getFatherDataNodeNames(nodeInfo).then(res => {
          this.combinationMainTableList = [];
          for (let col of res.data) {
            let item = {
              value: col['id'],
              label: col['name']
            };
            this.combinationMainTableList.push(item);
          }
          this.loading.loadingColumnFinished = true;
        }, err => {
          console.log(err);
        })
      },
      getInputStrategy() {
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
        };
        getConfig(data).then(res => {
            this.combinationStrategy = res.data ? res.data['strategy'] : 'key';
            this.combinationMainTable = res.data ? res.data['maintable'] : '';
            this.combinationKey = res.data ? res.data['key'] : '';
            this.loading.loadingConfigFinished = true;
          }, err => {
            console.log(err);
          }
        )
      },
      configChanged() {
        console.log(this.combinationMainTableList);
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
          config: {
            strategy: this.combinationStrategy,
            maintable: this.combinationMainTable,
            key: this.combinationKey
          }
        };
        setConfig(data);
      }
    },
  }
</script>

<style>

</style>
