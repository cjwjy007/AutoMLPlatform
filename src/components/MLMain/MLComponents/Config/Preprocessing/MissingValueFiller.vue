<template>
  <div>
    <Form :model="inputStrategy" label-position="top">
      <FormItem label="String型填充策略">
        <Select v-model="inputStrategy.string" @on-change="inputChanged">
          <Option value="nothing">不作处理</Option>
          <Option value="nullTag">填入Null标签</Option>
        </Select>
      </FormItem>
      <FormItem label="Number型填充策略">
        <Select v-model="inputStrategy.number" @on-change="inputChanged">
          <Option value="nothing">不作处理</Option>
          <Option value="mean">填入平均值</Option>
          <Option value="max">填入最大值</Option>
          <Option value="min">填入最小值</Option>
        </Select>
      </FormItem>
    </Form>
    <Spin fix v-if="!loading.loadingConfigFinished">
      <Icon type="load-c" size=18   class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import {setConfig, getConfig} from "@/apis/Graph/config.js"

  export default {
    mounted() {
      this.getInputStrategy();
    },
    data: function () {
      return {
        inputStrategy: {
          string: 'nothing',
          number: 'nothing'
        },
        loading: {
          loadingConfigFinished: false,
        }
      }
    },
    methods: {
      getInputStrategy() {
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
        };
        getConfig(data).then(res => {
            this.inputStrategy.string = res.data ? res.data.string ? res.data.string : 'nothing' : 'nothing';
            this.inputStrategy.number = res.data ? res.data.number ? res.data.number : 'nothing' : 'nothing';
            this.loading.loadingConfigFinished = true;
          }, err => {
            console.log(err);
          }
        )
      },
      inputChanged() {
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
          config: this.inputStrategy
        };
        setConfig(data);
      }
    },
  }
</script>

<style>

</style>
