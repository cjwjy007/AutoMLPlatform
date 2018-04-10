<template>
  <div>
    <div :id="GraphId" @dragover.prevent @drop="drawNode"></div>
    <div class="bottom-bar">
      <Button type="primary" :disabled="isRunTaskDisabled" long @click="runTask">运行<span
        v-if="isRunTaskDisabled">中</span></Button>
    </div>

    <context-menu id="context-menu-node" @ctx-open="onCtxOpen" ref="ctxMenuNode">
      <li class="ctx-header">{{rightClickEvent ? rightClickEvent.title : null}}</li>
      <li class="ctx-divider"></li>
      <li class="ctx-item" @click="getNodeResult">查看结点运行结果</li>
      <li class="ctx-item" @click="downloadNodeResult">下载运行结果</li>
      <li class="ctx-divider"></li>
      <li class="ctx-item" :disabled="isRunTaskDisabled" @click="runFromNode">从该结点运行</li>
      <li class="ctx-item" @click="removeItem">删除</li>
    </context-menu>

    <context-menu id="context-menu-edge" @ctx-open="onCtxOpen" ref="ctxMenuEdge">
      <li class="ctx-header">{{rightClickEvent ? rightClickEvent.title : null}}</li>
      <li class="ctx-divider"></li>
      <li class="ctx-item" @click="removeItem">删除</li>
    </context-menu>

    <Modal
      :width="modalSize.width + 70"
      v-model="isNodeOutInfoShow"
      title="结点输出csv前50行">
      <Table size="small" :width="modalSize.width" :height="modalSize.height" stripe
             no-data-text="数据正在努力加载中..."
             :columns="tableInfo.columns"
             :data="tableInfo.data"></Table>
    </Modal>
  </div>
</template>

<script>
  import {
    deleteNode,
    downloadNodeOutput,
    getNodeOutputInfo,
    getNodesStatus,
    loadGraph,
    saveGraph
  } from '@/apis/Graph/graph.js'
  import {runTask, runTaskFromNode} from '@/apis/Graph/task.js'
  import {getProjectStatus} from '@/apis/Project/project.js'
  import G6MLClass from './G6MLClass'
  import contextMenu from 'vue-context-menu'

  export default {
    mounted() {
      this.initG6();
      this.initData();
      this.initNet();
      this.initEvent();
    },
    beforeDestroy() {
      clearInterval(this.statusInterval)
    },
    data: function () {
      return {
        GraphId: this.getGraphId(),
        G6Class: null,
        netData: {
          nodes: null,
          edges: null
        },
        nodeOutInfo: {
          columns: [],
          data: []
        },
        tableInfo: {
          columns: [],
          data: []
        },
        modalSize: {
          width: 0,
          height: 0,
        },
        isNodeOutInfoShow: false,
        rightClickEvent: null,
        statusInterval: null,
        isRunTaskDisabled: false
      }
    },
    methods: {
      getGraphId() {
        this.$store.dispatch('graph/setCurrentGraph', {
          'id': this.$route.params.id
        });
        return this.$store.state.graph.curGraph.id;
      },
      onCtxOpen(locals) {
        this.rightClickEvent.title = this.rightClickEvent.itemType === 'node' ? '结点' : '边';
//        console.log(this.rightClickEvent);
      },
      initG6() {
        this.G6Class = new G6MLClass(this.GraphId, document.documentElement.clientHeight * 0.78);
      },
      initNet() {
        this.G6Class.renderGraph(this.netData);
      },
      initData() {
        loadGraph({id: this.GraphId}).then(res => {
          this.G6Class.loadGraphData(res.data);
          this.getDataFromGraph();
          this.initInterval();
        }, err => {
          console.log(err);
        });
      },
      initEvent() {
        //right click event
        this.G6Class.getNet().on('contextmenu', (ev) => {
          ev.domEvent.preventDefault();
          this.rightClickEvent = ev;
          if (ev.itemType === "node") {
            this.$refs.ctxMenuNode.open();
          } else if (ev.itemType === "edge") {
            this.$refs.ctxMenuEdge.open();
          }
        });
        //item update event
        this.G6Class.getNet().on('itemupdate', (ev) => {
          this.saveUpdate();
        });
        //item click event
        this.G6Class.getNet().on('itemclick', ev => {
          if (ev.itemType === 'node') {
            let selComp = {};
            selComp.id = ev.item.get('model').id;
            selComp.desc = ev.item.get('model').desc;
            selComp.label = ev.item.get('model').label;
            selComp.type = ev.item.get('model').type;
            this.$store.dispatch('graph/setCurrentComp', selComp);
            this.$emit('select');
          }
        });
      },
      drawNode(e) {
        e.preventDefault();
        this.G6Class.drawNode(e);
        this.saveUpdate();
      },
      getDataFromGraph() {
        this.netData.nodes = this.G6Class.getGraphData().source.nodes;
        this.netData.edges = this.G6Class.getGraphData().source.edges;
      },
      removeItem() {
        if (this.rightClickEvent.item.getModel().shape === 'MLNode') {
          let nodeId = this.rightClickEvent.item.getModel() ? this.rightClickEvent.item.getModel().id : null;
          deleteNode({'graph_id': this.GraphId, 'node_id': nodeId}).then(res => {
              this.G6Class.removeItem(this.rightClickEvent.item);
              this.saveUpdate();
            }, err => {
              console.log(err);
            }
          );
        } else if (this.rightClickEvent.item.getModel().shape === 'smoothArrow') {
          this.G6Class.removeItem(this.rightClickEvent.item);
          this.saveUpdate();
        }
      },
      saveUpdate() {
        saveGraph({id: this.GraphId, gData: this.G6Class.getGraphData()});
      },
      initInterval() {
        setTimeout(() => {
          getProjectStatus({id: this.GraphId}).then(res => {
            if (res.data === 1 && !this.statusInterval) {
              this.statusInterval = setInterval(() => {
                this.nodeStatusColorChange()
              }, 1000)
            }
          });
        }, 500);
      },
      nodeStatusColorChange() {
        this.isRunTaskDisabled = true;
        getNodesStatus({id: this.GraphId}).then(res => {
          let stopFlag = true;
          for (let node of res.data) {
            let node_in_G6 = this.G6Class.findData(node['node_id']);
            if (node_in_G6['status'] !== node['node_status']) {
              this.G6Class.updateData(node['node_id'], {
                status: node['node_status']
              });
            }
            if (node['node_status'] === 0 || node['node_status'] === 1) {
              stopFlag = false;
            }
          }
          if (stopFlag) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
            this.isRunTaskDisabled = false;
          }
        })
      },
      getNodeResult() {
        this.isNodeOutInfoShow = true;
        this.tableInfo = {
          columns: [],
          data: []
        };
        this.nodeOutInfo = {
          columns: [],
          data: []
        };
        let nodeId = this.rightClickEvent.item.getModel() ? this.rightClickEvent.item.getModel().id : null;
        getNodeOutputInfo({graphId: this.GraphId, nodeId: nodeId}).then(res => {
          let json = JSON.parse(res.data);
          let size = {
            width: 0,
            height: 0
          };
          for (let attr in json) {
            this.nodeOutInfo.columns.push({
              title: attr,
              key: attr,
              width: 130,
            });
            size.width = size.width < 700 ? size.width + 131 : size.width;
            for (let id in json[attr]) {
              if (this.nodeOutInfo.data[parseInt(id)] === undefined) {
                this.nodeOutInfo.data[parseInt(id)] = {}
              }
              size.height = size.height < 500 ? size.height + 50 : size.height;
              this.nodeOutInfo.data[parseInt(id)][attr] = json[attr][id];
            }
          }
          this.tableInfo = this.nodeOutInfo;
          this.modalSize = size;
          //todo 第一次渲染表格高度出错的暂时解决方案
          setTimeout(() => {
            this.modalSize.height += 1;
          })
        });
      },
      downloadNodeResult() {
        let nodeId = this.rightClickEvent.item.getModel() ? this.rightClickEvent.item.getModel().id : null;
        downloadNodeOutput({graphId: this.GraphId, nodeId: nodeId});
      },
      runFromNode() {
        let nodeId = this.rightClickEvent.item.getModel() ? this.rightClickEvent.item.getModel().id : null;
        runTaskFromNode({graphId: this.GraphId, nodeId: nodeId}).then(() => {
          this.initInterval();
        });
      },
      runTask() {
        this.isRunTaskDisabled = true;
        runTask({id: this.GraphId}).then(() => {
          this.initInterval();
        });
      }
    },
    components: {contextMenu}
  }
</script>

<style scoped>
  #canvas {
    background-color: white;
  }

  .bottom-bar {
    position: absolute;
    bottom: 0;
    width: 66%;
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 10px 20px;
    background-color: #ffffff;
  }
</style>
