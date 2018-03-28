<template>
  <div id="CompConfig" v-show="isVisible">
    <a class="config-close" @click="close"><i class="ivu-icon config-close-icon"></i></a>
    <div class="config-header">
      <div class="config-header-content">
        <slot name="header"></slot>
      </div>
    </div>
    <div class="config-body">
      <slot name="body"></slot>
    </div>

    <div class="config-footer">
      <slot name="footer"></slot>
      <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="close"><!----> <!----> <span>取消</span></button>
      <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="close"><!----> <!----> <span>确定</span></button>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['isVisible'],
    data: function () {
      return {

      }
    },
    methods: {
      close() {
        this.$emit('onCancel');
      },
    },
  }
</script>

<style>
  @import "CompConfig.css";
</style>
