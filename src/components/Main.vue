<template>
  <div class="layout">
    <Row type="flex">
      <div class="layout-menu-left">
        <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" @on-select="handleSelect">
          <div class="layout-logo-left">
            <b style="color:#c4e2ff">机器学习平台</b>
          </div>
          <Submenu name="1">
            <template slot="title">
              <Icon type="ios-navigate"></Icon>
              我的项目
            </template>
            <Menu-item name="projectscontroller">项目管理</Menu-item>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              <Icon type="ios-keypad"></Icon>
              数据源
            </template>
            <Menu-item name="uploaddata">上传数据</Menu-item>
            <Menu-item name="data">数据查看</Menu-item>
          </Submenu>
          <!--<Submenu name="3">-->
            <!--<template slot="title">-->
              <!--<Icon type="ios-analytics"></Icon>-->
              <!--机器学习-->
            <!--</template>-->
            <!--<Menu-item name="components">组件库</Menu-item>-->
          <!--</Submenu>-->
        </Menu>
      </div>
      <div class="layout-right">
        <div class="layout-header">
          <div class="layout-breadcrumb">
            <Breadcrumb>
              <Breadcrumb-item href="/">首页</Breadcrumb-item>
              <Breadcrumb-item>机器学习</Breadcrumb-item>
            </Breadcrumb>
          </div>
          <div class="layout-icon">
            <Avatar src="http://placekitten.com/g/150/0" style="background: #619fe7;margin-left: 10px;"></Avatar>
          </div>
        </div>
        <div class="layout-content">
          <div class="layout-content-main">
            <router-view></router-view>
          </div>
        </div>
        <div class="layout-copy">
          2018 &copy; Fdu Sonic Lab
        </div>
      </div>
    </Row>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      handleSelect(key){
        this.$router.push({ name: key});
      }
    }
  }
</script>

<style scoped>
  @import "./Main.less";
</style>
