<template>
  <div>
    <Form :model="search" inline class="header-form">
      <FormItem label="搜索数据集：" :label-width="100">
        <Input v-model="search.input" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSearch()">搜索数据集</Button>
      </FormItem>
      <FormItem style="float:right">
        <Button type="primary" @click="$router.push('uploaddata')">上传数据</Button>
      </FormItem>
    </Form>
    <Table :data="tableData" :columns="tableColumns" stripe></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="dataCount" :current="1" @on-change="changePage" show-total></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import {countDataSet, getDataSet, deleteDataSet} from '@/apis/DataSet/data.js'

  export default {
    mounted() {
      this.getDataCount();
      this.changePage(1);
    },
    data() {
      return {
        search: {
          input: ''
        },
        dataCount: 0,
        tableData: [],
        tableColumns: [
          {
            title: '数据集名',
            key: 'name'
          },
          {
            title: '描述',
            key: 'desc',
          },
          {
            title: '创建时间',
            key: 'create_time',
            render: (h, params) => {
              return h('div', params.row.create_time);
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 170,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ]
      }
    },
    methods: {
      getDataCount() {
        countDataSet().then(res => {
          this.dataCount = res.data;
        }, err => {

        })
      },
      changePage(page) {
        getDataSet({page: page}).then(res => {
          this.tableData = res.data;
        }, err => {
          this.tableData = []
        });
      },
      show(index) {

      },
      remove(index) {
        let proName = this.tableData[index].name;
        deleteDataSet({id: this.tableData[index].id}).then(res => {
            this.$Message.success({
              content: `项目${proName}删除成功`,
              duration: 7,
              closable: true
            });
            this.tableData.splice(index, 1);
          }, err => {
            this.$Message.error({
              content: `项目${proName}删除失败`,
              duration: 7,
              closable: true
            });
          }
        )
      },
      handleSearch() {

      }
    }
  }
</script>

<style scoped>
  @import "Data.css";
</style>
