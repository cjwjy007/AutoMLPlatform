<template>
  <div>
    <Steps :current="curStep" size="small">
      <Step title="模型层"></Step>
      <Step title="编译"></Step>
      <Step title="训练"></Step>
    </Steps>
    <br>
    <div id="modelLayerStruct" v-if="curStep === 0">
      <h3>
        模型层结构
      </h3>
      <div class="layer-draggable-list">
        <ul>
          <draggable v-model="layerArr" :options="dragOptions" @start="isDragging=true" @end="isDragging=false">
            <li v-for="(item, index) in layerArr" :key="index" class="notwrap">
              <span @click="editLayer(index)">{{item.name[1]}}</span>
              <a class="ivu-alert-close" @click="deleteLayer(index)"><i
                class="ivu-icon ivu-icon-ios-close-empty"></i></a>
            </li>
          </draggable>
        </ul>
      </div>
      <Button type="primary" @click="addLayer" long>添加新层</Button>
    </div>
    <div id="compileParams" v-if="curStep === 1">
      <h3>
        编译参数
      </h3>
      <Form :model="compileParams" :label-width="70">
        <Form-item label="loss">
          <Select v-model="compileParams.loss" @on-change='setSeqConfig'>
            <Option value="categorical_crossentropy">categorical_crossentropy</Option>
            <Option value="binary_crossentropy">binary_crossentropy</Option>
          </Select>
        </Form-item>
        <Form-item label="optimizer">
          <Select v-model="compileParams.optimizer" @on-change='setSeqConfig'>
            <Option value="SGD">SGD</Option>
            <Option value="RMSprop">RMSprop</Option>
            <Option value="Adagrad">Adagrad</Option>
            <Option value="Adadelta">Adadelta</Option>
            <Option value="Adam">Adam</Option>
          </Select>
        </Form-item>
        <Form-item label="metrics">
          <Input v-model="compileParams.metrics" @on-blur="setSeqConfig"></Input>
        </Form-item>
      </Form>
    </div>
    <div id="trainParams" v-if="curStep === 2">
      <h3>
        训练参数
      </h3>
      <Form :model="trainParams" :label-width="50">
        <Form-item label="batch_size">
          <Input v-model="trainParams.batch_size" @on-blur="setSeqConfig"></Input>
        </Form-item>
        <Form-item label="epochs">
          <Input v-model="trainParams.epochs" @on-blur="setSeqConfig"></Input>
        </Form-item>
      </Form>
    </div>

    <div style="margin-top:20px">
      <Row :gutter="16">
        <Col span="12">
          <Button type="primary" long @click="curStep > 0 && curStep--">
            上一步
          </Button>
        </Col>
        <Col span="12">
          <Button type="primary" long @click="curStep < 2 && curStep++">
            下一步
          </Button>
        </Col>
      </Row>
    </div>

    <Modal
      v-model="isLayerModalShow"
      title="深度学习层"
      @on-ok="confirmLayerChange">
      <Form :model="curLayer" :label-width="100">
        <Form-item label="层名">
          <Cascader :data="dpLayerName" v-model="curLayer.name" trigger="hover"></Cascader>
        </Form-item>
        <!--InputDimension-->
        <div v-if="layerArr && layerArr.length === 0 || curLayer.idx === 0">
          <Form-item>
            <div slot="label">输入维度
              <Tooltip>
                <div slot="content" style="white-space: normal;">当使用该层作为第一层时，要指定该层输入的维度</div>
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Input v-model="curLayer.input_shape"></Input>
          </Form-item>
        </div>
        <!--Dense-->
        <div v-if="curLayer.name && curLayer.name.length>0 && curLayer.name[1]  === 'Dense'">
          <Form-item>
            <div slot="label">层输出维度
              <Tooltip content="该层的输出维度。">
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Input v-model="curLayer.units"></Input>
          </Form-item>
          <Form-item>
            <div slot="label">激活函数
              <Tooltip content="激活函数，为预定义的激活函数名。">
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Select v-model="curLayer.activation">
              <Option value="relu">relu</Option>
              <Option value="softmax">softmax</Option>
              <Option value="sigmoid">sigmoid</Option>
            </Select>
          </Form-item>
        </div>
        <!--Activation-->
        <div v-if="curLayer.name && curLayer.name.length>0 && curLayer.name[1]  === 'Activation'">
          <Form-item>
            <div slot="label">激活函数
              <Tooltip content="激活函数，为预定义的激活函数名。">
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Select v-model="curLayer.activation">
              <Option value="relu">relu</Option>
              <Option value="softmax">softmax</Option>
              <Option value="sigmoid">sigmoid</Option>
            </Select>
          </Form-item>
        </div>
        <!--Dropout-->
        <div v-if="curLayer.name && curLayer.name.length>0 && curLayer.name[1]  === 'Dropout'">
          <Form-item>
            <div slot="label">神经元断开概率
              <Tooltip content="0~1的浮点数，控制需要断开的神经元的比例。">
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Input v-model="curLayer.rate"></Input>
          </Form-item>
        </div>
        <!--Flatten-->
        <div v-if="curLayer.name && curLayer.name.length>0 && curLayer.name[1]  === 'Flatten'">
        </div>
        <!--Conv2D-->
        <div v-if="curLayer.name && curLayer.name.length>0 && curLayer.name[1]  === 'Conv2D'">
          <Form-item>
            <div slot="label">层输出维度
              <Tooltip content="卷积核的数目（即输出的维度）">
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Input v-model="curLayer.filters"></Input>
          </Form-item>
          <Form-item>
            <div slot="label">卷积核宽与长
              <Tooltip>
                <div slot="content" style="white-space: normal;">
                  单个整数或由两个整数构成的list/tuple，卷积核的宽度和长度。如为单个整数，则表示在各个空间维度的相同长度。
                </div>
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Input v-model="curLayer.kernel_size"></Input>
          </Form-item>
          <Form-item>
            <div slot="label">激活函数
              <Tooltip content="激活函数，为预定义的激活函数名。">
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Select v-model="curLayer.activation">
              <Option value="relu">relu</Option>
              <Option value="softmax">softmax</Option>
              <Option value="sigmoid">sigmoid</Option>
            </Select>
          </Form-item>
        </div>
        <!--MaxPooling2D-->
        <div v-if="curLayer.name && curLayer.name.length>0 && curLayer.name[1]  === 'MaxPooling2D'">
          <Form-item>
            <div slot="label">池大小
              <Tooltip>
                <div slot="content" style="white-space: normal;">
                  单个整数或由两个整数构成的list/tuple，卷积核的宽度和长度。如为单个整数，则表示在各个空间维度的相同长度。
                </div>
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Input v-model="curLayer.pool_size"></Input>
          </Form-item>
          <Form-item>
            <div slot="label">激活函数
              <Tooltip content="激活函数，为预定义的激活函数名。">
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </div>
            <Select v-model="curLayer.activation">
              <Option value="relu">relu</Option>
              <Option value="softmax">softmax</Option>
              <Option value="sigmoid">sigmoid</Option>
            </Select>
          </Form-item>
        </div>
      </Form>
    </Modal>

    <Spin fix v-if="!loading.loadingConfigFinished">
      <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import * as utils from '../../../../../utils/utils'
  import {getConfig, setConfig} from "@/apis/Graph/config.js"

  export default {
    created() {
      this.resetCurLayer();
    },
    mounted() {
      this.getSeqConfig();
    },
    components: {
      draggable,
    },
    data: function () {
      return {
        curStep: 0,
        isLayerModalShow: false,
        isDragging: false,
        loading: {
          loadingConfigFinished: false,
        },
        dragOptions: {
          group: 'layer',
          ghostClass: 'placeholder-style',
          fallbackClass: 'iview-admin-cloned-item'
        },
        layerArr: [],
        compileParams: {
          loss: '',
          optimizer: '',
          metrics: 'accuracy'
        },
        trainParams: {
          batch_size: '',
          epochs: ''
        },
        dpLayerName: [{
          value: 'Core',
          label: '常用层',
          children: [
            {
              value: 'Dense',
              label: 'Dense'
            },
            {
              value: 'Activation',
              label: 'Activation'
            },
            {
              value: 'Dropout',
              label: 'Dropout'
            },
            {
              value: 'Flatten',
              label: 'Flatten'
            }
          ]
        }, {
          value: 'Convolutional',
          label: '卷积层',
          children: [
            {
              value: 'Conv2D',
              label: 'Conv2D'
            }
          ],
        }, {
          value: 'Pooling',
          label: '池化层',
          children: [
            {
              value: 'MaxPooling2D',
              label: 'MaxPooling2D'
            }
          ],
        }],
        curLayer: null
      }
    },
    methods: {
      resetCurLayer() {
        this.curLayer = {
          idx: -1,
          name: []
        }
      },
      addLayer() {
        this.isLayerModalShow = true;
        this.resetCurLayer();
      },
      editLayer(index) {
        this.isLayerModalShow = true;
        this.curLayer = this.layerArr[index];
        this.curLayer.idx = index;
      },
      deleteLayer(index) {
        this.layerArr.splice(index, 1)
      },
      confirmLayerChange() {
        // empty input
        if (this.curLayer.name.length === 0) {
          this.$Message.error('输入层为空');
          this.curLayer.idx !== -1 && this.deleteLayer(this.curLayer.idx);
        } else {
          if (this.curLayer.idx === -1) {
            // new layer
            this.layerArr.push(this.curLayer);
          }
        }
        this.resetCurLayer();
        this.setSeqConfig();
      },
      getSeqConfig() {
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
        };
        getConfig(data).then(res => {
            if (!utils.isEmpty(res.data)) {
              this.layerArr = res.data.layerStruct;
              this.compileParams = res.data.compileParams;
              this.trainParams = res.data.trainParams;
            }
            this.loading.loadingConfigFinished = true;
          }, err => {
            console.log(err);
          }
        )
      },
      setSeqConfig() {
        let conf = {
          layerStruct: this.layerArr,
          compileParams: this.compileParams,
          trainParams: this.trainParams
        };
        let data = {
          graphId: this.$store.state.graph.curGraph.id,
          nodeId: this.$store.state.graph.curComp.id,
          config: conf
        };
        setConfig(data);
      }
    }
  }
</script>


<style>
  .layer-draggable-list {
    height: 250px;
    margin: 10px 0;
  }

  .layer-draggable-list ul {
    height: 100%;
  }

  .layer-draggable-list li {
    padding: 6px;
    border: 1px solid #e7ebee;
    border-radius: 3px;
    margin-bottom: 5px;
    cursor: pointer;
    position: relative;
    transition: all .2s;
  }

  .layer-draggable-list li:hover {
    color: #87b4ee;
    border-color: #87b4ee;
    transition: all .2s;
  }

  .layer-draggable-list li:hover {
    display: block;
  }

  .layer-draggable-list {
    overflow: auto
  }

  .placeholder-style {
    display: block !important;
    color: transparent;
    border-style: dashed !important;
  }

  .notwrap {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
