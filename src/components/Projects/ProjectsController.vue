<template>
  <div>
    <Form :model="search" inline class="header-form">
      <FormItem label="搜索项目：" :label-width="80">
        <Input v-model="search.input" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSearch()">搜索项目</Button>
      </FormItem>
      <FormItem style="float:right">
        <Button type="primary" @click="createModelVisible = true">创建新项目</Button>
      </FormItem>
    </Form>
    <Table :data="tableData" :columns="tableColumns" stripe></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="dataCount" :current="1" @on-change="changePage" show-total></Page>
      </div>
    </div>
    <Modal
      v-model="createModelVisible"
      title="创建新项目"
      @on-ok="createProject">
      <Form :model="createForm" :label-width="80">
        <FormItem label="项目名">
          <Input v-model="createForm.projectName" placeholder="输入项目名称"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import {countProject, getProject, addProject, deleteProject} from '@/apis/Project/project.js'

  export default {
    mounted() {
      this.getDataCount();
      this.changePage(1);
    },
    data() {
      return {
        createModelVisible: false,
        createForm: {
          'projectName': ''
        },
        search: {
          input: ''
        },
        dataCount: 0,
        tableData: [],
        tableColumns: [
          {
            title: '项目名',
            key: 'project_name'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              const row = params.row;
              const color = row.status === 0 ? 'blue' : row.status === 1 ? 'yellow' : row.status === 2 ? 'green' : 'red';
              const text = row.status === 0 ? '未运行' : row.status === 1 ? '运行中' : row.status === 2 ? '成功' : '失败';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          },
          {
            title: '创建时间',
            key: 'create_time',
            render: (h, params) => {
              return h('div', params.row.create_time);
            }
          },
          {
            title: '最后运行时间',
            key: 'update_time',
            render: (h, params) => {
              return h('div', params.row.update_time);
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
                }, '编辑'),
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
        countProject().then(res => {
          this.dataCount = res.data;
        }, err => {

        })
      },
      changePage(page) {
        getProject({page: page}).then(res => {
          this.tableData = res.data;
        }, err => {
          this.tableData = []
        });
      },
      show(index) {
        this.$store.dispatch('graph/setCurrentGraph', {
          'id': this.tableData[index].graph_id
        });
        this.$router.push({ name: 'project', params: { id: this.$store.state.graph.curGraph.id }});
      },
      remove(index) {
        let proName = this.tableData[index].project_name;
        deleteProject({id: this.tableData[index].id}).then(res => {
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
      createProject() {
        let proName = this.createForm.projectName;
        addProject({projectName: this.createForm.projectName}).then(res => {
          this.$Message.success({
            content: `项目${proName}创建成功`,
            duration: 7,
            closable: true
          });
          this.createForm.projectName = '';

          //jump to last page
          this.dataCount++;
          this.changePage(Math.ceil(this.dataCount / 10));
        }, err => {
          this.$Message.error({
            content: `项目${proName}创建失败`,
            duration: 7,
            closable: true
          });
        })
      },
      handleSearch() {

      }
    }
  }
</script>

<style scoped>
  @import "ProjectsController.css";
</style>
