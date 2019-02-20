<template>
  <div>
    <Transfer
      :data="columnNameList"
      :target-keys="filterColumn"
      :render-format="fmt"
      @on-change="selectColumns"
      :titles="titles"
      :filterable="true">
    </Transfer>
    <Spin fix v-if="!(loading.loadingColumnFinished && loading.loadingConfigFinished)">
      <Icon type="load-c" size=18   class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import {getColumns, setConfig, getConfig} from "@/apis/Graph/config.js"
  import * as utils from '../../../../../utils/utils'

  export default {
    mounted() {
      this.getColumnNames();
      this.getSelectedColumns();
    },
    data: function () {
      return {
        columnNameList: [],
        filterColumn: [],
        titles: ['训练列', '过滤列'],
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
          for (let idx in res.data) {
            let item = {
              key: idx,
              label: res.data[idx]
            };
            this.columnNameList.push(item);
          }
          this.loading.loadingColumnFinished = true;
        }, err => {
          console.log(err);
        })
      },
      fmt(item) {
        return item.label
      },
      selectColumns(newTargetKeys) {
        this.filterColumn = newTargetKeys;
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
          config: {'columns': newTargetKeys.map(item => this.columnNameList[item])}
        };
        setConfig(data);
      },
      getSelectedColumns() {
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
        };
        getConfig(data).then(res => {
            this.filterColumn = !utils.isEmpty(res.data) ? !utils.isEmpty(res.data.columns) ? res.data.columns.map(item => item.key) : [] : [];
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

</style>
