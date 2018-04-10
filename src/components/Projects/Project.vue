<template>
  <div>
    <Row :gutter="16">
      <Col span="5">
      <div class="comp-list" ref="compList">
        <comp-list></comp-list>
      </div>
      </Col>
      <Col span="19">
      <graph @select="selectComp"></graph>
      </Col>
      <transition name="fade" transition-mode="out-in">
        <comp-config v-if="configVisible" :isVisible="configVisible" @onCancel="onCancel">
          <div slot="header">{{curComp.label}}</div>
          <div slot="body">
            <!--<keep-alive>-->
            <component :is="configComponentId"></component>
            <!--</keep-alive>-->
          </div>
        </comp-config>
      </transition>
    </Row>
  </div>
</template>

<script>
  import ConfigTable from "../MLMain/MLComponents/ConfigTable"
  import CompList from "../MLMain/MLComponents/CompList.vue"
  import Graph from "../MLMain/MLGragh/Graph.vue"
  import CompConfig from "../MLMain/MLComponents/CompConfig.vue"

  export default {
    mounted() {
      this.$refs.compList.style.height = document.documentElement.clientHeight * 0.78 + 'px';
    },
    data: function () {
      return {
        curComp: null,
        configComponentId: null,
        configVisible: false,
      }
    },
    methods: {
      selectComp() {
        this.configVisible = false;
        this.curComp = this.$store.state.graph.curComp;
        if (this.curComp.desc === 'DataInput') {
          this.configComponentId = 'DataPreview';
        } else if (this.curComp.desc === 'NPZReader') {
          this.configComponentId = 'NPZReader';
        } else {
          this.configComponentId = this.curComp.desc;
        }
        setTimeout(() => {
          this.configVisible = true;
        });
      },
      onCancel() {
        this.configVisible = false;
      }
    },
    components: {
      "comp-list": CompList,
      "graph": Graph,
      "comp-config": CompConfig,
      "DataPreview": ConfigTable["DataPreview"],
      "NPZReader": ConfigTable["NPZReader"],
      "DataCombination": ConfigTable["DataCombination"],
      "DataSplit": ConfigTable["DataSplit"],
      "MissingValueFiller": ConfigTable["MissingValueFiller"],
      "OneHotEncoder": ConfigTable["OneHotEncoder"],
      "UnconcernedFilter": ConfigTable["UnconcernedFilter"],
      "Prediction": ConfigTable["Prediction"],
      "RandomForest": ConfigTable["RandomForest"],
      "LogisticRegression": ConfigTable["LogisticRegression"],
      "Sequential": ConfigTable["Sequential"]
    }
  }
</script>

<style scoped>
  @import "Project.less";
</style>
