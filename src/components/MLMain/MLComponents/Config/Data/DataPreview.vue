<template>
  <div>
    <Form :label-position="'left'" :label-width="80">
      <FormItem label="数据集选取">
        <Select v-model="curDataSet" filterable not-found-text="请上传数据" @on-change="changeDataSet">
          <Option v-for="(dataset,index) in dataSetList" :value="dataset.value" :key="index">
            {{ dataset.label }}
          </Option>
        </Select>
      </FormItem>
    </Form>
    <div v-if="isDataPicked">
      <Form :label-position="'left'" :label-width="80">
        <FormItem label="列信息">
          <Row>
            <Select v-model="columnName" filterable @on-change="getColumnMsg">
              <Option v-for="(column,index)  in columnNameList" :value="column.value" :key="index">
                {{ column.label }}
              </Option>
            </Select>
          </Row>
        </FormItem>
      </Form>
      <br>
      <Row v-show="columnMsg.data.length !== 0">
        <Table :columns="columnMsg.columns" :data="columnMsg.data"></Table>
      </Row>
    </div>
    <Spin fix v-if="!(loading.loadingColumnFinished && loading.loadingConfigFinished)">
      <Icon type="load-c" size=18    class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import {getColumns, getColumnDetail, setConfig, getConfig} from "@/apis/Graph/config.js"
  import {getAllDataSet} from '@/apis/DataSet/data.js'

  export default {
    mounted() {
      this.getDataSetList();
      this.getDataSet();
    },
    data: function () {
      return {
        isDataPicked: false,
        dataSetList: [],
        curDataSet: '',
        columnNameList: [],
        columnName: '',
        columnMsg: {columns: [], data: []},
        loading: {
          loadingColumnFinished: true,
          loadingConfigFinished: true,
          loadingDataSetListFinished: false
        }
      }
    },
    methods: {
      getDataSetList() {
        this.dataSetList = [];
        getAllDataSet().then(res => {
            for (let col of res.data) {
              let item = {
                value: col['id'],
                label: col['name'],
                desc: col['desc'],
              };
              this.dataSetList.push(item);
            }
            this.loading.loadingDataSetListFinished = true;
          }, err => {
            console.log(err);
          }
        )
      },
      getColumnNames() {
        this.columnNameList = [];
        this.loading.loadingColumnFinished = false;
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
      getColumnMsg(v) {
        this.loading.loadingColumnFinished = false;
        let nodeInfo = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
          column: v
        };
        getColumnDetail(nodeInfo).then(res => {
          this.columnMsg = {columns: [], data: []};
          this.columnMsg.columns = [{
            title: '属性',
            key: 'k'
          }, {
            title: '值',
            key: 'v'
          }];
          for (let k in res.data) {
            this.columnMsg.data.push({
              k: k,
              v: res.data[k]
            });
          }
          this.loading.loadingColumnFinished = true;
        }, err => {
          console.log(err);
        })
      },
      getDataSet() {
        let info = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
        };
        this.loading.loadingConfigFinished = false;
        getConfig(info).then(res => {
            this.isDataPicked = !!res.data;
            this.curDataSet = res.data ? res.data.dataId : '';
            this.loading.loadingConfigFinished = true;
            if (this.isDataPicked) {
              this.getColumnNames();
            }
          }, err => {
            console.log(err);
          }
        )
      },
      changeDataSet(data) {
        let info = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
          config: {'dataId': this.curDataSet}
        };
        this.loading.loadingConfigFinished = false;
        setConfig(info).then(res => {
          this.getDataSet();
          this.loading.loadingConfigFinished = true;
        })
      }
    },
  }
</script>

<style>
  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
