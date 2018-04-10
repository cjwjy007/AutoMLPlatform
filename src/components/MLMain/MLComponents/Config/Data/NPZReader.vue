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

    <Spin fix v-if="!loading.loadingDataSetListFinished || !loading.loadingConfigFinished">
      <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import {getConfig, setConfig} from "@/apis/Graph/config.js"
  import {getAllDataSet} from '@/apis/DataSet/data.js'

  export default {
    mounted() {
      this.getDataSetList();
      this.getDataSet();
    },
    data: function () {
      return {
        dataSetList: [],
        curDataSet: '',
        loading: {
          loadingDataSetListFinished: false,
          loadingConfigFinished: false
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
      getDataSet() {
        let info = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
        };
        this.loading.loadingConfigFinished = false;
        getConfig(info).then(res => {
            this.curDataSet = res.data ? res.data.dataId : '';
            this.loading.loadingConfigFinished = true;
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
    }
  }
</script>
